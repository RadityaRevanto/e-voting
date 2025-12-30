import React from "react";
import { useCalendar, type CalendarPeriod } from "@/hooks/use-calendar";

export const CalendarSection = () => {
  const {
    events,
    loading,
    error,
    selectedPeriod,
    setSelectedPeriod,
  } = useCalendar(true, "today");

  const handlePeriodChange = (period: CalendarPeriod) => {
    setSelectedPeriod(period);
  };

  const periods: { key: CalendarPeriod; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "next_week", label: "Next Week" },
    { key: "this_month", label: "This Month" },
  ];

  return (
    <section
      className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6"
      aria-label="Calendar Section"
    >
      <header className="mb-4 md:mb-5">
        <h2 className="text-[#53599b] text-lg md:text-xl xl:text-2xl font-bold">
          Calendar
        </h2>
      </header>

      <nav
        className="flex gap-4 md:gap-6 mb-4 md:mb-5"
        aria-label="Calendar view tabs"
      >
        {periods.map((period) => (
          <div key={period.key} className="relative">
            <button
              onClick={() => handlePeriodChange(period.key)}
              className={`text-sm md:text-base font-bold transition-colors ${
                selectedPeriod === period.key
                  ? "text-[#53589a]"
                  : "text-[#8e8fa0]"
              }`}
            >
              {period.label}
            </button>
            {selectedPeriod === period.key && (
              <div
                className="absolute top-[28px] left-0 w-full h-0.5 bg-[#53599b] rounded-full"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </nav>

      <div className="mb-4 md:mb-5">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-[#8e8fa0] text-sm">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#8e8fa0] text-sm">Tidak ada event untuk periode ini</p>
          </div>
        ) : (
          (() => {
            // Kelompokkan events berdasarkan tanggal
            const eventsByDate = events.reduce((acc, event) => {
              if (!acc[event.date]) {
                acc[event.date] = [];
              }
              acc[event.date].push(event);
              return acc;
            }, {} as Record<string, typeof events>);

            return Object.entries(eventsByDate).map(([date, dateEvents], dateIndex) => (
              <div key={date} className="mb-4 md:mb-5 last:mb-0">
                {dateEvents.map((event, eventIndex) => (
                  <div key={event.id} className={eventIndex > 0 ? "mt-4 md:mt-5" : ""}>
                    <div
                      className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-2 md:p-3 mb-3 md:mb-4"
                      role="article"
                      aria-label="Calendar event"
                    >
                      <p className="text-[#53599b] text-sm md:text-[15px] font-bold text-center">
                        {event.title}
                      </p>
                    </div>

                    <div
                      className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-3 md:mb-4"
                      role="separator"
                      aria-hidden="true"
                    />

                    {event.timeSlots.length > 0 && (
                      <div className="relative mb-3 md:mb-4">
                        <div
                          className="flex justify-between text-[#8e8fa0cc] text-[9px] md:text-[10px] font-bold"
                          role="list"
                          aria-label="Time slots"
                        >
                          {event.timeSlots.map((slot, index) => (
                            <span key={index} role="listitem">
                              {slot.formatted}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Hanya tampilkan tanggal sekali di akhir grup events dengan tanggal yang sama */}
                <time
                  className="block text-center text-[#53599b] text-[10px] md:text-xs font-bold"
                  dateTime={date}
                >
                  {dateEvents[0].formattedDate}
                </time>
              </div>
            ));
          })()
        )}
      </div>
    </section>
  );
};