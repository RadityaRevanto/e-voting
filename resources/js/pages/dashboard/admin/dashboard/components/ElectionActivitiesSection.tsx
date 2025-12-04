import React from "react";

interface Activity {
  id: string;
  title: string;
  status: "ongoing" | "pending" | "concluded";
  date: string;
}

interface LegendItem {
  id: string;
  label: string;
  color: string;
  status: "ongoing" | "pending" | "concluded";
}

export const ElectionActivitiesSection = (): React.ReactElement => {
  const legendItems: LegendItem[] = [
    { id: "1", label: "Ongoing", color: "#ebedff", status: "ongoing" },
    { id: "2", label: "Pending", color: "#53599b", status: "pending" },
    { id: "3", label: "Concluded", color: "#3544e7", status: "concluded" },
  ];

  const activities: Activity[] = [
    {
      id: "1",
      title: "Village Head Election",
      status: "ongoing",
      date: "12/12/2025",
    },
    { id: "2", title: "Anaouncemnet", status: "pending", date: "12/12/2025" },
  ];

  const getStatusColor = (
    status: "ongoing" | "pending" | "concluded",
  ): string => {
    const statusColors = {
      ongoing: "#ebedff",
      pending: "#53599b",
      concluded: "#3544e7",
    };
    return statusColors[status];
  };

  return (
    <section
      className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6"
      aria-labelledby="election-activities-title"
    >
      <h2
        id="election-activities-title"
        className="text-[#53599b] text-lg md:text-xl font-bold mb-4 md:mb-5 xl:mb-6"
      >
        Election Activities
      </h2>

      <div
        className="flex flex-wrap gap-4 md:gap-6 xl:gap-7 mb-5 md:mb-6 xl:mb-8"
        role="list"
        aria-label="Activity status legend"
      >
        {legendItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 md:gap-3"
            role="listitem"
          >
            <div
              className="w-[12px] md:w-[13px] xl:w-[15px] h-[12px] md:h-[13px] xl:h-[15px] rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-black text-base md:text-lg xl:text-xl font-normal">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <ul
        className="space-y-6 md:space-y-8 xl:space-y-12"
        aria-label="Election activities list"
      >
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0"
          >
            <h3 className="text-[#53599b] text-xl md:text-2xl font-semibold flex-1">
              {activity.title}
            </h3>

            <div className="flex items-center gap-4 md:gap-6">
              <div
                className="w-[12px] md:w-[13px] xl:w-[15px] h-[12px] md:h-[13px] xl:h-[15px] rounded-full flex-shrink-0"
                style={{ backgroundColor: getStatusColor(activity.status) }}
                role="img"
                aria-label={`Status: ${activity.status}`}
              />

              <time
                dateTime={activity.date.split("/").reverse().join("-")}
                className="text-black text-sm md:text-base font-normal whitespace-nowrap"
              >
                {activity.date}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
