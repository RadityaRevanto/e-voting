import { useState, useRef, ChangeEvent, FormEvent, useCallback, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useInitials } from "@/hooks/use-initials";

export interface AdminEditProfilErrors {
    username?: string;
    foto_path?: string;
    message?: string;
}

export interface UseEditProfilAdminResult {
    username: string;
    fotoProfil: File | null;
    previewFoto: string | null;
    existingFotoUrl: string | null;
    errors: AdminEditProfilErrors;
    success: string;
    processing: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    setUsername: (value: string) => void;
    handleFotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleHapusFoto: () => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
    getAvatarInitials: () => string;
}

/**
 * Custom hook untuk menangani logic edit profil admin
 */
export function useEditProfilAdmin(): UseEditProfilAdminResult {
    const [username, setUsername] = useState("");
    const [fotoProfil, setFotoProfil] = useState<File | null>(null);
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);
    const [existingFotoUrl, setExistingFotoUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<AdminEditProfilErrors>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const getInitials = useInitials();
    const isSubmittingRef = useRef(false);

    const getAvatarInitials = useCallback((): string => {
        if (!username?.trim()) {
            return "";
        }
        return getInitials(username);
    }, [username, getInitials]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await apiClient.get("/api/admin/profile");

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage =
                        typeof errorData === "object" &&
                        errorData !== null &&
                        "message" in errorData
                            ? String(errorData.message)
                            : "Gagal mengambil data profil";
                    setErrors({ message: errorMessage });
                    return;
                }

                const data = await response.json();

                if (data.success && data.data) {
                    const admin = data.data;
                    setUsername(admin.username || "");

                    if (admin.foto_admin) {
                        setExistingFotoUrl(admin.foto_admin);
                        setPreviewFoto(`/storage/${admin.foto_admin}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
                setErrors({
                    message: "Terjadi kesalahan saat mengambil data profil. Silakan coba lagi.",
                });
            }
        };

        fetchAdminData();
    }, []);

    const handleFotoChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>): void => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                setErrors({ foto_path: "File melebihi batas upload" });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            const fileExtension = file.name.toLowerCase().split(".").pop();
            const allowedExtensions = ["jpg", "jpeg", "png"];

            const isValidType = allowedTypes.includes(file.type);
            const isValidExtension = allowedExtensions.includes(fileExtension || "");

            if (!isValidType && !isValidExtension) {
                setErrors({
                    foto_path: "File harus berupa gambar dengan format JPG atau PNG",
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            setFotoProfil(file);
            setErrors((prev) => ({ ...prev, foto_path: undefined }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        },
        []
    );

    const handleHapusFoto = useCallback((): void => {
        setFotoProfil(null);

        if (previewFoto?.startsWith("data:")) {
            setPreviewFoto(null);
        } else if (existingFotoUrl) {
            setPreviewFoto(`/storage/${existingFotoUrl}`);
        } else {
            setPreviewFoto(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.foto_path;
            return newErrors;
        });
    }, [previewFoto, existingFotoUrl]);

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();

            if (isSubmittingRef.current || processing) {
                return;
            }

            setErrors({});
            setSuccess("");
            setProcessing(true);
            isSubmittingRef.current = true;

            try {
                if (!username.trim()) {
                    setErrors({ username: "Username harus diisi" });
                    setProcessing(false);
                    isSubmittingRef.current = false;
                    return;
                }

                const csrfToken =
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "";

                const handleError = (data: any) => {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({
                            message: "Terjadi kesalahan saat mengubah profil",
                        });
                    }
                    setProcessing(false);
                    isSubmittingRef.current = false;
                };

                if (fotoProfil) {
                    const formData = new FormData();
                    formData.append("username", username.trim());
                    formData.append("foto_path", fotoProfil);

                    const response = await apiClient.post(
                        "/api/admin/profile/edit",
                        formData,
                        {
                            headers: {
                                "X-CSRF-TOKEN": csrfToken,
                                Accept: "application/json",
                            },
                        }
                    );

                    const data = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        handleError(data);
                        return;
                    }

                    if (data.success && data.data?.foto_admin) {
                        const fotoPath = data.data.foto_admin;
                        setExistingFotoUrl(fotoPath);
                        setPreviewFoto(`/storage/${fotoPath}`);
                        setFotoProfil(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                        }
                    }
                } else {
                    const response = await apiClient.post(
                        "/api/admin/profile/edit",
                        { username: username.trim() },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-TOKEN": csrfToken,
                                Accept: "application/json",
                            },
                        }
                    );

                    const data = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        handleError(data);
                        return;
                    }
                }

                setSuccess("Profil berhasil diubah!");
                setErrors({});

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
                isSubmittingRef.current = false;
            }
        },
        [username, fotoProfil]
    );

    const resetForm = useCallback((): void => {
        setUsername("");
        setFotoProfil(null);
        setPreviewFoto(null);
        setExistingFotoUrl(null);
        setErrors({});
        setSuccess("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    return {
        username,
        fotoProfil,
        previewFoto,
        existingFotoUrl,
        errors,
        success,
        processing,
        fileInputRef,
        setUsername,
        handleFotoChange,
        handleHapusFoto,
        handleSubmit,
        resetForm,
        getAvatarInitials,
    };
}