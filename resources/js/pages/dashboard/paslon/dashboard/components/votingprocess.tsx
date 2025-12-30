import * as React from "react";
import { Button } from "@/components/ui/button";
import { useVotingProcess } from "@/hooks/use-voting-process";

export const VotingProcessSection = (): React.ReactElement => {
  const { 
    statistics, 
    loading, 
    error, 
    fetchVotingProcess,
    totalRegistered,
    totalVotes,
    totalGolput
  } = useVotingProcess();

  const handleRetry = React.useCallback(async () => {
    await fetchVotingProcess();
  }, [fetchVotingProcess]);

  const handleRefresh = React.useCallback(async () => {
    await fetchVotingProcess();
  }, [fetchVotingProcess]);

  return (
    <section
      className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6"
      aria-labelledby="voting-process-title"
    >
      <div className="flex items-center justify-between mb-5 md:mb-6 xl:mb-8">
        <h2
          id="voting-process-title"
          className="text-[#53599b] text-lg md:text-xl font-bold"
        >
          Voting Process
        </h2>
        {!loading && !error && statistics.length > 0 && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            className="text-[#53599b] hover:text-[#53599b] hover:bg-[#53599b]/10"
            aria-label="Refresh data"
            title="Refresh data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53599b]"></div>
          <p className="text-[#53599b] text-sm">Memuat data...</p>
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
            <p className="text-red-500 text-sm text-center max-w-xs">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="text-[#53599b] border-[#53599b] hover:bg-[#53599b] hover:text-white"
          >
            Coba Lagi
          </Button>
        </div>
      ) : statistics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-[#53599b] text-sm text-center">
            Tidak ada data voting process
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-[#53599b] border-[#53599b] hover:bg-[#53599b] hover:text-white"
          >
            Muat Ulang
          </Button>
        </div>
      ) : (
        <div className="space-y-5 md:space-y-6 xl:space-y-8">
          {statistics.map((stat) => (
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
      )}
    </section>
  );
};
