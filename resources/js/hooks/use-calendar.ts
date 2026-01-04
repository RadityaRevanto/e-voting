import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { apiClient } from "../lib/api-client";

export type CalendarView = "today" | "nextWeek" | "thisMonth";

/**
 * Alias untuk kompatibilitas dengan komponen yang sudah ada
 * Mapping: next_week -> nextWeek, this_month -> thisMonth
 */
export type CalendarPeriod = "today" | "next_week" | "this_month";

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

interface UseCalendarResult {
    schedules: Schedule[];
    currentEvent: Schedule | null;
    view: CalendarView;
    loading: boolean;
    error: string | null;
    setView: (view: CalendarView) => void;
    refreshSchedules: () => Promise<void>;
}

/**
 * Konstanta untuk perhitungan tanggal
 */
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;

/**
 * Mendapatkan tanggal awal dan akhir berdasarkan view mode
 * @param view Mode tampilan calendar
 * @returns Object berisi startDate dan endDate
 */
const getDateRange = (view: CalendarView): { startDate: Date; endDate: Date } => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (view) {
        case "today": {
            const endOfToday = new Date(startOfToday);
            endOfToday.setHours(23, 59, 59, 999);
            return {
                startDate: startOfToday,
                endDate: endOfToday,
            };
        }
        case "nextWeek": {
            const endOfWeek = new Date(startOfToday);
            endOfWeek.setDate(endOfWeek.getDate() + DAYS_IN_WEEK);
            endOfWeek.setHours(23, 59, 59, 999);
            return {
                startDate: startOfToday,
                endDate: endOfWeek,
            };
        }
        case "thisMonth": {
            const endOfMonth = new Date(startOfToday);
            endOfMonth.setDate(endOfMonth.getDate() + DAYS_IN_MONTH);
            endOfMonth.setHours(23, 59, 59, 999);
            return {
                startDate: startOfToday,
                endDate: endOfMonth,
            };
        }
        default: {
            const endOfToday = new Date(startOfToday);
            endOfToday.setHours(23, 59, 59, 999);
            return {
                startDate: startOfToday,
                endDate: endOfToday,
            };
        }
    }
};

/**
 * Memfilter schedules berdasarkan view mode
 * @param schedules Array semua schedules
 * @param view Mode tampilan calendar
 * @returns Array schedules yang sesuai dengan view
 */
const filterSchedulesByView = (
    schedules: Schedule[],
    view: CalendarView
): Schedule[] => {
    if (schedules.length === 0) {
        return [];
    }

    const { startDate, endDate } = getDateRange(view);

    return schedules.filter((schedule) => {
        try {
            const scheduleStart = new Date(schedule.start_time);
            const scheduleEnd = new Date(schedule.end_time);

            // Validasi tanggal
            if (isNaN(scheduleStart.getTime()) || isNaN(scheduleEnd.getTime())) {
                return false;
            }

            // Schedule termasuk jika:
            // - Start time berada dalam range, atau
            // - End time berada dalam range, atau
            // - Schedule mencakup seluruh range (start sebelum range, end setelah range)
            const startsInRange = scheduleStart >= startDate && scheduleStart <= endDate;
            const endsInRange = scheduleEnd >= startDate && scheduleEnd <= endDate;
            const coversRange = scheduleStart <= startDate && scheduleEnd >= endDate;

            return startsInRange || endsInRange || coversRange;
        } catch {
            return false;
        }
    });
};

/**
 * Validasi Schedule object
 * @param item Item yang akan divalidasi
 * @returns true jika valid, false jika tidak
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
 * Hook untuk mengambil dan mengelola data calendar/schedule
 * @param autoFetch Apakah akan fetch otomatis saat mount (default: true)
 * @param initialView View mode awal (default: "today")
 * @returns Object berisi state dan actions untuk calendar
 */
