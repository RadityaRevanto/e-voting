import React, { useState } from "react";
import AdminDashboardlayout from "../../_components/adminlayout";

export default function AdminVoteGuidelinePage() {
    const [guidelines, setGuidelines] = useState([
        { id: 1, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 2, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 3, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 4, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 5, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 6, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 7, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 8, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
        { id: 9, text: "LOREM IPSUM DOLOR LOREM IPSUM DOLOR LOREM IPSUM DOLOR" },
    ]);

    const [newGuideline, setNewGuideline] = useState("");

    const handleAddGuideline = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGuideline.trim()) {
            const newId = guidelines.length > 0 ? Math.max(...guidelines.map(g => g.id)) + 1 : 1;
            setGuidelines([...guidelines, { id: newId, text: newGuideline.trim() }]);
            setNewGuideline("");
        }
    };

    const handleDeleteGuideline = (id: number) => {
        setGuidelines(guidelines.filter(guideline => guideline.id !== id));
    };

    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full ">
                    <header className="mb-6 sm:mb-8 md:mb-12">
                        <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4">
                            VOTERS GUIDLINE
                        </h1>
                        <div className="w-full sm:w-1/2 h-0.5 bg-[#030303]" />
                    </header>

                    <main>
                        <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="font-semibold text-[#53589a] text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
                                Tambah Guideline Baru
                            </h2>
                            <form onSubmit={handleAddGuideline} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={newGuideline}
                                    onChange={(e) => setNewGuideline(e.target.value)}
                                    placeholder="Masukkan guideline baru..."
                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53599b] focus:border-transparent text-sm sm:text-base md:text-lg"
                                />
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#53599b] text-white font-semibold rounded-lg hover:bg-[#434a7a] transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Tambah
                                </button>
                            </form>
                        </div>

                        <ol className="list-none space-y-4 sm:space-y-5 md:space-y-6" role="list" aria-label="Voters Guidelines">
                            {guidelines.map((guideline, index) => (
                                <li
                                    key={guideline.id}
                                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
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
                                    <button
                                        onClick={() => handleDeleteGuideline(guideline.id)}
                                        className="w-full sm:w-auto flex-shrink-0 px-3 sm:px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                                        aria-label={`Hapus guideline ${index + 1}`}
                                    >
                                        Hapus
                                    </button>
                                </li>
                            ))}
                        </ol>

                        {guidelines.length === 0 && (
                            <div className="text-center py-8 sm:py-10 md:py-12 text-gray-500 text-sm sm:text-base md:text-lg">
                                Belum ada guideline. Silakan tambahkan guideline baru.
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}
