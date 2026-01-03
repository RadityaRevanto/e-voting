import React from "react";
import { UserRound } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useVisiMisiPaslon } from "@/hooks/use-visi-misi-paslon";

export const VisionMissionSection = () => {
  const {
    visi,
    misi,
    namaKetua,
    namaWakilKetua,
    loading,
    error,
  } = useVisiMisiPaslon();

  const getInitials = (name: string | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const parseMissions = (misiString: string | null): string[] => {
    if (!misiString || typeof misiString !== 'string') return [];
    return misiString
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  };

  const missions = parseMissions(misi);

  if (loading) {
    return (
      <section className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-[#53599b] text-base md:text-lg">Memuat data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500 text-base md:text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-5">
        <div className="flex-shrink-0">
          <div className="relative w-[100px] h-[100px] md:w-[117px] md:h-[110px]">
            <div className="absolute inset-0 bg-[#53599b] rounded-full" />
            
            <div className="absolute top-2 left-2 w-[84px] h-[84px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[#53599b] to-[#3a3f6b] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl md:text-3xl">
                {getInitials(namaKetua)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[#5760c0] text-lg md:text-xl xl:text-2xl font-semibold mb-3">
            VILLAGE HEAD ELECTION
          </p>

          <div className="flex flex-col gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] flex items-center justify-center">
                <UserRound className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#9296d1]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#53599b] text-sm md:text-base font-semibold">Ketua Paslon:</span>
                <p className="text-[#9296d1] text-base md:text-lg xl:text-xl font-medium">
                  {namaKetua || "Belum diisi"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] flex items-center justify-center">
                <UserRound className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#9296d1]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#53599b] text-sm md:text-base font-semibold">Wakil Ketua Paslon:</span>
                <p className="text-[#9296d1] text-base md:text-lg xl:text-xl font-medium">
                  {namaWakilKetua || "Belum diisi"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <h3 className="text-[#53599b] text-base md:text-2xl font-bold mb-2">
            Vision
          </h3>
          <p className="text-[#53599b] text-sm md:text-base font-semibold">
            {visi || "Belum diisi"}
          </p>
        </div>

        <div>
          <h3 className="text-[#53599b] text-base md:text-2xl font-bold mb-2">
            Mission
          </h3>
          {missions.length > 0 ? (
            <div className="text-[#53599b] text-sm md:text-base font-semibold space-y-2">
              {missions.map((mission, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="font-bold flex-shrink-0">{index + 1}.</span>
                  <p className="leading-relaxed">{mission}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#53599b] text-sm md:text-base font-semibold">
              Belum diisi
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-4 md:mt-5">
        <Link
          href="/paslon/dashboard/change"
          className="bg-[#dbdefc] hover:bg-[#c9cdfc] transition-colors rounded-full px-8 md:px-[35px] py-2 md:py-[3px] min-w-[120px] md:min-w-[135px] flex items-center gap-2"
          aria-label="Change candidate information"
        >
          <span className="text-[#3544e7] text-base md:text-lg font-bold">
            Change
          </span>
        </Link>
      </div>
    </section>
  );
};