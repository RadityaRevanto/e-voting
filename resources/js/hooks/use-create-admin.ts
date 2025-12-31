import { useState, useCallback, useRef } from "react";
import { apiClient } from "@/lib/api-client";

/**
 * Interface untuk form data pembuatan akun admin
 */
interface CreateAdminFormData {
    username: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

/**
 * Interface untuk error response dari backend
 */
interface CreateAdminErrors {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
    message?: string;
}

/**
 * Interface untuk response API
 */
interface ApiResponse {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[] | string>;
}

/**
 * Interface untuk return value dari hook
 */
interface UseCreateAdminResult {
    formData: CreateAdminFormData;
    errors: CreateAdminErrors;
    success: string;
    processing: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
    togglePassword: () => void;
    toggleConfirmPassword: () => void;
}

/**
 * Custom hook untuk menangani logic pembuatan akun admin
 * 
 * @returns Object berisi state dan handler functions untuk form pembuatan akun admin
 * 
 * @example
 * ```tsx
 * const {
 *   formData,
 *   errors,
 *   success,
 *   processing,
 *   handleChange,
 *   handleSubmit,
 *   resetForm
 * } = useCreateAdmin();
 * ```
 */
export function useCreateAdmin(): UseCreateAdminResult {
    // State management
    const [formData, setFormData] = useState<CreateAdminFormData>({
        username: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState<CreateAdminErrors>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Ref untuk mencegah double submit
    const isSubmittingRef = useRef(false);

    /**
     * Handler untuk perubahan input field
     * Otomatis menghapus error pada field yang sedang diubah
     */
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const { name, value } = e.target;

            // Update form data
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Clear error pada field yang sedang diubah menggunakan functional update
            setErrors((prev) => {
                if (prev[name as keyof CreateAdminErrors]) {
                    const newErrors = { ...prev };
                    delete newErrors[name as keyof CreateAdminErrors];
                    return newErrors;
                }
                return prev;
            });

            // Clear success message saat user mulai mengetik menggunakan functional update
            setSuccess((prev) => (prev ? "" : prev));
        },
        []
    );

    /**
     * Handler untuk toggle visibility password
     */
    const togglePassword = useCallback((): void => {
        setShowPassword((prev) => !prev);
    }, []);

    /**
     * Handler untuk toggle visibility confirm password
     */
    const toggleConfirmPassword = useCallback((): void => {
        setShowConfirmPassword((prev) => !prev);
    }, []);

    /**
     * Reset form ke state awal
     */
    const resetForm = useCallback((): void => {
        setFormData({
            username: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        });
        setErrors({});
        setSuccess("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    }, []);

    /**
     * Handler untuk submit form
     * Melakukan validasi client-side dan mengirim request ke API
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();

            // Prevent double submit
            if (isSubmittingRef.current || processing) {
                return;
            }

            // Reset state
            setErrors({});
            setSuccess("");
            setProcessing(true);
            isSubmittingRef.current = true;

            try {
                // Client-side validation: password confirmation
                if (formData.password !== formData.password_confirmation) {
                    setErrors({
                        password_confirmation: "Password dan konfirmasi password tidak cocok",
                    });
                    setProcessing(false);
                    isSubmittingRef.current = false;
                    return;
                }

                // Prepare request payload
                const payload: CreateAdminFormData = {
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                };

                // Send request menggunakan apiClient (Authorization header & refresh token ditangani otomatis)
                const response = await apiClient.post("/api/admin/create", payload);

                // Parse response
                const data: ApiResponse = await response.json().catch(() => ({}));

                // Handle response berdasarkan status code
                if (response.status === 201 || response.status === 200) {
                    // Success
                    setSuccess("Akun admin berhasil dibuat!");
                    // Reset form data
                    setFormData({
                        username: "",
                        email: "",
                        phone: "",
                        password: "",
                        password_confirmation: "",
                    });
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                } else if (response.status === 422) {
                    // Validation errors dari Laravel
                    const formattedErrors: CreateAdminErrors = {};

                    if (data.errors && typeof data.errors === "object") {
                        // Laravel validation errors biasanya dalam format:
                        // { "field": ["error message"] } atau { "field": "error message" }
                        Object.keys(data.errors).forEach((key) => {
                            const errorValue = data.errors![key];
                            if (Array.isArray(errorValue) && errorValue.length > 0) {
                                formattedErrors[key as keyof CreateAdminErrors] = String(errorValue[0]);
                            } else if (typeof errorValue === "string") {
                                formattedErrors[key as keyof CreateAdminErrors] = errorValue;
                            }
                        });
                    }

                    // Jika tidak ada field-specific errors, gunakan message umum
                    if (Object.keys(formattedErrors).length === 0) {
                        formattedErrors.message =
                            typeof data.message === "string"
                                ? data.message
                                : "Validasi gagal. Silakan periksa kembali data yang Anda masukkan.";
                    }

                    setErrors(formattedErrors);
                } else if (response.status === 401) {
                    // Unauthorized - user tidak terautentikasi / token invalid
                    setErrors({
                        message: "Anda tidak memiliki akses untuk melakukan operasi ini.",
                    });
                } else if (response.status === 403) {
                    // Forbidden - user bukan super_admin
                    setErrors({
                        message: "Akses ditolak. Pastikan Anda memiliki izin yang diperlukan.",
                    });
                } else {
                    // Generic error untuk status code lainnya
                    setErrors({
                        message:
                            typeof data.message === "string"
                                ? data.message
                                : "Terjadi kesalahan saat membuat akun admin. Silakan coba lagi.",
                    });
                }
            } catch (error: unknown) {
                // Network error atau error lainnya
                console.error("Error creating admin:", error);

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan saat membuat akun admin. Silakan coba lagi.";

                setErrors({
                    message: errorMessage,
                });
            } finally {
                setProcessing(false);
                isSubmittingRef.current = false;
            }
        },
        [formData, processing]
    );

    return {
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
    };
}

