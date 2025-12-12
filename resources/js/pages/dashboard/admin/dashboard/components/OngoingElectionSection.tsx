import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";

export const OngoingElectionSection: React.FC = () => {
  const handleVoteClick = (): void => {
    router.visit("/admin/dashboard/view");
  };

  return (
    <Card
      className="border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px] relative overflow-hidden pb-0"
      aria-labelledby="ongoing-election-title"
    >
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-[#53599b] text-lg md:text-xl font-bold">
          Ongoing Selection
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="flex-1 pb-5 mt-2 md:mt-4">
            <h2
              id="ongoing-election-title"
              className="text-[#53599b] leading-[1.5] text-3xl md:text-4xl xl:text-5xl font-extrabold mb-3 md:mb-4 xl:mb-6"
            >
              Village Head Election
            </h2>

            <Button
              onClick={handleVoteClick}
              className="mt-8 md:mt-12 xl:mt-20 w-full md:w-[150px] xl:w-[181px] h-[36px] md:h-[38px] xl:h-[41px] rounded-[25px] md:rounded-[30px] border-[2px] md:border-[3px] border-[#53599b] bg-white text-[#53599b] hover:bg-[#53599b] hover:text-white text-base md:text-lg xl:text-xl font-medium"
              aria-label="Vote now for Village Head Election"
              variant="outline"
            >
              View Now
            </Button>
          </div>

          <div className="hidden -mt-15 w-100 md:pb-0 md:flex self-end">
            <img
              className="w-[300px] md:w-[400px] xl:w-[500px] h-[210px] md:h-[280px] xl:h-[350px] object-contain"
              alt="Village Head Election illustration showing people voting"
              src="/assets/images/admin/dashboard/selection.png"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

