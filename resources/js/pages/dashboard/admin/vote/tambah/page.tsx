import { useState, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import AdminDashboardlayout from "../../../_components/adminlayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InputError from "@/pages/dashboard/_components/input-error";
import { Head } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";

interface Candidate {
    id: number;
    name: string;
    jurusan: string;
    image: string;
}

interface FormErrors {
    ketua_nama?: string;
    ketua_umur?: string;
    ketua_jurusan?: string;
    wakil_nama?: string;
    wakil_umur?: string;
    wakil_jurusan?: string;
    image?: string;
    username?: string;
    email?: string;
    password?: string;
}

export default function TambahPaslonPage() {
    const [formData, setFormData] = useState({
        ketua_nama: "",
        ketua_umur: "",
        ketua_jurusan: "",
        wakil_nama: "",
        wakil_umur: "",
        wakil_jurusan: "",
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
            submitData.append("ketua_nama", formData.ketua_nama);
            submitData.append("ketua_umur", formData.ketua_umur);
            submitData.append("ketua_jurusan", formData.ketua_jurusan);
            submitData.append("wakil_nama", formData.wakil_nama);
            submitData.append("wakil_umur", formData.wakil_umur);
            submitData.append("wakil_jurusan", formData.wakil_jurusan);
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
            setErrors({ ketua_nama: "Terjadi kesalahan saat menambahkan paslon" });
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
                        <Separator className="w-full sm:w-3/4 md:w-1/2 bg-[#030303]" />
                    </header>

                    <main>
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Terdapat kesalahan dalam pengisian form. Silakan periksa kembali.
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                {/* Card 1: Informasi Paslon */}
                                <Card className="shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#53589a]">
                                            Informasi Paslon
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6">
                                        {/* Ketua */}
                                        <div className="space-y-3">
                                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#53589a]">
                                                Ketua
                                            </p>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="ketua_nama"
                                                    className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                >
                                                    Nama Ketua <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="ketua_nama"
                                                    name="ketua_nama"
                                                    type="text"
                                                    value={formData.ketua_nama}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama ketua"
                                                    required
                                                    className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                        !formData.ketua_nama ? "focus-visible:border-red-500" : ""
                                                    }`}
                                                />
                                                <InputError message={errors.ketua_nama} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="ketua_umur"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Umur Ketua <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="ketua_umur"
                                                        name="ketua_umur"
                                                        type="number"
                                                        value={formData.ketua_umur}
                                                        onChange={handleChange}
                                                        placeholder="Umur"
                                                        required
                                                        className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                            !formData.ketua_umur ? "focus-visible:border-red-500" : ""
                                                        }`}
                                                    />
                                                    <InputError message={errors.ketua_umur} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="ketua_jurusan"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Jurusan Ketua <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="ketua_jurusan"
                                                        name="ketua_jurusan"
                                                        type="text"
                                                        value={formData.ketua_jurusan}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan jurusan ketua"
                                                        required
                                                        className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                            !formData.ketua_jurusan ? "focus-visible:border-red-500" : ""
                                                        }`}
                                                    />
                                                    <InputError message={errors.ketua_jurusan} />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Wakil */}
                                        <div className="space-y-3">
                                            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#53589a]">
                                                Wakil
                                            </p>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="wakil_nama"
                                                    className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                >
                                                    Nama Wakil <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="wakil_nama"
                                                    name="wakil_nama"
                                                    type="text"
                                                    value={formData.wakil_nama}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama wakil"
                                                    required
                                                    className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                        !formData.wakil_nama ? "focus-visible:border-red-500" : ""
                                                    }`}
                                                />
                                                <InputError message={errors.wakil_nama} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="wakil_umur"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Umur Wakil <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="wakil_umur"
                                                        name="wakil_umur"
                                                        type="number"
                                                        value={formData.wakil_umur}
                                                        onChange={handleChange}
                                                        placeholder="Umur"
                                                        required
                                                        className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                            !formData.wakil_umur ? "focus-visible:border-red-500" : ""
                                                        }`}
                                                    />
                                                    <InputError message={errors.wakil_umur} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="wakil_jurusan"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Jurusan Wakil <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="wakil_jurusan"
                                                        name="wakil_jurusan"
                                                        type="text"
                                                        value={formData.wakil_jurusan}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan jurusan wakil"
                                                        required
                                                        className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                            !formData.wakil_jurusan ? "focus-visible:border-red-500" : ""
                                                        }`}
                                                    />
                                                    <InputError message={errors.wakil_jurusan} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="image" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Foto Paslon <span className="text-red-500">*</span>
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
                                                        className={`h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-lg cursor-pointer focus-visible:ring-0 ${
                                                            !imageFile ? "focus-visible:border-red-500" : ""
                                                        }`}
                                                    />
                                                    <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                                        Pilih file gambar (JPG, PNG, maksimal 5MB)
                                                    </p>
                                                </div>
                                            )}
                                            <InputError message={errors.image} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 2: Informasi Akun Paslon */}
                                <Card className="shadow-md self-start">
                                    <CardHeader>
                                        <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#53589a]">
                                            Informasi Akun Paslon
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Username <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Masukkan username untuk akun paslon"
                                                required
                                                className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                    !formData.username ? "focus-visible:border-red-500" : ""
                                                }`}
                                            />
                                            <InputError message={errors.username} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Masukkan email untuk akun paslon"
                                                required
                                                className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                    !formData.email ? "focus-visible:border-red-500" : ""
                                                }`}
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Masukkan password untuk akun paslon"
                                                required
                                                className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                    formData.password.length === 0
                                                        ? "focus-visible:border-red-500"
                                                        : ""
                                                }`}
                                            />
                                            <InputError message={errors.password} />
                                            {formData.password.length > 0 && formData.password.length < 8 && (
                                                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                                    Password minimal 8 karakter
                                                </p>
                                            )}
                                        </div>

                                        {/* Tombol Submit dan Batal - diletakkan di bawah Card Informasi Akun Paslon */}
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
                                    </CardContent>
                                </Card>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </AdminDashboardlayout>
    );
}

