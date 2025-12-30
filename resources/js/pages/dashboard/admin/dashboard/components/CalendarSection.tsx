import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendar, CalendarPeriod } from "@/hooks/use-calendar";

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

const combineTimes = (events: Array<{ startTime: string; endTime: string }>): { startTime: string; endTime: string } | null => {
  if (events.length === 0) return null;
  
  const startTimes: string[] = [];
  const endTimes: string[] = [];
  
  events.forEach((event) => {
    const startTime = formatTime(event.startTime);
    const endTime = formatTime(event.endTime);
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
  
  return {
    startTime: sortedStartTimes[0] || "",
    endTime: sortedEndTimes[sortedEndTimes.length - 1] || "",
  };
};

export const CalendarSection: React.FC = () => {
  const {
    events,
    loading,
    error,
    selectedPeriod,
    setSelectedPeriod,
  } = useCalendar(true, "today");

  const registrationEvents = events.filter((event) => event.tag === "registration");
  const votingEvents = events.filter((event) => event.tag === "voting");
  const registrationTimes = combineTimes(registrationEvents);
  const votingTimes = combineTimes(votingEvents);
  const hasRegistration = registrationEvents.length > 0;
  const hasVoting = votingEvents.length > 0;

  const handlePeriodClick = (period: CalendarPeriod) => {
    setSelectedPeriod(period);
  };

  return (
    <Card
      className="rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040]"
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
            onClick={() => handlePeriodClick("today")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk hari ini"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                selectedPeriod === "today"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              Today
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {selectedPeriod === "today" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
          <button
            onClick={() => handlePeriodClick("next_week")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk minggu depan"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                selectedPeriod === "next_week"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              Next Week
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {selectedPeriod === "next_week" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
          <button
            onClick={() => handlePeriodClick("this_month")}
            className="flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity min-h-[28px] md:min-h-[32px]"
            aria-label="Filter calendar untuk bulan ini"
          >
            <span
              className={`text-xs md:text-sm font-bold ${
                selectedPeriod === "this_month"
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              This Month
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 rounded-full mt-1">
              {selectedPeriod === "this_month" && (
                <div className="w-full h-full bg-[#53599b]" />
              )}
            </div>
          </button>
        </div>

        {loading && (
          <div className="mt-4 md:mt-5 xl:mt-6 text-center text-[#8e8fa0] text-sm">
            Memuat data...
          </div>
        )}

        {error && (
          <div className="mt-4 md:mt-5 xl:mt-6 text-center text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-4 md:mt-5 xl:mt-6 space-y-3 md:space-y-4">
            {hasRegistration && registrationTimes && (
              <div>
                <div className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-3 md:p-4 text-center mb-2">
                  <p className="text-[#53599b] text-sm md:text-base font-bold">
                    Registrasi
                  </p>
                </div>
                <div className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-2" />
                <div className="flex justify-between items-center">
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {registrationTimes.startTime}
                  </p>
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {registrationTimes.endTime}
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
                <div className="flex justify-between items-center">
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {votingTimes.startTime}
                  </p>
                  <p className="text-[#53599b] text-xs md:text-sm">
                    {votingTimes.endTime}
                  </p>
                </div>
              </div>
            )}

            {!hasRegistration && !hasVoting && (
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