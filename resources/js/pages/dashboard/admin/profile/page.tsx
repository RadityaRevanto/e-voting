import { useState } from "react";
import AdminDashboardlayout from "../../_components/adminlayout";
import { ArrowLeft, User, Mail, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useViewProfilAdmin } from "@/hooks/use-view-profil-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";

export default function AdminProfilePage() {
    const { profile, loading, error } = useViewProfilAdmin();
    const getInitials = useInitials();
    const [imageError, setImageError] = useState(false);

    // Helper untuk mendapatkan foto admin
    const getFotoAdmin = (): string | null => {
        if (profile?.foto_admin && !imageError) {
            return `/storage/${profile.foto_admin}`;
        }
        return null;
    };

    // Helper untuk mendapatkan inisial
    const getAvatarInitials = (): string => {
        if (profile?.username) {
            return getInitials(profile.username);
        }
        return "AE";
    };

    // Handler untuk error saat loading gambar
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <AdminDashboardlayout>
            <div className="bg-gradient-to-br from-[#f7f8ff] to-white w-full min-h-screen p-4 md:p-6 lg:p-8">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#53589a] mb-2">
                                    Profil Admin
                                </h1>
                                <p className="text-sm md:text-base text-[#7b80b8]">
                                    Lihat foto profil yang sudah di-post
                                </p>
                            </div>
                            <Link
                                href="/admin/dashboard"
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
                    {!loading && !error && profile && (
                        <div className="space-y-6 md:space-y-8">
                            {/* Foto Admin - Tengah Atas */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#53599b] to-[#3a3f6b] rounded-full blur-xl opacity-30 scale-110" />
                                    <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#cdd4ff] via-[#e8ebff] to-[#f7f8ff] rounded-full" />
                                        {getFotoAdmin() ? (
                                            <img
                                                src={getFotoAdmin()!}
                                                alt="Foto Profil Admin"
                                                className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <Avatar className="relative w-full h-full border-4 border-white shadow-lg">
                                                <AvatarImage src="" alt="Foto Profil Admin" />
                                                <AvatarFallback className="bg-muted flex size-full items-center justify-center rounded-full text-4xl md:text-5xl lg:text-6xl">
                                                    {getAvatarInitials()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
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
                                                {profile.username || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#eaedff] rounded-lg">
                                            <Mail className="w-5 h-5 text-[#53589a]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-[#7b80b8] mb-1">Email</p>
                                            <p className="text-lg font-semibold text-[#53589a]">
                                                {profile.email || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Edit Profil */}
                            <div className="flex justify-center pt-4">
                                <Link
                                    href="/admin/settings/edit-profil"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold transition-colors"
                                >
                                    Edit Profil
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminDashboardlayout>
    );
}

