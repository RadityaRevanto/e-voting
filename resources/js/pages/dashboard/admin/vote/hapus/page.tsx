import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import AdminDashboardlayout from "../../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Head } from "@inertiajs/react";

interface Candidate {
    id: number;
    name: string;
    department: string;
    image: string;
}

// Data dummy - TODO: Ganti dengan data dari API
const candidatesData: Candidate[] = [
    {
        id: 1,
        name: "Candidate 1",
        department: "System Information",
        image: "/images/candidate1.jpg",
    },
    {
        id: 2,
        name: "Candidate 2",
        department: "System Information",
        image: "/images/candidate2.jpg",
    },
    {
        id: 3,
        name: "Candidate 3",
        department: "System Information",
        image: "/images/candidate3.jpg",
    },
];

export default function HapusPaslonPage() {
    const [candidates, setCandidates] = useState<Candidate[]>(candidatesData);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    // TODO: Fetch data dari API saat component mount
    // useEffect(() => {
    //     fetch("/api/candidates")
    //         .then((res) => res.json())
    //         .then((data) => setCandidates(data))
    //         .catch((err) => console.error("Error fetching candidates:", err));
    // }, []);

    const handleDelete = async (id: number) => {
        if (confirmDelete !== id) {
            setConfirmDelete(id);
            return;
        }

        setDeletingId(id);
        try {
            // TODO: Ganti dengan endpoint API yang sesuai
            const response = await fetch(`/api/candidates/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus paslon");
            }

            // Hapus dari state lokal
            setCandidates((prev) => prev.filter((c) => c.id !== id));
            setConfirmDelete(null);
            
            // Redirect ke halaman vote setelah berhasil
            router.visit("/admin/vote");
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menghapus paslon");
            setDeletingId(null);
            setConfirmDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
    };

    return (
        <AdminDashboardlayout>
            <Head title="Hapus Paslon" />
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                HAPUS PASLON
                            </h1>
                            <Link href="/admin/vote" className="w-full sm:w-auto">
                                <Button 
                                    variant="outline" 
                                    size="default"
                                    className="w-full sm:w-auto text-sm sm:text-base md:size-lg"
                                >
                                    Kembali
                                </Button>
                            </Link>
                        </div>
                        <div className="w-full sm:w-3/4 md:w-1/2 h-0.5 sm:h-1 bg-[#030303]" />
                    </header>

                    <main>
                        {candidates.length === 0 ? (
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-4 sm:mb-6 px-4">
                                    Tidak ada paslon yang tersedia
                                </p>
                                <Link href="/admin/vote/tambah" className="inline-block">
                                    <Button 
                                        size="default" 
                                        className="bg-[#53589a] hover:bg-[#53589a]/90 text-sm sm:text-base md:size-lg px-4 sm:px-6 md:px-8"
                                    >
                                        Tambah Paslon
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                {candidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border-2 border-gray-100 hover:border-red-200 transition-all"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-full mb-3 sm:mb-4 flex items-center justify-center shadow-md border-2 sm:border-4 border-gray-100">
                                                <img
                                                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover"
                                                    alt={candidate.name || "Candidate"}
                                                    src={candidate.image}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://via.placeholder.com/192";
                                                    }}
                                                />
                                            </div>
                                            <h3 className="font-bold text-[#53589a] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-center px-2">
                                                {candidate.name}
                                            </h3>
                                            <p className="font-medium text-[#53599b] text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 text-center px-2">
                                                {candidate.department}
                                            </p>

                                            {confirmDelete === candidate.id ? (
                                                <div className="w-full space-y-2 sm:space-y-3">
                                                    <p className="text-xs sm:text-sm text-red-600 font-semibold text-center px-2">
                                                        Yakin hapus paslon ini?
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(candidate.id)}
                                                            disabled={deletingId === candidate.id}
                                                            className="flex-1 text-xs sm:text-sm"
                                                        >
                                                            {deletingId === candidate.id ? "Menghapus..." : "Ya, Hapus"}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleCancelDelete}
                                                            disabled={deletingId === candidate.id}
                                                            className="flex-1 text-xs sm:text-sm"
                                                        >
                                                            Batal
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="destructive"
                                                    size="default"
                                                    onClick={() => handleDelete(candidate.id)}
                                                    disabled={deletingId === candidate.id}
                                                    className="w-full text-sm sm:text-base md:size-lg"
                                                >
                                                    Hapus Paslon
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}