export function useCalendar(
    autoFetch: boolean = true,
    initialView: CalendarView = "today"
): UseCalendarResult {
    const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
    const [currentEvent, setCurrentEvent] = useState<Schedule | null>(null);
    const [view, setViewState] = useState<CalendarView>(initialView);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref untuk mencegah race condition dan memory leak
    const isFetchingRef = useRef<boolean>(false);
    const mountedRef = useRef<boolean>(true);
    const hasLoadedRef = useRef<boolean>(false);

    /**
     * Fetch semua schedules dari API
     */
    const fetchSchedules = useCallback(async (): Promise<void> => {
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
                        : "Gagal mengambil data schedules";
                throw new Error(errorMessage);
            }

            const data: ScheduleApiResponse = await response.json();

            // Check jika component sudah unmount setelah async operation
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

            if (mountedRef.current) {
                setAllSchedules(schedules);
                hasLoadedRef.current = true;
            }
        } catch (err: unknown) {
            // Jangan update state jika component unmount
            if (!mountedRef.current) {
                setLoading(false);
                isFetchingRef.current = false;
                return;
            }

            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Terjadi kesalahan saat mengambil data schedules";

            if (mountedRef.current) {
                setError(errorMessage);
                // Jangan reset allSchedules saat error jika data sudah pernah di-load
                // Hanya reset jika ini adalah first load yang gagal
                if (!hasLoadedRef.current) {
                    setAllSchedules([]);
                }
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
            isFetchingRef.current = false;
        }
    }, []); // ✅ Empty dependencies - fungsi stabil

    /**
     * Fetch current event dari API
     */
    const fetchCurrentEvent = useCallback(async (): Promise<void> => {
        try {
            const response = await apiClient.get("/api/schedules/current", {
                headers: {
                    Accept: "application/json",
                },
            });

            // Check jika component sudah unmount
            if (!mountedRef.current) {
                return;
            }

            if (!response.ok) {
                // Jika tidak ada current event, set null
                if (response.status === 404 || response.status === 200) {
                    const data = await response.json().catch(() => ({}));
                    if (
                        typeof data === "object" &&
                        data !== null &&
                        "success" in data &&
                        data.success === false
                    ) {
                        setCurrentEvent(null);
                        return;
                    }
                }
                return;
            }

            const data: ScheduleApiResponse = await response.json();

            // Check jika component sudah unmount
            if (!mountedRef.current) {
                return;
            }

            // Validasi response
            if (data.success && data.data !== null && isValidSchedule(data.data)) {
                setCurrentEvent(data.data);
            } else {
                setCurrentEvent(null);
            }
        } catch (err: unknown) {
            // Silent fail untuk current event, tidak perlu set error
            if (mountedRef.current) {
                setCurrentEvent(null);
            }
        }
    }, []); // ✅ Empty dependencies - fungsi stabil

    /**
     * Refresh schedules (fetch ulang semua data)
     */
    const refreshSchedules = useCallback(async (): Promise<void> => {
        await Promise.all([fetchSchedules(), fetchCurrentEvent()]);
    }, [fetchSchedules, fetchCurrentEvent]); // ✅ Dependencies stabil karena fetchSchedules dan fetchCurrentEvent stabil

    /**
     * Set view mode
     */
    const setView = useCallback((newView: CalendarView): void => {
        setViewState(newView);
    }, []);

    /**
     * Filter schedules berdasarkan view mode (memoized)
     */
    const schedules = useMemo(() => {
        return filterSchedulesByView(allSchedules, view);
    }, [allSchedules, view]);

    // Auto fetch saat component mount
    useEffect(() => {
        mountedRef.current = true;

        if (autoFetch) {
            refreshSchedules();
        }

        // Cleanup saat component unmount
        return () => {
            mountedRef.current = false;
        };
    }, [autoFetch, refreshSchedules]); // ✅ refreshSchedules sekarang stabil, tidak menyebabkan infinite loop

    return {
        schedules,
        currentEvent,
        view,
        loading,
        error,
        setView,
        refreshSchedules,
    };
}