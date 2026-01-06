import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveResults, VotingStatus } from "@/hooks/use-live-results";

export const LiveResultsSection: React.FC = () => {
  // TODO: Ambil voting status dari context/store jika tersedia
  // Untuk sekarang, default ke "active"
  const [votingStatus] = React.useState<VotingStatus>("active");

  const { results, loading, error, totalVotes } = useLiveResults(
    5000,
    votingStatus
  );

  // Hitung maxPercentage dengan aman (tidak divide by zero)
  const maxPercentage = React.useMemo(() => {
    if (results.length === 0) {
      return 100;
    }
    const max = Math.max(...results.map((c) => c.percentage));
    return max > 0 ? max : 100;
  }, [results]);

  return (
    <Card className="border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
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
        {loading && results.length === 0 ? (
          <div className="w-full bg-white rounded-[18px] shadow-md md:rounded-[22px] px-4 pt-4 pb-5 md:px-6 md:pt-4 md:pb-6 flex items-center justify-center min-h-[200px] border border-[#eef0ff]">
            <p className="text-[#53599b] text-sm md:text-base">
              Memuat data...
            </p>
          </div>
        ) : error ? (
          <div className="w-full bg-white rounded-[18px] shadow-md md:rounded-[22px] px-4 pt-4 pb-5 md:px-6 md:pt-4 md:pb-6 flex flex-col items-center justify-center min-h-[200px] border border-[#eef0ff] gap-2">
            <p className="text-red-500 text-sm md:text-base font-semibold">
              Terjadi Kesalahan
            </p>
            <p className="text-red-500 text-xs md:text-sm text-center">
              {error}
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="w-full bg-white rounded-[18px] shadow-md md:rounded-[22px] px-4 pt-4 pb-5 md:px-6 md:pt-4 md:pb-6 flex flex-col items-center justify-center min-h-[200px] border border-[#eef0ff] gap-2">
            <p className="text-[#53599b] text-sm md:text-base font-semibold">
              Belum Ada Data Hasil Voting
            </p>
            <p className="text-[#53599b] text-xs md:text-sm text-center">
              Hasil voting akan ditampilkan di sini setelah ada suara masuk
            </p>
          </div>
        ) : (
          <div className="w-full bg-white rounded-[18px] shadow-md md:rounded-[22px] px-4 pt-4 pb-5 md:px-6 md:pt-4 md:pb-6 flex flex-col justify-center gap-4 md:gap-5 border border-[#eef0ff]">
            {results.map((candidate) => {
              // Hitung width dengan aman (tidak divide by zero)
              const width = maxPercentage > 0
                ? (candidate.percentage / maxPercentage) * 100
                : 0;
              
              // Pastikan width minimal 0% dan maksimal 100%
              const safeWidth = Math.max(0, Math.min(100, width));

              return (
                <div
                  key={candidate.id}
                  className="flex items-center gap-4 md:gap-6"
                >
                  <span className="w-[110px] md:w-[140px] text-[12px] md:text-sm font-semibold text-[#53599b] truncate">
                    {candidate.name}
                  </span>

                  <div className="flex-1">
                    <div className="w-full bg-[#e3e7ff] rounded-full h-7 md:h-8 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-3 text-[10px] md:text-xs font-semibold text-white bg-gradient-to-r from-[#6c7bff] to-[#182c8f] shadow-[0_4px_10px_rgba(24,44,143,0.35)] transition-all duration-500"
                        style={{ width: `${safeWidth}%` }}
                        aria-valuenow={candidate.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      >
                        {safeWidth > 5 && (
                          <span>{candidate.percentage.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {totalVotes > 0 && (
              <div className="mt-2 pt-2 border-t border-[#eef0ff]">
                <p className="text-[#53599b] text-xs md:text-sm text-center">
                  Total Suara: <span className="font-semibold">{totalVotes}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

