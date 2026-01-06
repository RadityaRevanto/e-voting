import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient } from "../lib/api-client";

export type ActivityStatus = "ongoing" | "pending" | "concluded";

export interface Activity {
  id: number;
  title: string;
  status: ActivityStatus;
  date: string; // Format: DD/MM/YYYY
}

interface Schedule {
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
  data: Schedule[] | Schedule | null;
}

interface UseElectionActivitiesResult {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Validasi Schedule object
 */
const isValidSchedule = (item: unknown): item is Schedule => {
  if (typeof item !== "object" || item === null) {
    return false;
  }

  const schedule = item as Record<string, unknown>;

  return (
    typeof schedule.id === "number" &&
    typeof schedule.title === "string" &&
    typeof schedule.start_time === "string" &&
    typeof schedule.end_time === "string" &&
    (schedule.tag === "registration" ||
      schedule.tag === "voting" ||
      schedule.tag === "announcement") &&
    typeof schedule.created_at === "string" &&
    typeof schedule.updated_at === "string"
  );
};

/**
 * Menentukan status activity berdasarkan waktu sekarang
 */
const getActivityStatus = (startTime: string, endTime: string): ActivityStatus => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "pending";
  }

  if (now >= start && now <= end) {
    return "ongoing";
  } else if (now < start) {
    return "pending";
  } else {
    return "concluded";
  }
};

/**
 * Format tanggal dari ISO string ke DD/MM/YYYY
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

/**
 * Transform Schedule menjadi Activity
 */
const transformScheduleToActivity = (schedule: Schedule): Activity => {
  return {
    id: schedule.id,
    title: schedule.title,
    status: getActivityStatus(schedule.start_time, schedule.end_time),
    date: formatDate(schedule.start_time),
  };
};

/**
 * Hook untuk mengambil dan mengelola data election activities
 * @param autoFetch Apakah akan fetch otomatis saat mount (default: true)
 * @returns Object berisi activities, loading, error, dan refetch function
 */
export function useElectionActivities(
  autoFetch: boolean = true
): UseElectionActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref untuk mencegah race condition dan memory leak
  const isFetchingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  /**
   * Fetch schedules dari API dan transform menjadi activities
   */
  const fetchActivities = useCallback(async (): Promise<void> => {
    // Guard: Jangan jalankan request baru jika request sebelumnya belum selesai
    if (isFetchingRef.current) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/api/schedules", {
        headers: {
          Accept: "application/json",
        },
      });

      // Check jika component sudah unmount
      if (!mountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData
            ? String(errorData.message)
            : "Gagal mengambil data activities";
        throw new Error(errorMessage);
      }

      const data: ScheduleApiResponse = await response.json();

      // Check jika component sudah unmount
      if (!mountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      // Validasi response structure
      if (!data.success) {
        throw new Error(data.message || "Format data tidak valid");
      }

      // Normalize data ke array
      let schedules: Schedule[] = [];

      if (data.data === null) {
        schedules = [];
      } else if (Array.isArray(data.data)) {
        schedules = data.data.filter(isValidSchedule);
      } else if (isValidSchedule(data.data)) {
        schedules = [data.data];
      } else {
        schedules = [];
      }

      // Transform schedules menjadi activities
      const transformedActivities = schedules
        .map(transformScheduleToActivity)
        .filter((activity) => activity.date !== ""); // Filter activities dengan tanggal valid

      // Sort activities: ongoing first, then pending, then concluded
      transformedActivities.sort((a, b) => {
        const statusOrder: Record<ActivityStatus, number> = {
          ongoing: 0,
          pending: 1,
          concluded: 2,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      if (mountedRef.current) {
        setActivities(transformedActivities);
      }
    } catch (err: unknown) {
      // Jangan update state jika component sudah unmount
      if (!mountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data activities";

      if (mountedRef.current) {
        setError(errorMessage);
        setActivities([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, []);

  /**
   * Refetch activities (alias untuk fetchActivities)
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchActivities();
  }, [fetchActivities]);

  // Auto fetch saat component mount
  useEffect(() => {
    mountedRef.current = true;

    if (autoFetch) {
      fetchActivities();
    }

    // Cleanup: set mounted ke false saat component unmount
    return () => {
      mountedRef.current = false;
    };
  }, [autoFetch, fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch,
  };
}

