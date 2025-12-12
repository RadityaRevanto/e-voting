import PaslonLayout from "../../../_components/paslonlayout";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";

export default function PaslonChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<{
        current_password?: string;
        password?: string;
        password_confirmation?: string;
        message?: string;
    }>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");
        setProcessing(true);

        // Validasi client-side
        if (!currentPassword || !password || !passwordConfirmation) {
            setErrors({
                message: "Semua field harus diisi",
            });
            setProcessing(false);
            return;
        }

        if (password !== passwordConfirmation) {
            setErrors({
                password_confirmation: "Konfirmasi password tidak cocok",
            });
            setProcessing(false);
            return;
        }

        if (password.length < 8) {
            setErrors({
                password: "Password minimal 8 karakter",
            });
            setProcessing(false);
            return;
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "";

            const response = await fetch("/settings/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else if (data.message) {
                    setErrors({ message: data.message });
                } else {
                    setErrors({ message: "Terjadi kesalahan saat mengubah password" });
                }
                setProcessing(false);
                return;
            }

            setSuccess("Password berhasil diubah!");
            setCurrentPassword("");
            setPassword("");
            setPasswordConfirmation("");
            setErrors({});

            // Reset success message setelah 5 detik
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (error) {
            console.error("Error changing password:", error);
            setErrors({
                message: "Terjadi kesalahan saat mengubah password. Silakan coba lagi.",
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
                            CHANGE PASSWORD
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

                        <div className="space-y-2">
                            <label
                                htmlFor="current_password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password Saat Ini
                            </label>
                            <Input
                                id="current_password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                aria-invalid={errors.current_password ? "true" : "false"}
                            />
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password Baru
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            <InputError message={errors.password} />
                            <p className="text-xs text-gray-500">
                                Minimal 8 karakter
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Konfirmasi Password Baru
                            </label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full"
                                disabled={processing}
                                aria-invalid={errors.password_confirmation ? "true" : "false"}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#53589a] hover:bg-[#43477a] text-white rounded-full font-semibold"
                            >
                                {processing ? "Menyimpan..." : "Ubah Password"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </PaslonLayout>
    );
}