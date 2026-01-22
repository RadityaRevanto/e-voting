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
import { usePaslon, Paslon } from "@/hooks/use-paslon";
import { Spinner } from "@/components/ui/spinner";

export default function HapusPaslonPage() {
    const { paslonList, loading, error, deletingId, deletePaslon } = usePaslon();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPaslon, setSelectedPaslon] = useState<Paslon | null>(null);

    const handleOpenDeleteDialog = (paslon: Paslon) => {
        setSelectedPaslon(paslon);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedPaslon) return;

        const success = await deletePaslon(selectedPaslon.id);
        
        if (success) {
            setDeleteDialogOpen(false);
            setSelectedPaslon(null);
            // Redirect ke halaman vote setelah berhasil
            router.visit("/admin/vote");
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedPaslon(null);
    };

    // Helper function untuk mendapatkan nama paslon
    const getPaslonName = (paslon: Paslon): string => {
        return `${paslon.nama_ketua} & ${paslon.nama_wakil_ketua}`;
    };

    // Helper function untuk mendapatkan jurusan
    const getPaslonDepartment = (paslon: Paslon): string => {
        return paslon.jurusan_ketua || paslon.jurusan_wakil_ketua || "Tidak Diketahui";
    };

    // Helper function untuk mendapatkan URL foto
    const getPaslonImageUrl = (paslon: Paslon): string | null => {
        return paslon.foto_paslon ? `/storage/${paslon.foto_paslon}` : null;
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
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="flex flex-col items-center gap-4">
                                    <Spinner />
                                    <p className="text-gray-600">Memuat data paslon...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <Alert variant="destructive" className="max-w-2xl mx-auto">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : paslonList.length === 0 ? (
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
                                {paslonList.map((paslon) => {
                                    const paslonName = getPaslonName(paslon);
                                    const department = getPaslonDepartment(paslon);
                                    const imageUrl = getPaslonImageUrl(paslon);
                                    
                                    return (
                                        <Card
                                            key={paslon.id}
                                            className="hover:border-destructive transition-all"
                                        >
                                            <CardContent className="flex flex-col items-center p-4 sm:p-5 md:p-6">
                                                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-3 sm:mb-4 border-2 sm:border-4 border-gray-100">
                                                    <AvatarImage
                                                        src={imageUrl || undefined}
                                                        alt={paslonName}
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "https://via.placeholder.com/192";
                                                        }}
                                                    />
                                                    <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-bold text-[#53589a]">
                                                        {paslon.nama_ketua?.charAt(0) || "P"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <h3 className="font-bold text-[#53589a] text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-center px-2">
                                                    {paslonName}
                                                </h3>
                                                <p className="font-medium text-[#53599b] text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 text-center px-2">
                                                    {department}
                                                </p>
                                                <Button
                                                    variant="destructive"
                                                    size="default"
                                                    onClick={() => handleOpenDeleteDialog(paslon)}
                                                    disabled={deletingId === paslon.id}
                                                    className="w-full text-sm sm:text-base md:size-lg"
                                                >
                                                    <UserX className="mr-2 h-4 w-4" />
                                                    {deletingId === paslon.id ? "Menghapus..." : "Hapus Paslon"}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </main>

                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Konfirmasi Hapus Paslon</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus paslon{" "}
                                    <strong>{selectedPaslon ? getPaslonName(selectedPaslon) : ""}</strong>? Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                            </DialogHeader>
                            {selectedPaslon && (
                                <div className="flex items-center gap-4 py-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage
                                            src={getPaslonImageUrl(selectedPaslon) || undefined}
                                            alt={getPaslonName(selectedPaslon)}
                                        />
                                        <AvatarFallback>
                                            {selectedPaslon.nama_ketua?.charAt(0) || "P"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-lg">{getPaslonName(selectedPaslon)}</p>
                                        <p className="text-sm text-muted-foreground">{getPaslonDepartment(selectedPaslon)}</p>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
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

