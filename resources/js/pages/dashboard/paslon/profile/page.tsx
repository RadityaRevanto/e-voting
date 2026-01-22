import { useState, useEffect } from "react";
import PaslonLayout from "../../_components/paslonlayout";
import { ArrowLeft, User, Calendar, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import { apiClient } from "@/lib/api-client";

interface PaslonProfileData {
    id: number;
    username: string;
    email: string;
    nama_ketua: string;
    umur_ketua: number | null;
    jurusan_ketua: string | null;
    nama_wakil_ketua: string;
    umur_wakil_ketua: number | null;
    jurusan_wakil_ketua: string | null;
    foto_paslon: string | null;
    visi: string | null;
    misi: string | null;
}

export default function PaslonProfilePage() {
    const [paslon, setPaslon] = useState<PaslonProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaslonProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiClient.get("/api/paslon/profile");

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData
                        ? String(errorData.message)
                        : "Gagal mengambil data profil";
                    setError(errorMessage);
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                if (data.success && data.data) {
                    setPaslon(data.data);
                } else {
                    setError("Data profil tidak ditemukan");
                }
            } catch (error) {
                console.error("Error fetching paslon profile:", error);
                setError("Terjadi kesalahan saat mengambil data profil. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaslonProfile();
    }, []);

    // Helper untuk mendapatkan foto paslon
    const getFotoPaslon = (): string => {
        if (paslon?.foto_paslon) {
            return `/storage/${paslon.foto_paslon}`;
        }
        return "/avatars/shadcn.jpg";
    };

    return (
        <PaslonLayout>
            <div className="bg-gradient-to-br from-[#f7f8ff] to-white w-full min-h-screen p-4 md:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#53589a] mb-2">
                                    Profil Paslon
                                </h1>
                                <p className="text-sm md:text-base text-[#7b80b8]">
                                    Lihat detail informasi profil paslon Anda
                                </p>
                            </div>
                            <Link
                                href="/paslon/dashboard"
                                className="inline-flex items-center gap-2 text-[#53589a] hover:text-[#3a3f6b] transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold text-sm md:text-base">Kembali ke Dashboard</span>
                            </Link>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 md:py-16">
                            <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-[#53589a] animate-spin mb-4" />
                            <p className="text-[#7b80b8] text-base md:text-lg font-medium">
                                Memuat data profil...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-[25px] p-6 md:p-8 mb-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-xl font-bold text-red-800 mb-2">
                                        Gagal Memuat Data
                                    </h3>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content - hanya tampilkan jika tidak loading dan tidak ada error */}
                    {!loading && !error && paslon && (
                        <div className="space-y-6 md:space-y-8">
                            {/* Foto Paslon - Tengah Atas */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#53599b] to-[#3a3f6b] rounded-full blur-xl opacity-30 scale-110" />
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#cdd4ff] via-[#e8ebff] to-[#f7f8ff] rounded-full" />
                                        <img
                                            src={getFotoPaslon()}
                                            alt="Foto Paslon"
                                            className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Profil */}
                            <div className="bg-white rounded-[25px] shadow-lg p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#53589a] mb-6 pb-4 border-b-2 border-[#eaedff]">
                                    Informasi Akun
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#eaedff] rounded-lg">
                                            <User className="w-5 h-5 text-[#53589a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#7b80b8] mb-1">Username</p>
                                            <p className="text-lg font-semibold text-[#53589a]">
                                                {paslon.username || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#eaedff] rounded-lg">
                                            <User className="w-5 h-5 text-[#53589a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#7b80b8] mb-1">Email</p>
                                            <p className="text-lg font-semibold text-[#53589a]">
                                                {paslon.email || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Data Ketua */}
                            <div className="bg-white rounded-[25px] shadow-lg p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#53589a] mb-6 pb-4 border-b-2 border-[#eaedff]">
                                    Data Ketua
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#eaedff] rounded-lg">
                                            <User className="w-5 h-5 text-[#53589a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#7b80b8] mb-1">Nama Ketua</p>
                                            <p className="text-lg font-semibold text-[#53589a]">
                                                {paslon.nama_ketua || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {paslon.umur_ketua && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#eaedff] rounded-lg">
                                                <Calendar className="w-5 h-5 text-[#53589a]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#7b80b8] mb-1">Umur Ketua</p>
                                                <p className="text-lg font-semibold text-[#53589a]">
                                                    {paslon.umur_ketua} tahun
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paslon.jurusan_ketua && (
                                        <div className="flex items-start gap-4 md:col-span-2">
                                            <div className="p-3 bg-[#eaedff] rounded-lg">
                                                <GraduationCap className="w-5 h-5 text-[#53589a]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#7b80b8] mb-1">Jurusan Ketua</p>
                                                <p className="text-lg font-semibold text-[#53589a]">
                                                    {paslon.jurusan_ketua}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Data Wakil Ketua */}
                            <div className="bg-white rounded-[25px] shadow-lg p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#53589a] mb-6 pb-4 border-b-2 border-[#eaedff]">
                                    Data Wakil Ketua
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#eaedff] rounded-lg">
                                            <User className="w-5 h-5 text-[#53589a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#7b80b8] mb-1">Nama Wakil Ketua</p>
                                            <p className="text-lg font-semibold text-[#53589a]">
                                                {paslon.nama_wakil_ketua || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {paslon.umur_wakil_ketua && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#eaedff] rounded-lg">
                                                <Calendar className="w-5 h-5 text-[#53589a]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#7b80b8] mb-1">Umur Wakil Ketua</p>
                                                <p className="text-lg font-semibold text-[#53589a]">
                                                    {paslon.umur_wakil_ketua} tahun
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {paslon.jurusan_wakil_ketua && (
                                        <div className="flex items-start gap-4 md:col-span-2">
                                            <div className="p-3 bg-[#eaedff] rounded-lg">
                                                <GraduationCap className="w-5 h-5 text-[#53589a]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#7b80b8] mb-1">Jurusan Wakil Ketua</p>
                                                <p className="text-lg font-semibold text-[#53589a]">
                                                    {paslon.jurusan_wakil_ketua}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Edit Profil */}
                            <div className="flex justify-center pt-4">
                                <Link
                                    href="/paslon/settings/edit-profil"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold transition-colors"
                                >
                                    Edit Profil
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PaslonLayout>
    );
}

