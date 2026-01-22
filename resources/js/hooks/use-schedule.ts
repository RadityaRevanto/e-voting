import { useCallback, useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface Schedule {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    tag: "registration" | "voting" | "announcement";
    created_at: string;
    updated_at: string;
}

interface ScheduleApiResponse {
    success: boolean;
    message: string;
    data: Schedule | Schedule[] | null;
}

interface SetSchedulePayload {
    tag: "registration" | "voting" | "announcement";
    start_time: string;
    end_time: string;
}

interface UseScheduleResult {
    // State
    schedules: Schedule[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchSchedules: () => Promise<void>;
    setSchedule: (payload: SetSchedulePayload) => Promise<void>;
    reset: () => void;
}

/**
 * Hook untuk mengambil dan mengelola data schedule
 * @param autoFetch - Apakah akan fetch otomatis saat mount
 * @returns Object berisi state dan actions untuk schedule
 */
export function useSchedule(
    autoFetch: boolean = true
): UseScheduleResult {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchedules = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get("/api/schedules/", {
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
                        : "Gagal mengambil data schedule";
                throw new Error(errorMessage);
            }

            const data: ScheduleApiResponse = await response.json();

            // Validasi response structure
            if (!data.success) {
                throw new Error(data.message || "Format data tidak valid");
            }

            // Validasi data array
            if (!Array.isArray(data.data)) {
                setSchedules([]);
                return;
            }

            // Validasi setiap schedule dalam array
            const validSchedules: Schedule[] = data.data.filter(
                (item): item is Schedule => {
                    return (
                        typeof item === "object" &&
                        item !== null &&
                        typeof item.id === "number" &&
                        typeof item.title === "string" &&
                        typeof item.start_time === "string" &&
                        typeof item.end_time === "string" &&
                        (item.tag === "registration" ||
                            item.tag === "voting" ||
                            item.tag === "announcement") &&
                        typeof item.created_at === "string" &&
                        typeof item.updated_at === "string"
                    );
                }
            );

            setSchedules(validSchedules);
        } catch (err: unknown) {
            console.error("Error fetching schedules:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengambil data schedule";

            setError(errorMessage);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const setSchedule = useCallback(async (payload: SetSchedulePayload) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.post(
                "/api/superadmin/schedules/set",
                payload,
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    typeof errorData === "object" &&
                    errorData !== null &&
                    "message" in errorData
                        ? String(errorData.message)
                        : "Gagal mengatur schedule";
                throw new Error(errorMessage);
            }

            const data: ScheduleApiResponse = await response.json();

            // Validasi response structure
            if (!data.success) {
                throw new Error(data.message || "Format data tidak valid");
            }

            // Refresh schedules setelah berhasil update
            await fetchSchedules();
        } catch (err: unknown) {
            console.error("Error setting schedule:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengatur schedule";

            setError(errorMessage);
            throw err; // Re-throw agar bisa di-handle di component
        } finally {
            setLoading(false);
        }
    }, [fetchSchedules]);

    const reset = useCallback(() => {
        setSchedules([]);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchSchedules();
        }
    }, [autoFetch, fetchSchedules]);

    return {
        schedules,
        loading,
        error,
        fetchSchedules,
        setSchedule,
        reset,
    };
}

