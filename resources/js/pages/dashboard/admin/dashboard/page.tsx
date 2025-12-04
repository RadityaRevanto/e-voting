import React from "react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { ElectionActivitiesSection } from "./components/ElectionActivitiesSection";
import { LiveResultsSection } from "./components/LiveResultsSection";
import { OngoingElectionSection } from "./components/OngoingElectionSection";
import { VotingProcessSection } from "./components/VotingProcessSection";

export default function AdminDashboardPage(): React.ReactElement {
    return (
        <AdminDashboardlayout>
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
                    <div className="col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-8 space-y-4 md:space-y-5 xl:space-y-6">
                        <OngoingElectionSection />
                        <LiveResultsSection />
                        <ElectionActivitiesSection />
                    </div>

                    <div className="col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-4 space-y-4 md:space-y-5 xl:space-y-6">
                        <aside
                            className="bg-white rounded-[20px] md:rounded-[25px] xl:rounded-[30px] border-2 border-[#80808080] shadow-[0px_4px_4px_#00000040] p-4 md:p-5 xl:p-6"
                            aria-label="Calendar"
                        >
                            <h2 className="text-[#53599b] text-lg md:text-xl xl:text-xl font-bold mb-3 md:mb-4">
                                Calendar
                            </h2>
                            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
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
                        </aside>

                        <VotingProcessSection />
                    </div>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}
