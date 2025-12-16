import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AdminDashboardlayout from "../../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Head } from "@inertiajs/react";
import { AlertCircle, UserX } from "lucide-react";

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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

    // TODO: Fetch data dari API saat component mount
    // useEffect(() => {
    //     fetch("/api/candidates")
    //         .then((res) => res.json())
    //         .then((data) => setCandidates(data))
    //         .catch((err) => console.error("Error fetching candidates:", err));
    // }, []);

    const handleOpenDeleteDialog = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedCandidate) return;

        setDeletingId(selectedCandidate.id);
        try {
            // TODO: Ganti dengan endpoint API yang sesuai
            const response = await fetch(`/api/candidates/${selectedCandidate.id}`, {
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
            setCandidates((prev) => prev.filter((c) => c.id !== selectedCandidate.id));
            setDeleteDialogOpen(false);
            setSelectedCandidate(null);
            setDeletingId(null);
            
            // Redirect ke halaman vote setelah berhasil
            router.visit("/admin/vote");
        } catch (error) {
            console.error("Error:", error);
            setDeletingId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedCandidate(null);
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
                        <Separator className="w-full sm:w-3/4 md:w-1/2 bg-[#030303]" />
                    </header>

                    <main>
                        {candidates.length === 0 ? (
                            <Alert className="max-w-2xl mx-auto">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-center py-8 sm:py-12 md:py-16">
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
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                {candidates.map((candidate) => (
                                    <Card
                                        key={candidate.id}
                                        className="hover:border-destructive transition-all"
                                    >
                                        <CardContent className="flex flex-col items-center p-4 sm:p-5 md:p-6">
                                            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 border-2 sm:border-4 border-gray-100">
                                                <AvatarImage
                                                    src={candidate.image}
                                                    alt={candidate.name || "Candidate"}
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://via.placeholder.com/192";
                                                    }}
                                                />
                                                <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-bold text-[#53589a]">
                                                    {candidate.name?.charAt(0) || "C"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="font-bold text-[#53589a] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-center px-2">
                                                {candidate.name}
                                            </h3>
                                            <p className="font-medium text-[#53599b] text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 text-center px-2">
                                                {candidate.department}
                                            </p>
                                            <Button
                                                variant="destructive"
                                                size="default"
                                                onClick={() => handleOpenDeleteDialog(candidate)}
                                                disabled={deletingId === candidate.id}
                                                className="w-full text-sm sm:text-base md:size-lg"
                                            >
                                                <UserX className="mr-2 h-4 w-4" />
                                                Hapus Paslon
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </main>

                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Hapus Paslon</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus paslon{" "}
                                    <strong>{selectedCandidate?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedCandidate && (
                                <div className="flex items-center gap-4 py-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage
                                            src={selectedCandidate.image}
                                            alt={selectedCandidate.name}
                                        />
                                        <AvatarFallback>
                                            {selectedCandidate.name?.charAt(0) || "C"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-lg">{selectedCandidate.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedCandidate.department}</p>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={handleCancelDelete}
                                    disabled={deletingId !== null}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deletingId !== null}
                                >
                                    {deletingId !== null ? "Menghapus..." : "Ya, Hapus"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}

