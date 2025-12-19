import React from "react";

export const CalendarSection = () => {
  const timeSlots = [
    { time: "7.00", left: "29px" },
    { time: "8.00", left: "144px" },
    { time: "9.00", left: "264px" },
    { time: "10.00", left: "419px" },
    { time: "11.00", left: "592px" },
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
        <div className="relative">
          <button className="text-[#53589a] text-sm md:text-base font-bold">
            Today
          </button>
          <div
            className="absolute top-[28px] left-0 w-full h-0.5 bg-[#53599b] rounded-full"
            aria-hidden="true"
          />
        </div>
        <button className="text-[#8e8fa0] text-sm md:text-base font-bold">
          Next Week
        </button>
        <button className="text-[#8e8fa0] text-sm md:text-base font-bold">
          This Month
        </button>
      </nav>

      <div className="mb-4 md:mb-5">
        <div
          className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-2 md:p-3 mb-3 md:mb-4"
          role="article"
          aria-label="Calendar event"
        >
          <p className="text-[#53599b] text-sm md:text-[15px] font-bold text-center">
            Village head election
          </p>
        </div>

        <div
          className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-3 md:mb-4"
          role="separator"
          aria-hidden="true"
        />

        <div className="relative mb-3 md:mb-4">
          <div
            className="flex justify-between text-[#8e8fa0cc] text-[9px] md:text-[10px] font-bold"
            role="list"
            aria-label="Time slots"
          >
            {timeSlots.map((slot, index) => (
              <span key={index} role="listitem">
                {slot.time}
              </span>
            ))}
          </div>
        </div>

        <time
          className="block text-center text-[#53599b] text-[10px] md:text-xs font-bold"
          dateTime="2024-12-22"
        >
          December, 22
        </time>
      </div>
    </section>
  );
};