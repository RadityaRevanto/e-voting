import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVotingProcess } from "@/hooks/use-voting-process";

// Komponen untuk animasi counter
function AnimatedCounter({ 
  value, 
  duration = 1500 
}: { 
  value: number; 
  duration?: number;
}) {
  const [count, setCount] = React.useState(0);
  const prevValueRef = React.useRef(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const startValue = prevValueRef.current;
    const endValue = value;
    const difference = endValue - startValue;

    if (difference === 0) {
      setCount(value);
      return;
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + difference * easeOut);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count.toLocaleString('id-ID')}</span>;
}

// Komponen untuk statistik dengan animasi
function AnimatedStatistic({ 
  stat, 
  index 
}: { 
  stat: { id: number; value: number; label: string; circleColor: string };
  index: number;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const statRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 150); // Stagger delay
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (statRef.current) {
      observer.observe(statRef.current);
    }

    return () => {
      if (statRef.current) {
        observer.unobserve(statRef.current);
      }
    };
  }, [index]);

  return (
    <div 
      ref={statRef}
      className={`flex flex-col items-center relative transition-all duration-700 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      <div
        className={`relative w-[90px] md:w-[100px] xl:w-[120px] h-[90px] md:h-[100px] xl:h-[120px] rounded-full flex items-center justify-center mb-3 md:mb-4 border-[15px] md:border-[20px] xl:border-[25px] transition-all duration-500 hover:scale-110 hover:shadow-lg ${
          isVisible ? "animate-pulse-subtle" : ""
        }`}
        style={{ borderColor: stat.circleColor }}
        role="img"
        aria-label={`${stat.label}: ${stat.value}`}
      >
        <span className="text-[#53589a] text-sm md:text-base font-bold transition-all duration-300">
          <AnimatedCounter value={stat.value} />
        </span>
      </div>

      <p className="text-[#53599b] text-xs md:text-sm font-medium text-center max-w-[120px] md:max-w-[130px] xl:max-w-[140px] transition-all duration-500">
        {stat.label}
      </p>
    </div>
  );
}

export const VotingProcessSection: React.FC = () => {
  const { 
    statistics, 
    loading, 
    error, 
    fetchVotingProcess
  } = useVotingProcess();

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [cardVisible, setCardVisible] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleRetry = React.useCallback(async () => {
    await fetchVotingProcess();
  }, [fetchVotingProcess]);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await fetchVotingProcess();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [fetchVotingProcess]);

  return (
    <>
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(83, 89, 155, 0);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 8px rgba(83, 89, 155, 0.1);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-rotate {
          animation: rotate 1s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <Card
        ref={cardRef}
        className={`border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] rounded-[20px] md:rounded-[25px] xl:rounded-[30px] transition-all duration-700 ease-out ${
          cardVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4"
        }`}
        aria-labelledby="voting-process-title"
      >
        <CardHeader className="pb-4 md:pb-5 xl:pb-7">
          <div className="flex items-center justify-between">
            <CardTitle
              id="voting-process-title"
              className="text-[#53599b] text-lg md:text-xl font-bold transition-all duration-300"
            >
              Voting Process
            </CardTitle>
            {!loading && !error && statistics.length > 0 && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`text-[#53599b] hover:text-[#53599b] hover:bg-[#53599b]/10 transition-all duration-300 hover:scale-110 active:scale-95 ${
                  isRefreshing ? "animate-rotate" : ""
                }`}
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
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3 animate-fade-in-up">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#53599b]"></div>
              <p className="text-[#53599b] text-sm animate-pulse">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fade-in-up">
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
                  className="text-red-500 animate-shake"
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
                className="text-[#53599b] border-[#53599b] hover:bg-[#53599b] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Coba Lagi
              </Button>
            </div>
          ) : statistics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-fade-in-up">
              <p className="text-[#53599b] text-sm text-center">
                Tidak ada data voting process
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-[#53599b] border-[#53599b] hover:bg-[#53599b] hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Muat Ulang
              </Button>
            </div>
          ) : (
            <div className="space-y-5 md:space-y-6 xl:space-y-8">
              {statistics.map((stat, index) => (
                <AnimatedStatistic key={stat.id} stat={stat} index={index} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
