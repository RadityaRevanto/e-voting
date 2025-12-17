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
import { apiClient } from "@/lib/api-client";
import { Textarea } from "@/components/ui/textarea";

interface Candidate {
    id: number;
    name: string;
    jurusan: string;
    image: string;
}

interface FormErrors {
    nama_ketua?: string;
    umur_ketua?: string;
    jurusan_ketua?: string;
    nama_wakil_ketua?: string;
    umur_wakil_ketua?: string;
    jurusan_wakil_ketua?: string;
    foto_paslon?: string;
    username?: string;
    email?: string;
    password?: string;
    confirm_password?: string;
    visi?: string;
    misi?: string;
}

export default function TambahPaslonPage() {
    const [formData, setFormData] = useState({
        nama_ketua: "",
        umur_ketua: "",
        jurusan_ketua: "",
        nama_wakil_ketua: "",
        umur_wakil_ketua: "",
        jurusan_wakil_ketua: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        visi: "",
        misi: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setSuccessMessage(null);

        // Validasi password match
        if (formData.password !== formData.confirm_password) {
            setErrors({ confirm_password: "Password dan konfirmasi password tidak sama" });
            setProcessing(false);
            return;
        }

        // Validasi konfirmasi password di sisi frontend
        if (formData.password !== formData.password_confirmation) {
            setErrors({
                password_confirmation: "Konfirmasi password tidak sama dengan password",
            });
            setProcessing(false);
            return;
        }

        try {
            // Membuat FormData untuk mengirim file
            const submitData = new FormData();
            submitData.append("username", formData.username);
            submitData.append("email", formData.email);
            submitData.append("password", formData.password);
            submitData.append("confirm_password", formData.confirm_password);
            submitData.append("nama_ketua", formData.nama_ketua);
            submitData.append("umur_ketua", formData.umur_ketua || "");
            submitData.append("jurusan_ketua", formData.jurusan_ketua || "");
            submitData.append("nama_wakil_ketua", formData.nama_wakil_ketua);
            submitData.append("umur_wakil_ketua", formData.umur_wakil_ketua || "");
            submitData.append("jurusan_wakil_ketua", formData.jurusan_wakil_ketua || "");
            submitData.append("visi", formData.visi || "");
            submitData.append("misi", formData.misi || "");

            if (imageFile) {
                submitData.append("foto_paslon", imageFile);
            }

            // Menggunakan apiClient untuk handle authentication dan refresh token otomatis
            const response = await apiClient.fetch("/api/admin/paslon/register", {
                method: "POST",
                body: submitData,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors
                if (data.errors) {
                    const formattedErrors: FormErrors = {};
                    Object.keys(data.errors).forEach((key) => {
                        formattedErrors[key as keyof FormErrors] = Array.isArray(data.errors[key])
                            ? data.errors[key][0]
                            : data.errors[key];
                    });
                    setErrors(formattedErrors);
                } else {
                    setErrors({ nama_ketua: data.message || "Terjadi kesalahan saat menambahkan paslon" });
                }
                setProcessing(false);
                return;
            }

            if (data.success) {
                setSuccessMessage(data.message || "Paslon berhasil didaftarkan");
                // Reset form
                setFormData({
                    nama_ketua: "",
                    umur_ketua: "",
                    jurusan_ketua: "",
                    nama_wakil_ketua: "",
                    umur_wakil_ketua: "",
                    jurusan_wakil_ketua: "",
                    username: "",
                    email: "",
                    password: "",
                    confirm_password: "",
                    visi: "",
                    misi: "",
                });
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                // Redirect ke halaman vote setelah 2 detik
                setTimeout(() => {
                    router.visit("/admin/vote");
                }, 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            setErrors({ nama_ketua: "Terjadi kesalahan saat menambahkan paslon. Silakan coba lagi." });
        } finally {
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
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setErrors({ foto_paslon: "File harus berupa gambar (JPG, PNG, GIF)" });
                return;
            }

            // Validasi ukuran file (max 2MB sesuai API)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ foto_paslon: "Ukuran file maksimal 2MB" });
                return;
            }

            setImageFile(file);
            setErrors((prev) => ({ ...prev, foto_paslon: undefined }));

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
                        {successMessage && (
                            <Alert className="mb-4 bg-green-50 border-green-200">
                                <AlertDescription className="text-green-800">
                                    {successMessage}
                                </AlertDescription>
                            </Alert>
                        )}
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
                                                    htmlFor="nama_ketua"
                                                    className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                >
                                                    Nama Ketua <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="nama_ketua"
                                                    name="nama_ketua"
                                                    type="text"
                                                    value={formData.nama_ketua}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama ketua"
                                                    required
                                                    className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                        !formData.nama_ketua ? "focus-visible:border-red-500" : ""
                                                    }`}
                                                />
                                                <InputError message={errors.nama_ketua} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="umur_ketua"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Umur Ketua
                                                    </Label>
                                                    <Input
                                                        id="umur_ketua"
                                                        name="umur_ketua"
                                                        type="number"
                                                        value={formData.ketua_umur}
                                                        onChange={handleChange}
                                                        placeholder="Umur"
                                                        min="1"
                                                        max="100"
                                                        className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                                    />
                                                    <InputError message={errors.umur_ketua} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="jurusan_ketua"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Jurusan Ketua
                                                    </Label>
                                                    <Input
                                                        id="jurusan_ketua"
                                                        name="jurusan_ketua"
                                                        type="text"
                                                        value={formData.ketua_jurusan}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan jurusan ketua"
                                                        className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                                    />
                                                    <InputError message={errors.jurusan_ketua} />
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
                                                    htmlFor="nama_wakil_ketua"
                                                    className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                >
                                                    Nama Wakil Ketua <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="nama_wakil_ketua"
                                                    name="nama_wakil_ketua"
                                                    type="text"
                                                    value={formData.wakil_nama}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama wakil"
                                                    required
                                                    className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                        !formData.nama_wakil_ketua ? "focus-visible:border-red-500" : ""
                                                    }`}
                                                />
                                                    <InputError message={errors.nama_wakil_ketua} />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="umur_wakil_ketua"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Umur Wakil Ketua
                                                    </Label>
                                                    <Input
                                                        id="umur_wakil_ketua"
                                                        name="umur_wakil_ketua"
                                                        type="number"
                                                        value={formData.wakil_umur}
                                                        onChange={handleChange}
                                                        placeholder="Umur"
                                                        min="1"
                                                        max="100"
                                                        className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                                    />
                                                    <InputError message={errors.umur_wakil_ketua} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="jurusan_wakil_ketua"
                                                        className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]"
                                                    >
                                                        Jurusan Wakil Ketua
                                                    </Label>
                                                    <Input
                                                        id="jurusan_wakil_ketua"
                                                        name="jurusan_wakil_ketua"
                                                        type="text"
                                                        value={formData.wakil_jurusan}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan jurusan wakil"
                                                        className="h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                                    />
                                                    <InputError message={errors.wakil_jurusan} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="foto_paslon" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
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
                                                        id="foto_paslon"
                                                        name="foto_paslon"
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                                        onChange={handleImageChange}
                                                        className="h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-lg cursor-pointer focus-visible:ring-0"
                                                    />
                                                    <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                                        Pilih file gambar (JPG, PNG, GIF, maksimal 2MB)
                                                    </p>
                                                </div>
                                            )}
                                            <InputError message={errors.foto_paslon} />
                                        </div>

                                        {/* <div className="space-y-2">
                                            <Label htmlFor="visi" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Visi
                                            </Label>
                                            <Textarea
                                                id="visi"
                                                name="visi"
                                                value={formData.visi}
                                                onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                                                placeholder="Masukkan visi paslon"
                                                rows={4}
                                                className="text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                            />
                                            <InputError message={errors.visi} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="misi" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Misi
                                            </Label>
                                            <Textarea
                                                id="misi"
                                                name="misi"
                                                value={formData.misi}
                                                onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                                                placeholder="Masukkan misi paslon"
                                                rows={4}
                                                className="text-sm sm:text-base md:text-lg focus-visible:ring-0"
                                            />
                                            <InputError message={errors.misi} />
                                        </div> */}
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

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm_password" className="text-base sm:text-lg md:text-xl font-semibold text-[#53589a]">
                                                Konfirmasi Password <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="confirm_password"
                                                name="confirm_password"
                                                type="password"
                                                value={formData.confirm_password}
                                                onChange={handleChange}
                                                placeholder="Konfirmasi password"
                                                required
                                                className={`h-10 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg focus-visible:ring-0 ${
                                                    formData.confirm_password.length === 0
                                                        ? "focus-visible:border-red-500"
                                                        : formData.password !== formData.confirm_password
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                            />
                                            <InputError message={errors.confirm_password} />
                                            {formData.confirm_password.length > 0 && formData.password !== formData.confirm_password && (
                                                <p className="text-xs sm:text-sm md:text-base text-red-500">
                                                    Password dan konfirmasi password tidak sama
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

