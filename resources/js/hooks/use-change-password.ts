import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

interface ChangePasswordErrors {
    old_password?: string;
    password?: string;
    confirm_password?: string;
    message?: string;
}

interface ChangePasswordData {
    old_password: string;
    password: string;
    confirm_password: string;
}

interface UseChangePasswordResult {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
    errors: ChangePasswordErrors;
    success: string;
    processing: boolean;
    setCurrentPassword: (value: string) => void;
    setPassword: (value: string) => void;
    setPasswordConfirmation: (value: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    reset: () => void;
}

/**
 * Hook untuk menangani perubahan password
 * @returns Object berisi state dan fungsi untuk change password
 */
export function useChangePassword(): UseChangePasswordResult {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<ChangePasswordErrors>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);

    const reset = useCallback(() => {
        setCurrentPassword("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});
        setSuccess("");
        setProcessing(false);
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
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
                    confirm_password: "Konfirmasi password tidak cocok",
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
                const response = await apiClient.post(
                    "/api/auth/change-password",
                    {
                        old_password: currentPassword,
                        password: password,
                        confirm_password: passwordConfirmation,
                    } as ChangePasswordData
                );

                const data = await response.json();

                if (!response.ok) {
                    // Handle error response dari backend
                    if (data.errors) {
                        // Jika ada validation errors dari Laravel
                        const formattedErrors: ChangePasswordErrors = {};
                        if (data.errors.old_password) {
                            formattedErrors.old_password = Array.isArray(data.errors.old_password)
                                ? data.errors.old_password[0]
                                : data.errors.old_password;
                        }
                        if (data.errors.password) {
                            formattedErrors.password = Array.isArray(data.errors.password)
                                ? data.errors.password[0]
                                : data.errors.password;
                        }
                        if (data.errors.confirm_password) {
                            formattedErrors.confirm_password = Array.isArray(data.errors.confirm_password)
                                ? data.errors.confirm_password[0]
                                : data.errors.confirm_password;
                        }
                        setErrors(formattedErrors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({
                            message: "Terjadi kesalahan saat mengubah password",
                        });
                    }
                    setProcessing(false);
                    return;
                }

                // Success response
                if (data.success) {
                    setSuccess(data.message || "Password berhasil diubah!");
                    setCurrentPassword("");
                    setPassword("");
                    setPasswordConfirmation("");
                    setErrors({});

                    // Reset success message setelah 5 detik
                    setTimeout(() => {
                        setSuccess("");
                    }, 5000);
                } else {
                    setErrors({
                        message: data.message || "Terjadi kesalahan saat mengubah password",
                    });
                }
            } catch (error) {
                console.error("Error changing password:", error);
                setErrors({
                    message:
                        "Terjadi kesalahan saat mengubah password. Silakan coba lagi.",
                });
            } finally {
                setProcessing(false);
            }
        },
        [currentPassword, password, passwordConfirmation]
    );

    return {
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
        reset,
    };
}

