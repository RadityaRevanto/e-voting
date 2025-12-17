import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import { AlertCircle } from "lucide-react";

interface Paslon {
    id: number;
    user_id: number;
    nama_ketua: string;
    umur_ketua?: number;
    jurusan_ketua?: string;
    nama_wakil_ketua: string;
    umur_wakil_ketua?: number;
    jurusan_wakil_ketua?: string;
    foto_paslon?: string;
    visi?: string;
    misi?: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Paslon[];
}

interface PaslonCardProps {
    paslon: Paslon;
}

function PaslonCard({ paslon }: PaslonCardProps) {
    // Format nama paslon: Ketua & Wakil Ketua
    const paslonName = `${paslon.nama_ketua} & ${paslon.nama_wakil_ketua}`;

    // Format jurusan (jika ada)
    const jurusan = paslon.jurusan_ketua || paslon.jurusan_wakil_ketua || "Tidak Diketahui";

    // URL foto paslon
    const fotoUrl = paslon.foto_paslon
        ? `/storage/${paslon.foto_paslon}`
        : null;

    return (
        <Card className="flex flex-col items-center w-full min-h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-b from-[#ccd3e3] via-[#e5e8f0] to-white border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center w-full h-full p-4 sm:p-6 md:p-8">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-4 sm:mb-5 md:mb-6 border-4 border-white shadow-md">
                    <AvatarImage
                        src={fotoUrl || undefined}
                        alt={paslonName}
                        className="object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/192";
                        }}
                    />
                    <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#53589a]">
                        {paslon.nama_ketua?.charAt(0) || "P"}
                    </AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-[#53589a] text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 text-center px-2">
                    {paslonName}
                </h2>
                <div className="flex flex-col items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-base sm:text-lg md:text-xl px-3 py-1">
                        {jurusan}
                    </Badge>
                    {(paslon.umur_ketua || paslon.umur_wakil_ketua) && (
                        <p className="text-sm text-gray-600">
                            {paslon.umur_ketua && `Ketua: ${paslon.umur_ketua} tahun`}
                            {paslon.umur_ketua && paslon.umur_wakil_ketua && " • "}
                            {paslon.umur_wakil_ketua && `Wakil: ${paslon.umur_wakil_ketua} tahun`}
                        </p>
                    )}
                </div>
                {paslon.visi && (
                    <div className="mt-4 text-center">
                        <p className="text-sm font-semibold text-[#53589a] mb-1">Visi:</p>
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">{paslon.visi}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminVotePage() {
    const [paslonList, setPaslonList] = useState<Paslon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaslon();
    }, []);

    const fetchPaslon = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get("/api/admin/paslon/");

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Gagal mengambil data paslon");
            }

            const data: ApiResponse = await response.json();

            if (data.success && data.data) {
                setPaslonList(data.data);
            } else {
                setPaslonList([]);
            }
        } catch (err) {
            console.error("Error fetching paslon:", err);
            setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data paslon");
            setPaslonList([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-8 sm:mb-12 md:mb-16">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl">
                                VOTE MANAGEMENT
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                                <Link href="/admin/vote/tambah" className="w-full sm:w-auto">
                                    <Button
                                        size="default"
                                        className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-white text-sm sm:text-base md:size-lg"
                                    >
                                        Tambah Paslon
                                    </Button>
                                </Link>
                                <Link href="/admin/vote/hapus" className="w-full sm:w-auto">
                                    <Button
                                        variant="destructive"
                                        size="default"
                                        className="w-full sm:w-auto text-sm sm:text-base md:size-lg"
                                    >
                                        Hapus Paslon
                                    </Button>
                                </Link>
                            </div>
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
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                                <p className="text-xl text-gray-600 mb-4">Belum ada paslon terdaftar</p>
                                <Link href="/admin/vote/tambah">
                                    <Button className="bg-[#53589a] hover:bg-[#53589a]/90 text-white">
                                        Tambah Paslon Pertama
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 justify-items-center">
                                {paslonList.map((paslon) => (
                                    <PaslonCard key={paslon.id} paslon={paslon} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}
