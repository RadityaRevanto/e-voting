import { useCallback, useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export type CalendarPeriod = "today" | "next_week" | "this_month";

export interface CalendarTimeSlot {
  hour: number;
  minute: number;
  formatted: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  formattedDate: string;
  timeSlots: CalendarTimeSlot[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime: string;
  tag: "registration" | "voting" | "announcement";
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

export interface CalendarFilterParams {
  period?: CalendarPeriod;
  startDate?: string;
  endDate?: string;
}

export interface UseCalendarResult {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedPeriod: CalendarPeriod;
  fetchCalendar: (params?: CalendarFilterParams) => Promise<void>;
  setSelectedPeriod: (period: CalendarPeriod) => void;
  reset: () => void;
}

const formatCalendarDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    return `${month}, ${day}`;
  } catch {
    return dateString;
  }
};

const formatTimeSlot = (hour: number, minute: number = 0): string => {
  const formattedHour = hour.toString().padStart(2, "0");
  const formattedMinute = minute.toString().padStart(2, "0");
  return `${formattedHour}.${formattedMinute}`;
};

const generateTimeSlots = (
  startTime: string,
  endTime: string,
  tag?: "registration" | "voting" | "announcement"
): CalendarTimeSlot[] => {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start > end) {
      return [];
    }
    
    const durationMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];
    
    if (startDate !== endDate) {
      const startHour = start.getHours();
      const slots: CalendarTimeSlot[] = [];
      
      for (let hour = startHour; hour <= 23; hour++) {
        slots.push({
          hour,
          minute: 0,
          formatted: formatTimeSlot(hour, 0),
        });
      }
      
      return slots;
    }
    
    if (durationMinutes < 60) {
      const slots: CalendarTimeSlot[] = [];
      
      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      slots.push({
        hour: startHour,
        minute: startMinute,
        formatted: formatTimeSlot(startHour, startMinute),
      });
      
      const endHour = end.getHours();
      const endMinute = end.getMinutes();
      
      if (endHour !== startHour || endMinute !== startMinute) {
        slots.push({
          hour: endHour,
          minute: endMinute,
          formatted: formatTimeSlot(endHour, endMinute),
        });
      }
      
      return slots;
    }
    
    const startHour = start.getHours();
    const endHour = end.getHours();
    const endMinute = end.getMinutes();
    
    const maxHour = endMinute > 0 ? endHour : endHour - 1;
    
    const slots: CalendarTimeSlot[] = [];
    
    for (let hour = startHour; hour <= maxHour; hour++) {
      slots.push({
        hour,
        minute: 0,
        formatted: formatTimeSlot(hour, 0),
      });
    }
    
    if (endMinute > 0 && maxHour < endHour) {
      slots.push({
        hour: endHour,
        minute: 0,
        formatted: formatTimeSlot(endHour, 0),
      });
    }
    
    return slots;
  } catch {
    return [];
  }
};

const transformScheduleToEvent = (schedule: ScheduleFromBackend): CalendarEvent => {
  const startDate = new Date(schedule.start_time);
  const dateString = startDate.toISOString().split("T")[0];
  
  const timeSlots = generateTimeSlots(
    schedule.start_time,
    schedule.end_time,
    schedule.tag
  );
  
  return {
    id: schedule.id,
    title: schedule.title,
    date: dateString,
    formattedDate: formatCalendarDate(dateString),
    timeSlots,
    description: schedule.tag,
    createdAt: schedule.created_at,
    updatedAt: schedule.updated_at,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
    tag: schedule.tag,
  };
};

const filterEventsByPeriod = (
  events: CalendarEvent[],
  period: CalendarPeriod
): CalendarEvent[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayTime = today.getTime();
  
  return events.filter((event) => {
    const eventDate = new Date(event.date + "T00:00:00");
    const eventTime = eventDate.getTime();
    
    switch (period) {
      case "today":
        return eventTime === todayTime;
      
      case "next_week": {
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + 7);
        const nextWeekStartTime = nextWeekStart.getTime();
        
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
        const nextWeekEndTime = nextWeekEnd.getTime();
        
        return eventTime >= nextWeekStartTime && eventTime < nextWeekEndTime;
      }
      
      case "this_month":
        return (
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      
      default:
        return true;
    }
  });
};

export function useCalendar(
  autoFetch: boolean = true,
  defaultPeriod: CalendarPeriod = "today"
): UseCalendarResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriodState] =
    useState<CalendarPeriod>(defaultPeriod);

  const fetchCalendar = useCallback(
    async (params?: CalendarFilterParams) => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = "/api/schedules/";

        const response = await apiClient.get(endpoint);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Gagal mengambil data schedule"
          );
        }

        const data: ScheduleApiResponse = await response.json();

        if (!data.success) {
          if (data.data === null || (Array.isArray(data.data) && data.data.length === 0)) {
            setEvents([]);
            setLoading(false);
            return;
          }
        }

        let schedules: ScheduleFromBackend[] = [];
        
        if (data.data === null) {
          schedules = [];
        } else if (Array.isArray(data.data)) {
          schedules = data.data;
        } else {
          schedules = [data.data];
        }

        const transformedEvents: CalendarEvent[] = schedules.map(
          transformScheduleToEvent
        );

        const period = params?.period || selectedPeriod;
        const filteredEvents = filterEventsByPeriod(
          transformedEvents,
          period
        );

        setEvents(filteredEvents);
      } catch (err) {
        console.error("Error fetching calendar:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data schedule";

        setError(errorMessage);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedPeriod]
  );

  const setSelectedPeriod = useCallback(
    (period: CalendarPeriod) => {
      setSelectedPeriodState(period);
      fetchCalendar({ period });
    },
    [fetchCalendar]
  );

  const reset = useCallback(() => {
    setEvents([]);
    setError(null);
    setLoading(false);
    setSelectedPeriodState(defaultPeriod);
  }, [defaultPeriod]);

  useEffect(() => {
    if (autoFetch) {
      fetchCalendar({ period: selectedPeriod });
    }
  }, [autoFetch]);

  return {
    events,
    loading,
    error,
    selectedPeriod,
    fetchCalendar,
    setSelectedPeriod,
    reset,
  };
}

