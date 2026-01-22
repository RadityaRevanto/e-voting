import PaslonLayout from "../../../_components/paslonlayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/pages/dashboard/_components/input-error";
import { useChangePassword } from "@/hooks/use-change-password";

export default function PaslonChangePasswordPage() {
    const {
        currentPassword,
        password,
        passwordConfirmation,
        errors,
        success,
        processing,
        setCurrentPassword,
        setPassword,
        setPasswordConfirmation,
        handleSubmit,
    } = useChangePassword();

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
                                aria-invalid={errors.old_password ? "true" : "false"}
                            />
                            <InputError message={errors.old_password} />
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
                                aria-invalid={errors.confirm_password ? "true" : "false"}
                            />
                            <InputError message={errors.confirm_password} />
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