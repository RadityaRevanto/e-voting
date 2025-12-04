import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CalendarSection: React.FC = () => {
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
          <div className="flex flex-col">
            <span className="text-[#53589a] text-xs md:text-sm font-bold">
              Today
            </span>
            <div className="w-[50px] md:w-[60px] h-0.5 bg-[#53599b] rounded-full mt-1" />
          </div>
          <span className="text-[#8e8fa0] text-[10px] md:text-xs font-bold">
            Next Week
          </span>
          <span className="text-[#8e8fa0] text-[10px] md:text-xs font-bold">
            This Month
          </span>
        </div>

        <div className="mt-4 md:mt-5 xl:mt-6">
          <div className="bg-[#dbdefc] rounded-[8px] md:rounded-[10px] p-2 md:p-3 mb-2">
            <p className="text-[#53599b] text-sm md:text-[15px] font-bold">
              Village head election
            </p>
          </div>
          <div className="h-0.5 bg-[#8e8fa0cc] rounded-full mb-3 md:mb-4" />

          <div className="relative mb-3 md:mb-4">
            <div className="flex justify-between text-[#8e8fa0cc] text-[9px] md:text-[10px] font-bold mb-2">
              <span>7.00</span>
              <span>8.00</span>
              <span>9.00</span>
              <span>10.00</span>
              <span>11.00</span>
            </div>
          </div>
          <time
            className="block text-center text-[#53599b] text-[10px] md:text-xs font-bold"
            dateTime="2024-12-22"
          >
            December, 22
          </time>
        </div>
      </CardContent>
    </Card>
  );
};

