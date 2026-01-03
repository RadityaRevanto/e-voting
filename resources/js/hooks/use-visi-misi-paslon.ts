import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface UpdateVisiMisiPayload {
  visi?: string | null;
  misi?: string | null;
}

/**
 * Hook untuk mengelola data visi & misi paslon yang sedang login.
 * 
 * @example
 * ```tsx
 * const { visi, misi, loading, submitting, error, updateVisiMisi } = useVisiMisiPaslon();
 * 
 * const handleUpdate = async () => {
 *   await updateVisiMisi({ visi: 'Visi baru', misi: 'Misi baru' });
 * };
 * ```
 */

interface PaslonData {
  id: number;
  user_id: number;
  nama_ketua: string;
  nama_wakil_ketua: string;
  visi: string | null;
  misi: string | null;
  foto_paslon: string | null;
  [key: string]: unknown;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UseVisiMisiPaslonResult {
  visi: string | null;
  misi: string | null;
  namaKetua: string | null;
  namaWakilKetua: string | null;
  fotoProfil: string | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  fetchVisiMisi: () => Promise<void>;
  updateVisiMisi: (payload: UpdateVisiMisiPayload) => Promise<void>;
}

/**
 * Custom hook untuk fetch dan update visi & misi paslon.
 * 
 * Features:
 * - Auto fetch saat mount (jika autoFetch = true)
 * - Race condition protection
 * - Memory leak prevention
 * - Double submit prevention
 * - Token refresh handling (via apiClient)
 * - Type-safe dengan TypeScript
 * 
 * @param autoFetch - Apakah akan fetch otomatis saat mount (default: true)
 * @returns Object berisi state dan actions untuk visi & misi
 */
export function useVisiMisiPaslon(
  autoFetch: boolean = true
): UseVisiMisiPaslonResult {
  const [visi, setVisi] = useState<string | null>(null);
  const [misi, setMisi] = useState<string | null>(null);
  const [namaKetua, setNamaKetua] = useState<string | null>(null);
  const [namaWakilKetua, setNamaWakilKetua] = useState<string | null>(null);
  const [fotoProfil, setFotoProfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchVisiMisi = useCallback(async (): Promise<void> => {
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/api/paslon/profile');

      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          setError(null);
          setVisi(null);
          setMisi(null);
          setNamaKetua(null);
          setNamaWakilKetua(null);
          setFotoProfil(null);
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
            : 'Gagal mengambil data visi & misi';
        throw new Error(errorMessage);
      }

      const data: ApiResponse<PaslonData> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Gagal mengambil data visi & misi');
      }

      if (!data.data || typeof data.data !== 'object') {
        throw new Error('Data paslon tidak valid');
      }

      const paslon = data.data;

      if (!isMountedRef.current) {
        return;
      }

      setVisi(paslon.visi ?? null);
      setMisi(paslon.misi ?? null);
      setNamaKetua(paslon.nama_ketua ?? null);
      setNamaWakilKetua(paslon.nama_wakil_ketua ?? null);
      setFotoProfil(paslon.foto_paslon ?? null);
    } catch (err: unknown) {
      if (!isMountedRef.current) {
        return;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data visi & misi';

      setError(errorMessage);
      setVisi(null);
      setMisi(null);
      setNamaKetua(null);
      setNamaWakilKetua(null);
      setFotoProfil(null);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, []);

  const updateVisiMisi = useCallback(
    async (payload: UpdateVisiMisiPayload): Promise<void> => {
      if (isSubmittingRef.current) {
        return;
      }

      if (payload.visi === undefined && payload.misi === undefined) {
        setError('Minimal salah satu field (visi atau misi) harus diisi');
        return;
      }

      try {
        isSubmittingRef.current = true;
        setSubmitting(true);
        setError(null);

        const requestBody: UpdateVisiMisiPayload = {};
        if (payload.visi !== undefined) {
          requestBody.visi = payload.visi === '' ? null : payload.visi;
        }
        if (payload.misi !== undefined) {
          requestBody.misi = payload.misi === '' ? null : payload.misi;
        }

        const response = await apiClient.post(
          '/api/paslon/update-visi-misi',
          requestBody
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            typeof errorData === 'object' &&
            errorData !== null &&
            'message' in errorData
              ? String(errorData.message)
              : 'Gagal mengupdate visi & misi';
          throw new Error(errorMessage);
        }

        const data: ApiResponse<PaslonData> = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Gagal mengupdate visi & misi');
        }

        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Data paslon tidak valid');
        }

        const paslon = data.data;

        if (!isMountedRef.current) {
          return;
        }

        setVisi(paslon.visi ?? null);
        setMisi(paslon.misi ?? null);
        setNamaKetua(paslon.nama_ketua ?? null);
        setNamaWakilKetua(paslon.nama_wakil_ketua ?? null);
        setFotoProfil(paslon.foto_paslon ?? null);
      } catch (err: unknown) {
        if (!isMountedRef.current) {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Terjadi kesalahan saat mengupdate visi & misi';

        setError(errorMessage);
      } finally {
        if (isMountedRef.current) {
          setSubmitting(false);
        }
        isSubmittingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    if (autoFetch) {
      fetchVisiMisi();
    }
  }, [autoFetch, fetchVisiMisi]);

  return {
    visi,
    misi,
    namaKetua,
    namaWakilKetua,
    fotoProfil,
    loading,
    submitting,
    error,
    fetchVisiMisi,
    updateVisiMisi,
  };
}

