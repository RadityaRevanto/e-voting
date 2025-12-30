import { useCallback, useState, useEffect, useRef } from "react";
import { apiClient } from "../lib/api-client";
import { Paslon } from "./use-paslon";

export type VotingStatus = "active" | "idle" | "finished";

export interface CandidateResult {
  id: number;
  name: string;
  voteCount: number;
  percentage: number;
}

interface LiveResultApiResponse {
  success: boolean;
  message: string;
  data: {
    [key: string]: number;
  };
}

interface PaslonApiResponse {
  success: boolean;
  message: string;
  data: Paslon[];
}

interface UseLiveResultsResult {
  // State
  results: CandidateResult[];
  loading: boolean;
  error: string | null;
  totalVotes: number;

  // Actions
  fetchResults: () => Promise<void>;
  startPolling: (interval?: number) => void;
  stopPolling: () => void;
  reset: () => void;
}

/**
 * Hook untuk mengambil dan mengelola data live results voting
 * @param pollingInterval - Interval polling dalam milliseconds (default: 5000ms / 5 detik)
 * @param votingStatus - Status voting untuk mengontrol polling (default: "active")
 * @returns Object berisi state dan actions untuk live results
 */
export function useLiveResults(
  pollingInterval: number = 5000,
  votingStatus: VotingStatus = "active"
): UseLiveResultsResult {
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  
  // Refs untuk mencegah race condition dan double fetch
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const isPollingActiveRef = useRef<boolean>(false);
  const pollingStartedRef = useRef<boolean>(false);

  const fetchResults = useCallback(async () => {
    // Guard: Jangan jalankan request baru jika request sebelumnya belum selesai
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Fetch data paslon untuk mendapatkan nama
      const paslonResponse = await apiClient.get("/api/admin/paslon/");

      if (!paslonResponse.ok) {
        const errorData = await paslonResponse.json().catch(() => ({}));
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData
          ? String(errorData.message)
          : "Gagal mengambil data paslon";
        throw new Error(errorMessage);
      }

      const paslonData: PaslonApiResponse = await paslonResponse.json();

      if (!paslonData.success || !Array.isArray(paslonData.data) || paslonData.data.length === 0) {
        throw new Error("Data paslon tidak valid");
      }

      // Validasi setiap paslon dalam array
      const validPaslonList = paslonData.data.filter((item): item is Paslon => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'number' &&
          typeof item.nama_ketua === 'string' &&
          typeof item.nama_wakil_ketua === 'string'
        );
      });

      if (validPaslonList.length === 0) {
        throw new Error("Tidak ada data paslon yang valid");
      }

      // Fetch data live results
      const resultsResponse = await apiClient.get("/api/admin/vote/life-result");

      if (!resultsResponse.ok) {
        const errorData = await resultsResponse.json().catch(() => ({}));
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData
          ? String(errorData.message)
          : "Gagal mengambil data live results";
        throw new Error(errorMessage);
      }

      const resultsData: LiveResultApiResponse = await resultsResponse.json();

      if (!resultsData.success || typeof resultsData.data !== 'object' || resultsData.data === null) {
        throw new Error("Data live results tidak valid");
      }

      // Transform data menjadi format yang sesuai
      const transformedResults: CandidateResult[] = [];
      let total = 0;

      // Sort paslon by ID untuk memastikan urutan konsisten
      const sortedPaslon = [...validPaslonList].sort((a, b) => a.id - b.id);

      sortedPaslon.forEach((paslon) => {
        const voteCountKey = `paslon${paslon.id}`;
        const voteCountValue = resultsData.data[voteCountKey];
        
        // Validasi runtime untuk vote count
        const voteCount = typeof voteCountValue === 'number' && voteCountValue >= 0 
          ? voteCountValue 
          : 0;

        total += voteCount;

        transformedResults.push({
          id: paslon.id,
          name: `${paslon.nama_ketua} & ${paslon.nama_wakil_ketua}`,
          voteCount,
          percentage: 0, // Akan dihitung setelah total diketahui
        });
      });

      // Hitung persentase di frontend untuk menjaga konsistensi
      transformedResults.forEach((result) => {
        if (total > 0) {
          result.percentage = (result.voteCount / total) * 100;
        } else {
          result.percentage = 0;
        }
      });

      // Sort by percentage descending
      transformedResults.sort((a, b) => b.percentage - a.percentage);

      setResults(transformedResults);
      setTotalVotes(total);
    } catch (err: unknown) {
      console.error("Error fetching live results:", err);
      const errorMessage = err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat mengambil data live results";
      
      setError(errorMessage);
      setResults([]);
      setTotalVotes(0);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingActiveRef.current = false;
  }, []);

  const startPolling = useCallback(
    (interval: number = pollingInterval) => {
      // Guard: Polling hanya berjalan satu kali
      if (pollingStartedRef.current || isPollingActiveRef.current) {
        return;
      }

      // Stop polling yang sudah ada (jika ada) - cleanup sebelum membuat yang baru
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      // Mark polling sebagai aktif
      isPollingActiveRef.current = true;
      pollingStartedRef.current = true;

      // Fetch sekali dulu
      fetchResults();

      // Set interval untuk polling
      pollingIntervalRef.current = setInterval(() => {
        // Hanya fetch jika voting status active dan tidak sedang fetching
        if (votingStatus === "active" && !isFetchingRef.current) {
          fetchResults();
        } else if (votingStatus !== "active") {
          // Stop polling jika status bukan active
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          isPollingActiveRef.current = false;
        }
      }, interval);
    },
    [fetchResults, pollingInterval, votingStatus]
  );

  const reset = useCallback(() => {
    stopPolling();
    pollingStartedRef.current = false;
    isFetchingRef.current = false;
    setResults([]);
    setError(null);
    setLoading(false);
    setTotalVotes(0);
  }, [stopPolling]);

  // Effect untuk mengontrol polling berdasarkan voting status
  useEffect(() => {
    // Jika status bukan active, stop polling
    if (votingStatus !== "active") {
      stopPolling();
      return;
    }

    // Jika status active dan polling belum dimulai, start polling
    if (!pollingStartedRef.current) {
      startPolling();
    }

    // Cleanup saat unmount atau status berubah
    return () => {
      stopPolling();
    };
  }, [votingStatus, startPolling, stopPolling]);

  // Cleanup saat unmount - pastikan semua interval dihentikan
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      pollingStartedRef.current = false;
      isFetchingRef.current = false;
      isPollingActiveRef.current = false;
    };
  }, []);

  return {
    results,
    loading,
    error,
    totalVotes,
    fetchResults,
    startPolling: startPolling,
    stopPolling,
    reset,
  };
}

