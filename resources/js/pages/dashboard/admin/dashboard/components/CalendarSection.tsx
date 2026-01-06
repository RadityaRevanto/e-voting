import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar, type CalendarView, type Schedule } from "@/hooks/use-calendar";

const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

const combineTimes = (schedules: Schedule[]): { startTime: string; endTime: string; date: string } | null => {
  if (schedules.length === 0) return null;
  
  const startTimes: string[] = [];
  const endTimes: string[] = [];
  
  schedules.forEach((schedule) => {
    const startTime = formatTime(schedule.start_time);
    const endTime = formatTime(schedule.end_time);
    if (startTime && !startTimes.includes(startTime)) {
      startTimes.push(startTime);
    }
    if (endTime && !endTimes.includes(endTime)) {
      endTimes.push(endTime);
    }
  });
  
  const sortTimes = (times: string[]) => {
    return times.sort((a, b) => {
      const [aHours, aMinutes] = a.split(":").map(Number);
      const [bHours, bMinutes] = b.split(":").map(Number);
      if (aHours !== bHours) return aHours - bHours;
      return aMinutes - bMinutes;
    });
  };
  
  const sortedStartTimes = sortTimes([...startTimes]);
  const sortedEndTimes = sortTimes([...endTimes]);
  
  // Ambil tanggal dari schedule pertama
  const date = formatDate(schedules[0].start_time);
  
  return {
    startTime: sortedStartTimes[0] || "",
    endTime: sortedEndTimes[sortedEndTimes.length - 1] || "",
    date: date,
  };
};

export const CalendarSection: React.FC = () => {
  const {
    schedules,
    loading,
    error,
    view,
    setView,
    refreshSchedules,
  } = useCalendar(true, "today");

  const registrationSchedules = schedules.filter((schedule) => schedule.tag === "registration");
  const votingSchedules = schedules.filter((schedule) => schedule.tag === "voting");
  const announcementSchedules = schedules.filter((schedule) => schedule.tag === "announcement");
  const registrationTimes = combineTimes(registrationSchedules);
  const votingTimes = combineTimes(votingSchedules);
  const announcementTimes = combineTimes(announcementSchedules);
  const hasRegistration = registrationSchedules.length > 0;
  const hasVoting = votingSchedules.length > 0;
  const hasAnnouncement = announcementSchedules.length > 0;

  const handleViewClick = (newView: CalendarView) => {
    setView(newView);
  };

  const handleRetry = () => {
    refreshSchedules();
  };

  return (
    <Card
      className="rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
      aria-label="Calendar"
    >
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="text-[#53599b] text-lg md:text-xl xl:text-xl font-bold">
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center -mt-5 gap-3 md:gap-4 mb-3 md:mb-4">
          <button
            onClick={() => handleViewClick("today")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk hari ini"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                view === "today"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              Today
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {view === "today" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
          <button
            onClick={() => handleViewClick("nextWeek")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk minggu depan"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                view === "nextWeek"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              Next Week
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {view === "nextWeek" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
          <button
            onClick={() => handleViewClick("thisMonth")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk bulan ini"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                view === "thisMonth"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              This Month
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {view === "thisMonth" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53599b]"></div>
            <p className="text-[#53599b] text-sm md:text-base">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-red-500 text-sm md:text-base text-center max-w-xs">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm md:text-base text-[#53599b] border border-[#53599b] rounded-lg hover:bg-[#53599b] hover:text-white transition-colors font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="mt-4 md:mt-5 xl:mt-6 space-y-3 md:space-y-4">
            {hasRegistration && registrationTimes && (
              <div>
                <div className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-3 md:p-4 text-center mb-2">
                  <p className="text-[#53599b] text-sm md:text-base font-bold">
                    Registrasi
                  </p>
                </div>
                <div className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-2" />
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {registrationTimes.startTime}
                  </p>
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {registrationTimes.endTime}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <p className="text-[#8e8fa0] text-xs md:text-sm">
                    {registrationTimes.date}
                  </p>
                </div>
              </div>
            )}

            {hasVoting && votingTimes && (
              <div>
                <div className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-3 md:p-4 text-center mb-2">
                  <p className="text-[#53599b] text-sm md:text-base font-bold">
                    Voting
                  </p>
                </div>
                <div className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-2" />
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {votingTimes.startTime}
                  </p>
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {votingTimes.endTime}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <p className="text-[#8e8fa0] text-xs md:text-sm">
                    {votingTimes.date}
                  </p>
                </div>
              </div>
            )}

            {hasAnnouncement && announcementTimes && (
              <div>
                <div className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-3 md:p-4 text-center mb-2">
                  <p className="text-[#53599b] text-sm md:text-base font-bold">
                    Pengumuman
                  </p>
                </div>
                <div className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-2" />
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {announcementTimes.startTime}
                  </p>
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {announcementTimes.endTime}
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <p className="text-[#8e8fa0] text-xs md:text-sm">
                    {announcementTimes.date}
                  </p>
                </div>
              </div>
            )}

            {!hasRegistration && !hasVoting && !hasAnnouncement && (
              <div className="text-center text-[#8e8fa0] text-sm">
                Tidak ada event untuk periode ini
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};