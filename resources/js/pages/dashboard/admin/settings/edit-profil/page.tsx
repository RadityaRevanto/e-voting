import AdminDashboardlayout from "../../../_components/adminlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";
import { useEditProfilAdmin } from "@/hooks/use-edit-profil-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminEditProfilPage() {
    const {
        username,
        fotoProfil,
        previewFoto,
        existingFotoUrl,
        errors,
        success,
        processing,
        fileInputRef,
        setUsername,
        handleFotoChange,
        handleHapusFoto,
        handleSubmit,
        getAvatarInitials,
    } = useEditProfilAdmin();

    return (
        <AdminDashboardlayout>
            <div className="bg-white w-full min-h-screen p-6">
                <div className="w-full">
                    <header className="flex flex-col gap-4 mb-8">
                        <h1 className="font-bold text-[#53589a] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            EDIT PROFIL
                        </h1>
                        <div className="h-[2px] w-32 sm:w-64 bg-[#53589a]" />
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {success && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800">{success}</p>
                            </div>
                        )}

                        {errors.message && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">{errors.message}</p>
                            </div>
                        )}

                        {/* Foto Profil */}
                        <div className="space-y-2">
                            <label
                                htmlFor="foto_profil"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Foto Profil
                            </label>
                            <div className="space-y-3">
                                {previewFoto ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={previewFoto}
                                            alt="Preview foto profil"
                                            className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                        />
                                        {(previewFoto.startsWith("data:") || fotoProfil) && (
                                            <Button
                                                type="button"
                                                onClick={handleHapusFoto}
                                                disabled={processing}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center"
                                                aria-label="Hapus foto"
                                            >
                                                ×
                                            </Button>
                                        )}
                                    </div>
                                ) : existingFotoUrl ? (
                                    <div className="relative inline-block">
                                        <img
                                            src={`/storage/${existingFotoUrl}`}
                                            alt="Foto profil"
                                            className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="w-32 h-32 border-4 border-gray-200">
                                        <AvatarImage src="" alt="Foto profil" />
                                        <AvatarFallback className="bg-muted flex size-full items-center justify-center rounded-full text-lg">
                                            {getAvatarInitials() || "AE"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="space-y-2">
                                    <Input
                                        ref={fileInputRef}
                                        id="foto_profil"
                                        name="foto_profil"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handleFotoChange}
                                        className="w-full cursor-pointer"
                                        disabled={processing}
                                        aria-invalid={errors.foto_path ? "true" : "false"}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Pilih file gambar (JPG, PNG, maksimal 2MB)
                                    </p>
                                </div>
                            </div>
                            <InputError message={errors.foto_path} />
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                placeholder="Masukkan username"
                                aria-invalid={errors.username ? "true" : "false"}
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold"
                            >
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}