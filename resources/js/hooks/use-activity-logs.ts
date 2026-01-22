import { useCallback, useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface ActivityLog {
    id: number;
    session: string;
    info: string;
    context: string;
    subject: "superadmin" | "admin" | "paslon" | "voter";
    created_at: string;
}

interface ActivityLogsApiResponse {
    success: boolean;
    message: string;
    data: ActivityLog[];
}

interface UseActivityLogsParams {
    role?: "superadmin" | "admin" | "paslon" | "voter" | "all";
    autoFetch?: boolean;
}

interface UseActivityLogsResult {
    // State
    logs: ActivityLog[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchLogs: (role?: "superadmin" | "admin" | "paslon" | "voter" | "all") => Promise<void>;
    reset: () => void;
}

/**
 * Hook untuk mengambil dan mengelola data activity logs
 * @param params - Parameter untuk konfigurasi hook
 * @returns Object berisi state dan actions untuk activity logs
 */
export function useActivityLogs(
    params: UseActivityLogsParams = {}
): UseActivityLogsResult {
    const { role = "all", autoFetch = true } = params;
    
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(
        async (filterRole?: "superadmin" | "admin" | "paslon" | "voter" | "all") => {
            try {
                setLoading(true);
                setError(null);

                // Build query parameters
                const queryParams = new URLSearchParams();
                const roleToFilter = filterRole !== undefined ? filterRole : role;
                
                if (roleToFilter && roleToFilter !== "all") {
                    queryParams.append("role", roleToFilter);
                }

                const endpoint = `/api/superadmin/activity-logs${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

                const response = await apiClient.get(endpoint, {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage =
                        typeof errorData === "object" &&
                        errorData !== null &&
                        "message" in errorData
                            ? String(errorData.message)
                            : "Gagal mengambil data activity logs";
                    throw new Error(errorMessage);
                }

                const data: ActivityLogsApiResponse = await response.json();

                // Validasi response structure
                if (!data.success) {
                    throw new Error(data.message || "Format data tidak valid");
                }

                // Validasi data array
                if (!Array.isArray(data.data)) {
                    setLogs([]);
                    return;
                }

                // Validasi setiap log dalam array
                const validLogs: ActivityLog[] = data.data.filter(
                    (item): item is ActivityLog => {
                        return (
                            typeof item === "object" &&
                            item !== null &&
                            typeof item.id === "number" &&
                            typeof item.session === "string" &&
                            typeof item.info === "string" &&
                            typeof item.context === "string" &&
                            (item.subject === "superadmin" ||
                                item.subject === "admin" ||
                                item.subject === "paslon" ||
                                item.subject === "voter") &&
                            typeof item.created_at === "string"
                        );
                    }
                );

                setLogs(validLogs);
            } catch (err: unknown) {
                console.error("Error fetching activity logs:", err);
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Terjadi kesalahan saat mengambil data activity logs";

                setError(errorMessage);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const reset = useCallback(() => {
        setLogs([]);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchLogs();
        }
    }, [autoFetch, fetchLogs]);

    return {
        logs,
        loading,
        error,
        fetchLogs,
        reset,
    };
}

