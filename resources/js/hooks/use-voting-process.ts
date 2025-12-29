import { useCallback, useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface VotingStatistic {
  id: number;
  value: number;
  label: string;
  circleColor: string;
}

interface VotingProcessApiResponse {
  success: boolean;
  message: string;
  data: {
    vilager_total: number;
    vote_total: number;
    golput: number;
  };
}

interface UseVotingProcessResult {
  // State
  statistics: VotingStatistic[];
  loading: boolean;
  error: string | null;
  totalRegistered: number;
  totalVotes: number;
  totalGolput: number;

  // Actions
  fetchVotingProcess: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook untuk mengambil dan mengelola data voting process statistics
 * @param autoFetch - Apakah data akan di-fetch otomatis saat component mount (default: true)
 * @returns Object berisi state dan actions untuk voting process statistics
 */
export function useVotingProcess(
  autoFetch: boolean = true
): UseVotingProcessResult {
  const [statistics, setStatistics] = useState<VotingStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalGolput, setTotalGolput] = useState(0);

  const fetchVotingProcess = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/api/admin/vote/voting-process");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData
          ? String(errorData.message)
          : "Gagal mengambil data voting process";
        throw new Error(errorMessage);
      }

      const data: VotingProcessApiResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error("Data voting process tidak valid");
      }

      const { vilager_total, vote_total, golput } = data.data;

      // Validasi runtime untuk memastikan nilai adalah number yang valid
      const validatedVilagerTotal = typeof vilager_total === 'number' && vilager_total >= 0 ? vilager_total : 0;
      const validatedVoteTotal = typeof vote_total === 'number' && vote_total >= 0 ? vote_total : 0;
      const validatedGolput = typeof golput === 'number' && golput >= 0 ? golput : 0;

      // Set individual values
      setTotalRegistered(validatedVilagerTotal);
      setTotalVotes(validatedVoteTotal);
      setTotalGolput(validatedGolput);

      // Transform data menjadi format VotingStatistic
      const transformedStatistics: VotingStatistic[] = [
        {
          id: 1,
          value: validatedVilagerTotal,
          label: "Total Numbers Of Registered Votes",
          circleColor: "#53599b",
        },
        {
          id: 2,
          value: validatedVoteTotal,
          label: "Total Numbers Of Votes",
          circleColor: "#53599b",
        },
        {
          id: 3,
          value: validatedGolput,
          label: "Total Numbers of Golput",
          circleColor: "#ebedff",
        },
      ];

      setStatistics(transformedStatistics);
    } catch (err: unknown) {
      console.error("Error fetching voting process:", err);
      const errorMessage = err instanceof Error
        ? err.message
        : "Terjadi kesalahan saat mengambil data voting process";

      setError(errorMessage);
      setStatistics([]);
      setTotalRegistered(0);
      setTotalVotes(0);
      setTotalGolput(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatistics([]);
    setError(null);
    setLoading(false);
    setTotalRegistered(0);
    setTotalVotes(0);
    setTotalGolput(0);
  }, []);

  // Auto fetch saat component mount jika autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchVotingProcess();
    }
  }, [autoFetch, fetchVotingProcess]);

  return {
    statistics,
    loading,
    error,
    totalRegistered,
    totalVotes,
    totalGolput,
    fetchVotingProcess,
    reset,
  };
}

