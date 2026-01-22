import { useEffect } from "react";
import SuperadminLayout from "../../_components/superadminlayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InputError from "@/pages/dashboard/_components/input-error";
import { Head, router } from "@inertiajs/react";
import { AlertCircle, Eye, EyeOff, UserPlus } from "lucide-react";
import { useCreateAdmin } from "@/hooks/use-create-admin";

export default function AkunAdminPage() {
    const {
        formData,
        errors,
        success,
        processing,
        showPassword,
        showConfirmPassword,
        handleChange,
        handleSubmit,
        resetForm,
        togglePassword,
        toggleConfirmPassword,
    } = useCreateAdmin();

    // Optional: Reload halaman setelah 2 detik jika berhasil (behavior dari code sebelumnya)
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.reload();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <SuperadminLayout>
            <Head title="Buat Akun Admin" />
            <div className="bg-white w-full min-h-screen p-4 md:p-6 xl:p-8">
                <div className="w-full">
                    {/* Header */}
                    <header className="mb-6 md:mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <UserPlus className="h-8 w-8 text-[#53589a]" />
                            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#53589a]">
                                Buat Akun Admin
                            </h1>
                        </div>
                        <Separator className="bg-[#030303]" />
                    </header>

                    {/* Form Card */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl text-[#53589a]">
                                Form Pendaftaran Admin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Success Message */}
                                {success && (
                                    <Alert className="bg-green-50 border-green-200">
                                        <AlertCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            {success}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Error Message */}
                                {errors.message && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {errors.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Username */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="username"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Username <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        disabled={processing}
                                        placeholder="Masukkan username"
                                        className="w-full focus-visible:ring-0 focus-visible:border-red-500"
                                        aria-invalid={errors.username ? "true" : "false"}
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Akun (Email) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={processing}
                                        placeholder="Masukkan email"
                                        className="w-full focus-visible:ring-0 focus-visible:border-red-500"
                                        aria-invalid={errors.email ? "true" : "false"}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Nomor Telepon <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        disabled={processing}
                                        placeholder="Masukkan nomor telepon"
                                        className="w-full focus-visible:ring-0 focus-visible:border-red-500"
                                        aria-invalid={errors.phone ? "true" : "false"}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            placeholder="Masukkan password"
                                            className="w-full pr-10 focus-visible:ring-0 focus-visible:border-red-500"
                                            aria-invalid={errors.password ? "true" : "false"}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Konfirmasi Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            required
                                            disabled={processing}
                                            placeholder="Konfirmasi password"
                                            className="w-full pr-10 focus-visible:ring-0 focus-visible:border-red-500"
                                            aria-invalid={
                                                errors.password_confirmation ? "true" : "false"
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-[#53589a] hover:bg-[#434779] text-white"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Membuat akun...</span>
                                            </div>
                                        ) : (
                                            "Buat Akun Admin"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SuperadminLayout>
    );
}