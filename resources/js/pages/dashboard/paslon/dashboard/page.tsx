import React from "react";
import PaslonLayout from "../../_components/paslonlayout";
import { CalendarSection } from "./components/calendar";
import { VisionMissionSection } from "./components/visionmision";
import { VotingProcessSection } from "./components/votingprocess";

export default function PaslonDashboardPage(): React.ReactElement {
  return (
    <PaslonLayout>
      <div className="bg-white w-full min-h-screen p-4 md:p-6 xl:p-8">
        <header className="mb-4 md:mb-6 xl:mb-8">
          <h1 className="text-[#53589a] text-2xl md:text-3xl xl:text-4xl font-medium mb-1">
            <span className="font-medium">Hello</span>
            <span className="font-bold">, Aditya!</span>
          </h1>
          <p className="text-[#53599b] text-base md:text-lg xl:text-xl font-medium">
            Welcome To Online Voting System
          </p>
        </header>

        <div className="grid grid-cols-12 gap-4 md:gap-5 xl:gap-6">
          {/* Bagian Kiri - Calendar di atas, Vision & Mission di bawah */}
          <div className="col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-8 space-y-4 md:space-y-5 xl:space-y-6">
            <CalendarSection />
            <VisionMissionSection />
          </div>

          {/* Bagian Kanan - Voting Process */}
          <div className="col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-4 space-y-4 md:space-y-5 xl:space-y-6">
            <VotingProcessSection />
          </div>
        </div>
      </div>
    </PaslonLayout>
  );
}