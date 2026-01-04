import { useCallback, useState, useEffect, useRef } from "react";
import { apiClient } from "../lib/api-client";

export type ActivityStatus = "ongoing" | "pending" | "concluded";

export interface Activity {
  id: string;
  title: string;
  status: ActivityStatus;
  date: string;
}

interface ScheduleFromBackend {
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
  data: ScheduleFromBackend | ScheduleFromBackend[] | null;
}

export interface UseElectionActivitiesResult {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  fetchActivities: () => Promise<void>;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Menentukan status activity berdasarkan waktu saat ini
 * PENTING: Activities yang sudah selesai (now > end_time) akan tetap muncul dengan status "concluded"
 * @param startTime Waktu mulai (ISO string)
 * @param endTime Waktu selesai (ISO string)
 * @returns Status activity: "ongoing", "pending", atau "concluded"
 */
const determineActivityStatus = (
  startTime: string,
  endTime: string
): ActivityStatus => {
  try {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validasi: pastikan start dan end adalah tanggal yang valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn("Invalid date format:", { startTime, endTime });
      return "pending";
    }

    // Validasi: pastikan start_time <= end_time
    if (start > end) {
      console.warn("Start time is after end time:", { startTime, endTime });
      return "pending";
    }

    // Tentukan status berdasarkan waktu saat ini
    // PENTING: Activities yang sudah selesai (now > end_time) akan tetap muncul sebagai "concluded"
    if (now < start) {
      // Belum dimulai
      return "pending";
    } else if (now >= start && now <= end) {
      // Sedang berlangsung
      return "ongoing";
    } else {
      // Sudah selesai (now > end) - PENTING: tetap muncul sebagai concluded, tidak dihilangkan
      return "concluded";
    }
  } catch (error) {
    console.error("Error determining activity status:", error);
    return "pending";
  }
};

/**
 * Format tanggal dari ISO string ke format DD/MM/YYYY
 * @param dateString ISO date string
 * @returns Formatted date string (DD/MM/YYYY)
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Validasi: pastikan tanggal valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return dateString;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Transform schedule dari backend ke format Activity
 * @param schedule Schedule dari backend
 * @returns Activity object
 */
const transformScheduleToActivity = (
  schedule: ScheduleFromBackend
): Activity => {
  const status = determineActivityStatus(
    schedule.start_time,
    schedule.end_time
  );
  const date = formatDate(schedule.start_time);

  return {
    id: schedule.id.toString(),
    title: schedule.title,
    status,
    date,
  };
};

/**
 * Hook untuk mengambil dan mengelola data election activities
 * @param autoFetch Apakah akan fetch otomatis saat mount (default: true)
 * @returns Object berisi activities, loading state, error, dan fungsi-fungsi helper
 */
export function useElectionActivities(
  autoFetch: boolean = true
): UseElectionActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref untuk mencegah race condition dan multiple concurrent requests
  const isFetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchActivities = useCallback(async (): Promise<void> => {
    // Guard: Jangan jalankan request baru jika request sebelumnya belum selesai
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Buat AbortController untuk cancel request jika component unmount
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const endpoint = "/api/schedules/";

      const response = await apiClient.get(endpoint);

      // Check jika request di-cancel
      if (abortController.signal.aborted) {
        setLoading(false);
        isFetchingRef.current = false;
        abortControllerRef.current = null;
        return;
      }

      if (!response.ok) {
        // Coba parse error message dari response
        let errorMessage = "Gagal mengambil data activities";
        try {
          const errorData = await response.json().catch(() => ({}));
          if (
            typeof errorData === "object" &&
            errorData !== null &&
            "message" in errorData
          ) {
            errorMessage = String(errorData.message);
          }
        } catch {
          // Jika gagal parse JSON, gunakan default message
        }
        throw new Error(errorMessage);
      }

      // Parse response JSON dari API GET /api/schedules/
      let data: ScheduleApiResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response JSON:", parseError);
        throw new Error("Gagal memparse response dari server");
      }

      // Check jika request di-cancel setelah async operation
      if (abortController.signal.aborted) {
        setLoading(false);
        isFetchingRef.current = false;
        abortControllerRef.current = null;
        return;
      }

      // Handle response yang tidak success atau data null
      // API GET /api/schedules/ selalu mengembalikan array dari Schedule::all()
      if (!data.success) {
        if (data.data === null || (Array.isArray(data.data) && data.data.length === 0)) {
          setActivities([]);
          setLoading(false);
          isFetchingRef.current = false;
          abortControllerRef.current = null;
          return;
        }
      }

      // Normalize data ke array
      // Controller ScheduleController::index() selalu mengembalikan array
      let schedules: ScheduleFromBackend[] = [];

      if (data.data === null) {
        schedules = [];
      } else if (Array.isArray(data.data)) {
        // Validasi setiap item dalam array
        schedules = data.data.filter((item): item is ScheduleFromBackend => {
          return (
            typeof item === 'object' &&
            item !== null &&
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.start_time === 'string' &&
            typeof item.end_time === 'string' &&
            typeof item.tag === 'string'
          );
        });
      } else if (typeof data.data === 'object' && data.data !== null) {
        // Validasi single object (defensive programming, meskipun controller selalu return array)
        const item = data.data as ScheduleFromBackend;
        if (
          typeof item.id === 'number' &&
          typeof item.title === 'string' &&
          typeof item.start_time === 'string' &&
          typeof item.end_time === 'string' &&
          typeof item.tag === 'string'
        ) {
          schedules = [item];
        } else {
          schedules = [];
        }
      } else {
        schedules = [];
      }

      // Transform schedules ke activities (semua activities termasuk concluded akan muncul)
      const transformedActivities: Activity[] = schedules.map(
        transformScheduleToActivity
      );

      // Sort activities: ongoing first, then pending, then concluded
      // Semua activities termasuk concluded akan ditampilkan
      transformedActivities.sort((a, b) => {
        const statusOrder: Record<ActivityStatus, number> = {
          ongoing: 0,
          pending: 1,
          concluded: 2,
        };

        const statusDiff = statusOrder[a.status] - statusOrder[b.status];
        if (statusDiff !== 0) {
          return statusDiff;
        }

        // Jika status sama, sort berdasarkan date (terbaru dulu)
        // Untuk concluded activities, ini akan menampilkan yang baru selesai di atas
        try {
          const dateA = new Date(
            a.date.split("/").reverse().join("-")
          ).getTime();
          const dateB = new Date(
            b.date.split("/").reverse().join("-")
          ).getTime();
          return dateB - dateA;
        } catch {
          return 0;
        }
      });

      setActivities(transformedActivities);
    } catch (err: unknown) {
      // Jangan update state jika request di-cancel
      if (abortControllerRef.current?.signal.aborted) {
        setLoading(false);
        isFetchingRef.current = false;
        abortControllerRef.current = null;
        return;
      }

      console.error("Error fetching election activities:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data activities";

      setError(errorMessage);
      setActivities([]);
    } finally {
      // Jangan update state jika request di-cancel
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchActivities();
  }, [fetchActivities]);

  const reset = useCallback(() => {
    // Cancel ongoing request jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setActivities([]);
    setError(null);
    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // Auto fetch saat component mount jika autoFetch = true
  useEffect(() => {
    if (autoFetch) {
      fetchActivities();
    }

    // Cleanup: cancel request jika component unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchActivities]);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    refetch,
    reset,
  };
}

