import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * Interface untuk response API
 */
interface ApiResponse {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[] | string>;
}

/**
 * Interface untuk return value dari hook
 */
interface UseRegisterNIKResult {
    nik: string;
    error: string;
    success: boolean;
    loading: boolean;
    handleNIKChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    reset: () => void;
}

/**
 * Custom hook untuk menangani logic register NIK
 * 
 * Features:
 * - Validasi NIK (16 digit angka)
 * - Mengirim NIK mentah sebagai integer ke API (backend akan melakukan hashing)
 * - Error handling untuk duplikasi dan error lainnya
 * - Loading state management
 * - Double submit prevention
 * - Auto reset form setelah sukses
 * 
 * @returns Object berisi state dan handler functions untuk form register NIK
 * 
 * @example
 * ⁠ tsx
 * const {
 *   nik,
 *   error,
 *   success,
 *   loading,
 *   handleNIKChange,
 *   handleSubmit,
 *   reset
 * } = useRegisterNIK();
 *  ⁠
 */
export function useRegisterNIK(): UseRegisterNIKResult {
    // State management
    const [nik, setNik] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Ref untuk mencegah double submit
    const isSubmittingRef = useRef(false);

    /**
     * Handler untuk perubahan input NIK
     * Otomatis menghapus karakter non-angka dan clear error/success
     */
    const handleNIKChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const value = e.target.value.replace(/\D/g, ""); // Hanya angka
            setNik(value);

            // Clear error dan success saat user mengetik
            if (error) setError("");
            if (success) setSuccess(false);
        },
        [error, success]
    );

    /**
     * Reset form ke state awal
     */
    const reset = useCallback((): void => {
        setNik("");
        setError("");
        setSuccess(false);
        setLoading(false);
        isSubmittingRef.current = false;
    }, []);

    /**
     * Handler untuk submit form
     * Melakukan validasi client-side dan mengirim request ke API
     * Backend akan melakukan hashing SHA-256 secara otomatis
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();

            // Prevent double submit
            if (isSubmittingRef.current || loading) {
                return;
            }

            // Reset state
            setError("");
            setSuccess(false);
            setLoading(true);
            isSubmittingRef.current = true;

            try {
                // Validasi NIK (16 digit angka)
                if (nik.length !== 16 || !/^\d+$/.test(nik)) {
                    setError("NIK harus terdiri dari 16 digit angka");
                    setLoading(false);
                    isSubmittingRef.current = false;
                    return;
                }

                // Kirim NIK mentah sebagai integer ke API
                // Backend akan melakukan hashing sendiri
                const response = await apiClient.post("/api/admin/register-nik", {
                    nik: parseInt(nik, 10),
                });

                // Parse response
                const data: ApiResponse = await response.json().catch(() => ({}));

                // Handle response berdasarkan status code
                if (response.ok && data.success) {
                    // Success
                    setSuccess(true);
                    setNik(""); // Reset form
                    // Auto reset success message setelah 5 detik
                    setTimeout(() => {
                        setSuccess(false);
                    }, 5000);
                } else if (response.status === 422) {
                    // Duplikasi atau validasi gagal
                    setError(
                        data.message ||
                            "NIK sudah terdaftar atau tidak valid. Silakan coba dengan NIK lain."
                    );
                } else if (response.status === 401) {
                    // Unauthorized - user tidak terautentikasi / token invalid
                    setError("Anda tidak memiliki akses untuk melakukan operasi ini.");
                } else if (response.status === 403) {
                    // Forbidden - user bukan admin
                    setError("Akses ditolak. Pastikan Anda memiliki izin yang diperlukan.");
                } else {
                    // Generic error untuk status code lainnya
                    setError(
                        data.message ||
                            "Terjadi kesalahan saat mendaftarkan NIK. Silakan coba lagi."
                    );
                }
            } catch (err: unknown) {
                // Network error atau error lainnya
                console.error("Error registering NIK:", err);

                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Terjadi kesalahan saat mengirim data. Silakan coba lagi.";

                setError(errorMessage);
            } finally {
                setLoading(false);
                isSubmittingRef.current = false;
            }
        },
        [nik, loading]
    );

    return {
        nik,
        error,
        success,
        loading,
        handleNIKChange,
        handleSubmit,
        reset,
    };
}