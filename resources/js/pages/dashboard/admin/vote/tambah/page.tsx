import { useState, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import AdminDashboardlayout from "../../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/pages/dashboard/_components/input-error";
import { Head } from "@inertiajs/react";

interface Candidate {
    id: number;
    name: string;
    jurusan: string;
    image: string;
}

interface FormErrors {
    name?: string;
    jurusan?: string;
    image?: string;
    username?: string;
    email?: string;
    password?: string;
}

export default function TambahPaslonPage() {
    const [formData, setFormData] = useState({
        name: "",
        jurusan: "",
        username: "",
        email: "",
        password: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Validasi file gambar
        if (!imageFile) {
            setErrors({ image: "Foto paslon wajib diunggah" });
            setProcessing(false);
            return;
        }

        try {
            // Membuat FormData untuk mengirim file
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("jurusan", formData.jurusan);
            submitData.append("username", formData.username);
            submitData.append("email", formData.email);
            submitData.append("password", formData.password);
            submitData.append("image", imageFile);

            // TODO: Ganti dengan endpoint API yang sesuai
            const response = await fetch("/api/candidates", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
                body: submitData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors || {});
                setProcessing(false);
                return;
            }

            // Redirect ke halaman vote setelah berhasil
            router.visit("/admin/vote");
        } catch (error) {
            console.error("Error:", error);
            setErrors({ name: "Terjadi kesalahan saat menambahkan paslon" });
            setProcessing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi tipe file
            if (!file.type.startsWith("image/")) {
                setErrors({ image: "File harus berupa gambar" });
                return;
            }

            // Validasi ukuran file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ image: "Ukuran file maksimal 5MB" });
                return;
            }

            setImageFile(file);
            setErrors((prev) => ({ ...prev, image: undefined }));

            // Membuat preview gambar
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <AdminDashboardlayout>
            <Head title="Tambah Paslon" />
            <div className="bg-white w-full min-h-screen p-4 sm:p-6 md:p-8">
                <div className="w-full">
                    <header className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                            <h1 className="font-bold text-[#53589a] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                                TAMBAH PASLON
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
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                {/* Card 1: Informasi Paslon */}
                                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#53589a] mb-3 sm:mb-4">
                                        Informasi Paslon
                                    </h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                            Nama Paslon
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Masukkan nama paslon"
                                            required
                                            className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="jurusan" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                            Jurusan
                                        </Label>
                                        <Input
                                            id="jurusan"
                                            name="jurusan"
                                            type="text"
                                            value={formData.jurusan}
                                            onChange={handleChange}
                                            placeholder="Masukkan jurusan/departemen"
                                            required
                                            className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
                                        />
                                        <InputError message={errors.jurusan} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                            Foto Paslon
                                        </Label>
                                        {imagePreview ? (
                                            <div className="space-y-3">
                                                <div className="relative w-full max-w-full sm:max-w-xs border-2 border-gray-300 rounded-lg overflow-hidden">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="default"
                                                    onClick={handleRemoveImage}
                                                    className="w-full sm:w-auto text-sm sm:text-base md:size-lg md:text-lg"
                                                >
                                                    Hapus Gambar
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    ref={fileInputRef}
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    required
                                                    className="h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-lg cursor-pointer"
                                                />
                                                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                                    Pilih file gambar (JPG, PNG, maksimal 5MB)
                                                </p>
                                            </div>
                                        )}
                                        <InputError message={errors.image} />
                                    </div>
                                </div>

                                {/* Card 2: Informasi Akun Paslon */}
                                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#53589a] mb-3 sm:mb-4">
                                        Informasi Akun Paslon
                                    </h3>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Username
                                            </Label>
                                            <Input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Masukkan username untuk akun paslon"
                                                required
                                                className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
                                            />
                                            <InputError message={errors.username} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Masukkan email untuk akun paslon"
                                                required
                                                className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Masukkan password untuk akun paslon"
                                                required
                                                className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg"
                                            />
                                            <InputError message={errors.password} />
                                            <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                                Password minimal 8 karakter
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Submit dan Batal */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-4">
                                <Link href="/admin/vote" className="w-full sm:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="default"
                                        disabled={processing}
                                        className="w-full sm:w-auto text-sm sm:text-base md:size-lg md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6"
                                    >
                                        Batal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    size="default"
                                    disabled={processing}
                                    className="w-full sm:w-auto bg-[#53589a] hover:bg-[#53589a]/90 text-white text-sm sm:text-base md:size-lg md:text-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6"
                                >
                                    {processing ? "Menyimpan..." : "Simpan Paslon"}
                                </Button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}

