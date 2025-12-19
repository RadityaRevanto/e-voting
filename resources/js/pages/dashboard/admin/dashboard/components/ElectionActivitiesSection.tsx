import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ActivityStatus = "ongoing" | "pending" | "concluded";

interface Activity {
  id: string;
  title: string;
  status: ActivityStatus;
  date: string;
}

interface LegendItem {
  id: string;
  label: string;
  color: string;
  status: ActivityStatus;
}

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
  { id: "2", title: "Announcement", status: "pending", date: "12/12/2025" },
];

const getStatusColor = (status: ActivityStatus): string => {
  const statusColors: Record<ActivityStatus, string> = {
    ongoing: "#ebedff",
    pending: "#53599b",
    concluded: "#3544e7",
  };
  return statusColors[status];
};

export const ElectionActivitiesSection: React.FC = () => {
  return (
    <Card
      className="border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px]"
      aria-labelledby="election-activities-title"
    >
      <CardHeader className="pb-4 md:pb-5 xl:pb-6">
        <CardTitle
          id="election-activities-title"
          className="text-[#53599b] text-lg md:text-xl font-bold"
        >
          Election Activities
        </CardTitle>
      </CardHeader>

      <CardContent>
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
              <span
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
              <div className="flex-1">
                <h3 className="text-[#53599b] text-xl md:text-2xl font-semibold">
                  {activity.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 px-2 py-1 border-none bg-transparent"
                >
                  <span
                    className="w-[12px] md:w-[13px] xl:w-[15px] h-[12px] md:h-[13px] xl:h-[15px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                    role="img"
                    aria-label={`Status: ${activity.status}`}
                  />
                  <span className="capitalize text-xs md:text-sm">
                    {activity.status}
                  </span>
                </Badge>

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
      </CardContent>
    </Card>
  );
};
