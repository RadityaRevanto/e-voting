import { useCallback, useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface Paslon {
    id: number;
    user_id: number;
    nama_ketua: string;
    umur_ketua?: number;
    jurusan_ketua?: string;
    nama_wakil_ketua: string;
    umur_wakil_ketua?: number;
    jurusan_wakil_ketua?: string;
    foto_paslon?: string;
    visi?: string;
    misi?: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Paslon[];
}

interface DeleteApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

interface UsePaslonResult {
    // State
    paslonList: Paslon[];
    loading: boolean;
    error: string | null;
    deletingId: number | null;

    // Actions
    fetchPaslon: () => Promise<void>;
    deletePaslon: (id: number) => Promise<boolean>;
    reset: () => void;
}

export function usePaslon(autoFetch: boolean = true): UsePaslonResult {
    const [paslonList, setPaslonList] = useState<Paslon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchPaslon = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get("/api/admin/paslon/");

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Gagal mengambil data paslon");
            }

            const data: ApiResponse = await response.json();

            if (data.success && data.data) {
                setPaslonList(data.data);
            } else {
                setPaslonList([]);
            }
        } catch (err) {
            console.error("Error fetching paslon:", err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengambil data paslon"
            );
            setPaslonList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePaslon = useCallback(
        async (id: number): Promise<boolean> => {
            if (!id) {
                setError("ID paslon tidak valid");
                return false;
            }

            setDeletingId(id);
            setError(null);

            try {
                const response = await apiClient.delete(`/api/admin/paslon/${id}/delete`);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.message || "Gagal menghapus paslon"
                    );
                }

                const data: DeleteApiResponse = await response.json();

                if (!data.success) {
                    throw new Error(data.message || "Gagal menghapus paslon");
                }

                // Hapus dari state lokal
                setPaslonList((prev) => prev.filter((p) => p.id !== id));
                setDeletingId(null);
                return true;
            } catch (err) {
                console.error("Error deleting paslon:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Terjadi kesalahan saat menghapus paslon"
                );
                setDeletingId(null);
                return false;
            }
        },
        []
    );

    const reset = useCallback(() => {
        setPaslonList([]);
        setError(null);
        setLoading(false);
        setDeletingId(null);
    }, []);

    // Auto fetch saat component mount jika autoFetch = true
    useEffect(() => {
        if (autoFetch) {
            fetchPaslon();
        }
    }, [autoFetch, fetchPaslon]);

    return {
        paslonList,
        loading,
        error,
        deletingId,
        fetchPaslon,
        deletePaslon,
        reset,
    };
}

