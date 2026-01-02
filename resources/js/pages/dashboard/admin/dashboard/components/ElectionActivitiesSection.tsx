import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useElectionActivities, ActivityStatus } from "@/hooks/use-election-activities";

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

const getStatusColor = (status: ActivityStatus): string => {
  const statusColors: Record<ActivityStatus, string> = {
    ongoing: "#ebedff",
    pending: "#53599b",
    concluded: "#3544e7",
  };
  return statusColors[status];
};

export const ElectionActivitiesSection: React.FC = () => {
  const { activities, loading, error, refetch } = useElectionActivities();

  const handleRetry = () => {
    refetch();
  };

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

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53599b]"></div>
            <p className="text-[#53599b] text-sm md:text-base">Memuat activities...</p>
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
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-[#53599b] text-base md:text-lg">
            Tidak ada activities saat ini
          </div>
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};
