import { useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Paslon } from './use-paslon';

/**
 * Interface untuk response API detail paslon
 */
interface PaslonDetailApiResponse {
  success: boolean;
  message: string;
  data: Paslon;
}

/**
 * Return type dari hook usePaslonDetail
 */
export interface UsePaslonDetailResult {
  // State
  paslon: Paslon | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPaslonDetail: (id: number) => Promise<void>;
  reset: () => void;
}

/**
 * Parse misi dari string ke array
 * Misi bisa berupa JSON string atau string biasa yang dipisah dengan newline
 */
const parseMisi = (misi: string | null | undefined): string[] => {
  if (!misi) return [];
  
  try {
    // Coba parse sebagai JSON
    const parsed = JSON.parse(misi);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    // Jika bukan array, coba split berdasarkan newline
    return misi
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  } catch {
    // Jika bukan JSON, split berdasarkan newline
    return misi
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  }
};

/**
 * Custom hook untuk mengambil detail paslon berdasarkan ID
 * 
 * @param id ID paslon yang ingin diambil
 * @param autoFetch Apakah akan fetch otomatis saat component mount (default: true)
 * @returns Object berisi paslon, loading, error, dan handler
 * 
 * @example
 * ```tsx
 * const {
 *   paslon,
 *   loading,
 *   error,
 *   fetchPaslonDetail,
 * } = usePaslonDetail(candidateId);
 * 
 * return (
 *   <div>
 *     {loading && <Spinner />}
 *     {error && <Alert>{error}</Alert>}
 *     {paslon && <PaslonDetail paslon={paslon} />}
 *   </div>
 * );
 * ```
 */
export function usePaslonDetail(
  id: number | null | undefined,
  autoFetch: boolean = true
): UsePaslonDetailResult {
  const [paslon, setPaslon] = useState<Paslon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPaslonDetail = useCallback(
    async (paslonId: number): Promise<void> => {
      // Guard: Jangan jalankan request baru jika request sebelumnya belum selesai
      if (isFetchingRef.current) {
        return;
      }

      // Validasi ID
      if (!paslonId || typeof paslonId !== 'number' || paslonId <= 0) {
        setError('ID paslon tidak valid');
        setPaslon(null);
        return;
      }

      try {
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);

        const response = await apiClient.get(`/api/voter/paslon/${paslonId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Data paslon tidak ditemukan');
            setPaslon(null);
            if (isMountedRef.current) {
              setLoading(false);
            }
            isFetchingRef.current = false;
            return;
          }

          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            typeof errorData === 'object' &&
            errorData !== null &&
            'message' in errorData
              ? String(errorData.message)
              : 'Gagal mengambil data paslon';
          throw new Error(errorMessage);
        }

        const data: PaslonDetailApiResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.message || 'Data paslon tidak valid');
        }

        // Validasi data paslon
        const paslonData = data.data;
        if (
          typeof paslonData !== 'object' ||
          paslonData === null ||
          typeof paslonData.id !== 'number' ||
          typeof paslonData.nama_ketua !== 'string' ||
          typeof paslonData.nama_wakil_ketua !== 'string'
        ) {
          throw new Error('Data paslon tidak valid');
        }

        if (!isMountedRef.current) {
          return;
        }

        setPaslon(paslonData);
      } catch (err: unknown) {
        if (!isMountedRef.current) {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengambil data paslon';

        setError(errorMessage);
        setPaslon(null);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
        isFetchingRef.current = false;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setPaslon(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto fetch saat component mount jika autoFetch = true dan id tersedia
  useEffect(() => {
    if (autoFetch && id) {
      fetchPaslonDetail(id);
    }
  }, [autoFetch, id, fetchPaslonDetail]);

  return {
    paslon,
    loading,
    error,
    fetchPaslonDetail,
    reset,
  };
}

/**
 * Helper function untuk parse misi dari paslon
 */
export const getPaslonMisi = (paslon: Paslon | null): string[] => {
  if (!paslon || !paslon.misi) return [];
  return parseMisi(paslon.misi);
};

