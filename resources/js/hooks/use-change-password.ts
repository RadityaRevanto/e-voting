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
        async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            setErrors({});
            setSuccess("");
            setProcessing(true);

            // Validasi client-side dengan type checking
            const trimmedCurrentPassword = typeof currentPassword === 'string' ? currentPassword.trim() : '';
            const trimmedPassword = typeof password === 'string' ? password.trim() : '';
            const trimmedPasswordConfirmation = typeof passwordConfirmation === 'string' ? passwordConfirmation.trim() : '';

            if (!trimmedCurrentPassword || !trimmedPassword || !trimmedPasswordConfirmation) {
                setErrors({
                    message: "Semua field harus diisi",
                });
                setProcessing(false);
                return;
            }

            if (trimmedPassword !== trimmedPasswordConfirmation) {
                setErrors({
                    confirm_password: "Konfirmasi password tidak cocok",
                });
                setProcessing(false);
                return;
            }

            if (trimmedPassword.length < 8) {
                setErrors({
                    password: "Password minimal 8 karakter",
                });
                setProcessing(false);
                return;
            }

            try {
                const requestData: ChangePasswordData = {
                    old_password: trimmedCurrentPassword,
                    password: trimmedPassword,
                    confirm_password: trimmedPasswordConfirmation,
                };

                const response = await apiClient.post(
                    "/api/auth/change-password",
                    requestData
                );

                const data = await response.json();

                if (!response.ok) {
                    // Handle error response dari backend
                    if (data && typeof data === 'object' && 'errors' in data && data.errors && typeof data.errors === 'object') {
                        // Jika ada validation errors dari Laravel
                        const formattedErrors: ChangePasswordErrors = {};
                        const errors = data.errors as Record<string, unknown>;
                        
                        if (errors.old_password) {
                            formattedErrors.old_password = Array.isArray(errors.old_password)
                                ? String(errors.old_password[0])
                                : String(errors.old_password);
                        }
                        if (errors.password) {
                            formattedErrors.password = Array.isArray(errors.password)
                                ? String(errors.password[0])
                                : String(errors.password);
                        }
                        if (errors.confirm_password) {
                            formattedErrors.confirm_password = Array.isArray(errors.confirm_password)
                                ? String(errors.confirm_password[0])
                                : String(errors.confirm_password);
                        }
                        setErrors(formattedErrors);
                    } else if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
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
                if (data && typeof data === 'object' && data.success === true) {
                    const successMessage = typeof data.message === 'string' 
                        ? data.message 
                        : "Password berhasil diubah!";
                    
                    setSuccess(successMessage);
                    setCurrentPassword("");
                    setPassword("");
                    setPasswordConfirmation("");
                    setErrors({});

                    // Reset success message setelah 5 detik
                    setTimeout(() => {
                        setSuccess("");
                    }, 5000);
                } else {
                    const errorMessage = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
                        ? data.message
                        : "Terjadi kesalahan saat mengubah password";
                    
                    setErrors({
                        message: errorMessage,
                    });
                }
            } catch (error: unknown) {
                console.error("Error changing password:", error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengubah password. Silakan coba lagi.";
                
                setErrors({
                    message: errorMessage,
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

