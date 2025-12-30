import React from "react";
import UserDashboardlayout from "../../_components/userlayout";
import { useVoteGuidelines } from "../../../../hooks/use-vote-guidelines";

export default function UserVoteGuidelinePage() {
    const { guidelines, loading, error } = useVoteGuidelines();

    return (
        <UserDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full ">
                    <header className="mb-6 sm:mb-8 md:mb-12">
                        <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
                            VOTERS GUIDLINE
                        </h1>
                        <div className="w-full sm:w-1/2 h-0.5 bg-[#030303]" />
                    </header>

                    <main>
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-8 sm:py-10 md:py-12 text-gray-500 text-sm sm:text-base md:text-lg">
                                Memuat guidelines...
                            </div>
                        ) : guidelines.length === 0 ? (
                            <div className="text-center py-8 sm:py-10 md:py-12 text-gray-500 text-sm sm:text-base md:text-lg">
                                Belum ada guideline yang tersedia.
                            </div>
                        ) : (
                            <ol className="list-none space-y-4 sm:space-y-5 md:space-y-6" role="list" aria-label="Voters Guidelines">
                                {guidelines.map((guideline, index) => (
                                    <li
                                        key={guideline.id}
                                        className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4"
                                    >
                                        <div className="flex items-center gap-3 sm:flex-shrink-0">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#53599b] rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="font-bold text-white text-sm sm:text-base md:text-lg">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <p className="font-medium text-black text-sm sm:text-base md:text-lg leading-relaxed flex-1 sm:hidden">
                                                {guideline.text}
                                            </p>
                                        </div>
                                        <p className="font-medium text-black text-sm sm:text-base md:text-lg leading-relaxed flex-1 hidden sm:block">
                                            {guideline.text}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </main>
                </div>
            </div>
        </UserDashboardlayout>
    );
}
