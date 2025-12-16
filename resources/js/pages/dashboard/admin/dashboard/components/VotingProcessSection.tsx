import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VotingStatistic {
  id: number;
  value: number;
  label: string;
  circleColor: string;
}

const votingStatistics: VotingStatistic[] = [
  {
    id: 1,
    value: 365,
    label: "Total Numbers Of Registered Votes",
    circleColor: "#53599b",
  },
  {
    id: 2,
    value: 350,
    label: "Total Numbers Of Votes",
    circleColor: "#53599b",
  },
  {
    id: 3,
    value: 15,
    label: "Total Numbers of Golput",
    circleColor: "#ebedff",
  },
];

export const VotingProcessSection: React.FC = () => {
  return (
    <Card
      className="border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px]"
      aria-labelledby="voting-process-title"
    >
      <CardHeader className="pb-4 md:pb-5 xl:pb-7">
        <CardTitle
          id="voting-process-title"
          className="text-[#53599b] text-lg md:text-xl font-bold"
        >
          Voting Process
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-5 md:space-y-6 xl:space-y-8">
          {votingStatistics.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center relative">
              <div
                className="relative w-[90px] md:w-[100px] xl:w-[120px] h-[90px] md:h-[100px] xl:h-[120px] rounded-full flex items-center justify-center mb-3 md:mb-4 border-[15px] md:border-[20px] xl:border-[25px]"
                style={{ borderColor: stat.circleColor }}
                role="img"
                aria-label={`${stat.label}: ${stat.value}`}
              >
                <span className="text-[#53589a] text-sm md:text-base font-bold">
                  {stat.value}
                </span>
              </div>

              <p className="text-[#53599b] text-xs md:text-sm font-medium text-center max-w-[120px] md:max-w-[130px] xl:max-w-[140px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
