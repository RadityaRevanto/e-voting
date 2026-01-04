import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface AdminProfileData {
    username: string;
    email: string;
    foto_admin: string | null;
}

export interface UseViewProfilAdminResult {
    profile: AdminProfileData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook untuk menampilkan profil admin (read-only)
 * Hanya menampilkan foto yang sudah di-post
 */
export function useViewProfilAdmin(): UseViewProfilAdminResult {
    const [profile, setProfile] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get("/api/admin/profile");

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    typeof errorData === "object" &&
                    errorData !== null &&
                    "message" in errorData
                        ? String(errorData.message)
                        : "Gagal mengambil data profil";
                setError(errorMessage);
                setLoading(false);
                return;
            }

            const data = await response.json();

            if (data.success && data.data) {
                setProfile({
                    username: data.data.username || "",
                    email: data.data.email || "",
                    foto_admin: data.data.foto_admin || null,
                });
            } else {
                setError("Data profil tidak ditemukan");
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
            setError("Terjadi kesalahan saat mengambil data profil. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
    };
}

