import PaslonLayout from "../../../_components/paslonlayout";
import { useState, FormEvent, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";

export default function PaslonEditProfilPage() {
    const [nama, setNama] = useState("");
    const [umur, setUmur] = useState("");
    const [jurusan, setJurusan] = useState("");
    const [fotoProfil, setFotoProfil] = useState<File | null>(null);
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);
    const [errors, setErrors] = useState<{
        nama?: string;
        umur?: string;
        jurusan?: string;
        foto_profil?: string;
        message?: string;
    }>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file (maksimal 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({
                foto_profil: "Ukuran file maksimal 5MB",
            });
            return;
        }

        // Validasi tipe file
        if (!file.type.startsWith("image/")) {
            setErrors({
                foto_profil: "File harus berupa gambar",
            });
            return;
        }

        setFotoProfil(file);
        setErrors((prev) => ({ ...prev, foto_profil: undefined }));

        // Buat preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewFoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleHapusFoto = () => {
        setFotoProfil(null);
        setPreviewFoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");
        setProcessing(true);

        // Validasi client-side
        if (!nama || !umur || !jurusan) {
            setErrors({
                message: "Semua field harus diisi",
            });
            setProcessing(false);
            return;
        }

        // Validasi umur
        const umurNum = parseInt(umur);
        if (isNaN(umurNum) || umurNum < 1 || umurNum > 100) {
            setErrors({
                umur: "Umur harus berupa angka antara 1-100",
            });
            setProcessing(false);
            return;
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "";

            // Jika ada foto profil, gunakan FormData, jika tidak gunakan JSON
            if (fotoProfil) {
                const formData = new FormData();
                formData.append("nama", nama);
                formData.append("umur", umur);
                formData.append("jurusan", jurusan);
                formData.append("foto_profil", fotoProfil);

                const response = await fetch("/settings/profile", {
                    method: "PUT",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Accept": "application/json",
                    },
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({ message: "Terjadi kesalahan saat mengubah profil" });
                    }
                    setProcessing(false);
                    return;
                }
            } else {
                const response = await fetch("/settings/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({
                        nama,
                        umur,
                        jurusan,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({ message: "Terjadi kesalahan saat mengubah profil" });
                    }
                    setProcessing(false);
                    return;
                }
            }

            setSuccess("Profil berhasil diubah!");
            setErrors({});

            // Reset success message setelah 5 detik
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setErrors({
                message: "Terjadi kesalahan saat mengubah profil. Silakan coba lagi.",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <PaslonLayout>
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
                            {previewFoto ? (
                                <div className="space-y-3">
                                    <div className="relative inline-block">
                                        <img
                                            src={previewFoto}
                                            alt="Preview foto profil"
                                            className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            onClick={handleHapusFoto}
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Hapus Foto
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        ref={fileInputRef}
                                        id="foto_profil"
                                        name="foto_profil"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="w-full cursor-pointer"
                                        disabled={processing}
                                        aria-invalid={errors.foto_profil ? "true" : "false"}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Pilih file gambar (JPG, PNG, maksimal 5MB)
                                    </p>
                                </div>
                            )}
                            <InputError message={errors.foto_profil} />
                        </div>

                        {/* Nama */}
                        <div className="space-y-2">
                            <label
                                htmlFor="nama"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama
                            </label>
                            <Input
                                id="nama"
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                placeholder="Masukkan nama lengkap"
                                aria-invalid={errors.nama ? "true" : "false"}
                            />
                            <InputError message={errors.nama} />
                        </div>

                        {/* Umur */}
                        <div className="space-y-2">
                            <label
                                htmlFor="umur"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Umur
                            </label>
                            <Input
                                id="umur"
                                type="number"
                                value={umur}
                                onChange={(e) => setUmur(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                placeholder="Masukkan umur"
                                min="1"
                                max="100"
                                aria-invalid={errors.umur ? "true" : "false"}
                            />
                            <InputError message={errors.umur} />
                            <p className="text-xs text-gray-500">
                                Umur harus antara 1-100 tahun
                            </p>
                        </div>

                        {/* Jurusan */}
                        <div className="space-y-2">
                            <label
                                htmlFor="jurusan"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Jurusan
                            </label>
                            <Input
                                id="jurusan"
                                type="text"
                                value={jurusan}
                                onChange={(e) => setJurusan(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                placeholder="Masukkan jurusan"
                                aria-invalid={errors.jurusan ? "true" : "false"}
                            />
                            <InputError message={errors.jurusan} />
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
        </PaslonLayout>
    );
}