import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import type { Candidate } from '@/pages/dashboard/user/vote/_components/candidate-card';
import type { Paslon } from './use-paslon';

/**
 * Interface untuk response API paslon voter
 */
interface VoterPaslonApiResponse {
  success: boolean;
  message: string;
  data: Paslon[];
}

/**
 * Return type dari hook useVoterPaslon
 */
export interface UseVoterPaslonResult {
  // State
  candidates: Candidate[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCandidates: () => Promise<void>;
  reset: () => void;
}

/**
 * Mapping Paslon ke Candidate
 */
const mapPaslonToCandidate = (paslon: Paslon): Candidate => {
  // Gabungkan nama ketua dan wakil ketua untuk name
  const name = paslon.nama_wakil_ketua
    ? `${paslon.nama_ketua} & ${paslon.nama_wakil_ketua}`
    : paslon.nama_ketua;

  // Gunakan jurusan ketua atau wakil ketua untuk department
  const department = paslon.jurusan_ketua || paslon.jurusan_wakil_ketua || '';

  // Gunakan foto_paslon jika ada, atau fallback ke default image
  const image = paslon.foto_paslon
    ? `/storage/${paslon.foto_paslon}`
    : '/assets/images/user/imges.jpg';

  return {
    id: paslon.id,
    name,
    department,
    image,
  };
};

/**
 * Custom hook untuk mengambil data paslon untuk voter
 * 
 * Hook ini menangani:
 * - Fetch data paslon dari endpoint `/api/voter/paslon/`
 * - Mapping Paslon ke format Candidate
 * - State management untuk loading dan error
 * 
 * @param autoFetch Apakah akan fetch otomatis saat component mount (default: true)
 * @returns Object berisi candidates, loading, error, dan handler
 * 
 * @example
 * ```tsx
 * const {
 *   candidates,
 *   loading,
 *   error,
 *   fetchCandidates,
 * } = useVoterPaslon();
 * 
 * return (
 *   <div>
 *     {loading && <Spinner />}
 *     {error && <Alert>{error}</Alert>}
 *     {candidates.map(candidate => (
 *       <CandidateCard key={candidate.id} candidate={candidate} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useVoterPaslon(autoFetch: boolean = true): UseVoterPaslonResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/voter/paslon/');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          typeof errorData === 'object' &&
          errorData !== null &&
          'message' in errorData
            ? String(errorData.message)
            : 'Gagal mengambil data paslon';
        throw new Error(errorMessage);
      }

      const data: VoterPaslonApiResponse = await response.json();

      // Validasi response structure
      if (!data.success || !Array.isArray(data.data)) {
        setCandidates([]);
        return;
      }

      // Validasi setiap item dalam array dan mapping ke Candidate
      const validCandidates: Candidate[] = data.data
        .filter((item): item is Paslon => {
          return (
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'number' &&
            typeof item.nama_ketua === 'string'
          );
        })
        .map(mapPaslonToCandidate);

      setCandidates(validCandidates);
    } catch (err: unknown) {
      console.error('Error fetching voter paslon:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data paslon';

      setError(errorMessage);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCandidates([]);
    setError(null);
    setLoading(false);
  }, []);

  // Auto fetch saat component mount jika autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchCandidates();
    }
  }, [autoFetch, fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    reset,
  };
}

