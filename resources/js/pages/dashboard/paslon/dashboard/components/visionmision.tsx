import React from "react";

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
          <h2 className="text-[#53599b] text-xl md:text-2xl font-bold mb-1">
            {candidateData.name}
          </h2>
          <p className="text-[#5760c0] text-sm md:text-[15px] font-semibold mb-3">
            {candidateData.title}
          </p>

          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] flex items-center justify-center">
                <svg className="w-[15px] h-[15px] text-[#9296d1]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <p className="text-[#9296d1] text-[11px]">
                {candidateData.age}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] flex items-center justify-center">
                <svg className="w-[15px] h-[15px] text-[#9296d1]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 6h-4c0-2.21-1.79-4-4-4S9 3.79 9 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 0c0-1.1.9-2 2-2s2 .9 2 2h-4zm10 16H5V8h16v14z"/>
                  <path d="M12 19l6-4.5V10h-2v3.5l-4 3-4-3V10H6v4.5z"/>
                </svg>
              </div>
              <p className="text-[#9296d1] text-[11px]">
                {candidateData.department}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <h3 className="text-[#53599b] text-sm md:text-[15px] font-bold mb-2">
            Vision
          </h3>
          <p className="text-[#53599b] text-[10px] font-semibold">
            {candidateData.vision}
          </p>
        </div>

        <div>
          <h3 className="text-[#53599b] text-sm md:text-[15px] font-bold mb-2">
            Mission
          </h3>
          <div className="text-[#53599b] text-[10px] font-semibold text-justify space-y-1">
            {candidateData.missions.map((mission, index) => (
              <p key={index}>
                <span className="font-bold mr-1">{index + 1}.</span>
                {mission}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 md:mt-5">
        <button
          className="bg-[#dbdefc] hover:bg-[#c9cdfc] transition-colors rounded-full px-8 md:px-[35px] py-2 md:py-[3px] min-w-[120px] md:min-w-[135px] flex items-center gap-2"
          aria-label="Change candidate information"
        >
          <svg className="w-3 h-3 text-[#3544e7]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          <span className="text-[#3544e7] text-sm md:text-[15px] font-bold">
            Change
          </span>
        </button>
      </div>
    </section>
  );
};