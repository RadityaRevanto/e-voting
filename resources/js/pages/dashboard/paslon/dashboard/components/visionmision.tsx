import React from "react";
import { Briefcase, Pencil, UserRound } from "lucide-react";

export const VisionMissionSection = () => {
  const candidateData = {
    name: "Aditya Eka Narayan",
    title: "VILLAGE HEAD ELECTION",
    age: "22 years old",
    department: "System Development",
    vision: "To build a progressive, transparent, and prosperous village for all residents.",
    missions: [
      "Improve public services through faster, more transparent, and easily accessible systems.",
      "Strengthen the village economy by supporting local businesses, providing skill training, and maximizing local resources.",
      "Create a safe and comfortable environment through better infrastructure, cleanliness programs, and community empowerment.",
    ],
  };

  return (
    <section className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-5">
        <div className="flex-shrink-0">
          <div className="relative w-[100px] h-[100px] md:w-[117px] md:h-[110px]">
            <div className="absolute inset-0 bg-[#53599b] rounded-full" />
            
            <div className="absolute top-2 left-2 w-[84px] h-[84px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[#53599b] to-[#3a3f6b] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl md:text-4xl">AE</span>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-[#53599b] text-2xl md:text-3xl font-bold mb-1">
            {candidateData.name}
          </h2>
          <p className="text-[#5760c0] text-base md:text-lg font-semibold mb-3">
            {candidateData.title}
          </p>

          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] flex items-center justify-center">
                <UserRound className="w-[15px] h-[15px] text-[#9296d1]" />
              </div>
              <p className="text-[#9296d1] text-sm">
                {candidateData.age}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] flex items-center justify-center">
                <Briefcase className="w-[15px] h-[15px] text-[#9296d1]" />
              </div>
              <p className="text-[#9296d1] text-sm">
                {candidateData.department}
              </p>
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
            {candidateData.vision}
          </p>
        </div>

        <div>
          <h3 className="text-[#53599b] text-base md:text-2xl font-bold mb-2">
            Mission
          </h3>
          <div className="text-[#53599b] text-sm md:text-base font-semibold space-y-2">
            {candidateData.missions.map((mission, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="font-bold flex-shrink-0">{index + 1}.</span>
                <p className="leading-relaxed">{mission}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 md:mt-5">
        <button
          className="bg-[#dbdefc] hover:bg-[#c9cdfc] transition-colors rounded-full px-8 md:px-[35px] py-2 md:py-[3px] min-w-[120px] md:min-w-[135px] flex items-center gap-2"
          aria-label="Change candidate information"
        >
          <span className="text-[#3544e7] text-base md:text-lg font-bold">
            Change
          </span>
        </button>
      </div>
    </section>
  );
};