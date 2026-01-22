import React from "react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { GripVertical } from "lucide-react";
import { useAdminVoteGuidelines, Guideline } from "../../../../hooks/use-vote-guidelines";

export default function AdminVoteGuidelinePage() {
    const {
        guidelines,
        loading,
        processing,
        error,
        newGuideline,
        setNewGuideline,
        editingId,
        editingText,
        startEdit,
        setEditingText,
        cancelEdit,
        deleteConfirmId,
        requestDelete,
        cancelDelete,
        draggedId,
        dragOverId,
        addGuideline,
        updateGuideline,
        confirmDelete,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
    } = useAdminVoteGuidelines();

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
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                            </div>
                        )}

                        <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="font-semibold text-[#53589a] text-base sm:text-lg md:text-xl mb-3 sm:mb-4">
                                Tambah Guideline Baru
                            </h2>
                            <form onSubmit={addGuideline} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={newGuideline}
                                    onChange={(e) => setNewGuideline(e.target.value)}
                                    placeholder="Masukkan guideline baru..."
                                    disabled={processing}
                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53599b] focus:border-transparent text-sm sm:text-base md:text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="submit"
                                    disabled={processing || !newGuideline.trim()}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#53599b] text-white font-semibold rounded-lg hover:bg-[#434a7a] transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Memproses..." : "Tambah"}
                                </button>
                            </form>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 sm:py-10 md:py-12 text-gray-500 text-sm sm:text-base md:text-lg">
                                Memuat guidelines...
                            </div>
                        ) : (
                            <ol className="list-none space-y-4 sm:space-y-5 md:space-y-6" role="list" aria-label="Voters Guidelines">
                                {guidelines.map((guideline: Guideline, index: number) => (
                                <li
                                    key={guideline.id}
                                    draggable={editingId !== guideline.id}
                                    onDragStart={(e) => handleDragStart(e, guideline.id)}
                                    onDragOver={(e) => handleDragOver(e, guideline.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, guideline.id)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 ${
                                        editingId === guideline.id 
                                            ? '' 
                                            : 'hover:bg-gray-100 cursor-move'
                                    } ${
                                        draggedId === guideline.id 
                                            ? 'opacity-50 scale-95' 
                                            : ''
                                    } ${
                                        dragOverId === guideline.id && draggedId !== guideline.id
                                            ? 'border-[#53599b] border-2 bg-blue-50' 
                                            : ''
                                    }`}
                                >
                                    {editingId === guideline.id ? (
                                        <>
                                            <div className="flex items-center gap-3 sm:flex-shrink-0">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#53599b] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="font-bold text-white text-sm sm:text-base md:text-lg">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                            <form onSubmit={(e) => updateGuideline(guideline.id, e)} className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#53599b] focus:border-transparent text-sm sm:text-base md:text-lg"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="px-3 sm:px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? "Menyimpan..." : "Simpan"}
                                                </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="px-3 sm:px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 sm:flex-shrink-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-gray-400 hover:text-gray-600 transition-colors pointer-events-none">
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#53599b] rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="font-bold text-white text-sm sm:text-base md:text-lg">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-black text-sm sm:text-base md:text-lg leading-relaxed flex-1 sm:hidden">
                                                    {guideline.text}
                                                </p>
                                            </div>
                                            <p className="font-medium text-black text-sm sm:text-base md:text-lg leading-relaxed flex-1 hidden sm:block">
                                                {guideline.text}
                                            </p>
                                            <div className="w-full sm:w-auto flex gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => startEdit(guideline.id, guideline.text)}
                                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base"
                                                    aria-label={`Edit guideline ${index + 1}`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => requestDelete(guideline.id)}
                                                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base"
                                                    aria-label={`Hapus guideline ${index + 1}`}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                                ))}
                            </ol>
                        )}

                        {!loading && guidelines.length === 0 && (
                            <div className="text-center py-8 sm:py-10 md:py-12 text-gray-500 text-sm sm:text-base md:text-lg">
                                Belum ada guideline. Silakan tambahkan guideline baru.
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#53589a] mb-4">
                            Konfirmasi Hapus
                        </h3>
                        <p className="text-gray-700 text-base sm:text-lg mb-6">
                            Yakin mau hapus guideline ini?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={cancelDelete}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm sm:text-base"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={processing}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminDashboardlayout>
    );
}
