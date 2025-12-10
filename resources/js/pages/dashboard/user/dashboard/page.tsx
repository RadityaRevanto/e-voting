import React from "react";

export default function AdminVoteGuidelinePage() {
    return (
        <div className="bg-white w-full min-h-screen">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 w-[235px] h-screen bg-[#eaecff] rounded-tr-[25px] rounded-br-[25px] shadow-lg z-20">
                <div className="pt-8 px-6 mb-12">
                    <div className="w-[180px] h-[75px] bg-gradient-to-r from-[#53599b] to-[#232f9b] rounded-lg flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">iVOTE</span>
                    </div>
                </div>

                <nav className="px-6 space-y-4">
                    <button className="flex items-center gap-4 px-3 py-2.5 w-full rounded-lg hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-[#53599b]">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                                <path d="M7 10h10v2H7zm0 4h7v2H7z"/>
                            </svg>
                        </div>
                        <span className="font-semibold text-[#53599b] text-[15px]">
                            Vote
                        </span>
                    </button>

                    <button className="flex items-center gap-4 px-3 py-2.5 w-full rounded-lg hover:bg-white/50 transition-colors">
                        <div className="w-6 h-6 text-[#53599b]">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                            </svg>
                        </div>
                        <span className="font-semibold text-[#53599b] text-[15px]">
                            Vote Guideline
                        </span>
                    </button>
                </nav>

                <button className="absolute bottom-8 left-6 flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="w-6 h-6 text-[#53599b]">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <span className="font-semibold text-[#53599b] text-[15px]">
                        Log-Out
                    </span>
                </button>
            </aside>
        </div>
    );
}