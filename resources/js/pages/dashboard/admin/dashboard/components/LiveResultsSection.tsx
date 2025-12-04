import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CandidateResult = {
  name: string;
  percentage: number;
};

const mockResults: CandidateResult[] = [
  { name: "Candidate #1", percentage: 33 },
  { name: "Candidate #2", percentage: 38 },
  { name: "Candidate #3", percentage: 29 },
];

export const LiveResultsSection: React.FC = () => {
  const maxPercentage = React.useMemo(
    () => Math.max(...mockResults.map((c) => c.percentage), 100),
    [],
  );

  return (
    <Card className="border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px]">
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
          <CardTitle className="text-[#53599b] text-xl md:text-2xl font-extrabold tracking-wide">
            Live Result
          </CardTitle>
          <p className="text-[#53599b] text-xl md:text-2xl font-extrabold tracking-wide text-center">
            Village Head Election
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full bg-white rounded-[18px] shadow-md md:rounded-[22px] px-4 pt-4 pb-5 md:px-6 md:pt-4 md:pb-6 flex flex-col justify-center gap-4 md:gap-5 border border-[#eef0ff]">
          {mockResults.map((candidate) => {
            const width = (candidate.percentage / maxPercentage) * 100;

            return (
              <div
                key={candidate.name}
                className="flex items-center gap-4 md:gap-6"
              >
                <span className="w-[110px] md:w-[140px] text-[12px] md:text-sm font-semibold text-[#53599b]">
                  {candidate.name}
                </span>

                <div className="flex-1">
                  <div className="w-full bg-[#e3e7ff] rounded-full h-7 md:h-8 overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-3 text-[10px] md:text-xs font-semibold text-white bg-gradient-to-r from-[#6c7bff] to-[#182c8f] shadow-[0_4px_10px_rgba(24,44,143,0.35)] transition-all duration-500"
                      style={{ width: `${width}%` }}
                      aria-valuenow={candidate.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      role="progressbar"
                    >
                      <span>{candidate.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

