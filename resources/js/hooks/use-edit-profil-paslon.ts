import { useState, useRef, ChangeEvent, useEffect, FormEvent } from "react";
import { apiClient } from "@/lib/api-client";

export interface PaslonEditProfilErrors {
    username?: string;
    nama_ketua?: string;
    umur_ketua?: string;
    jurusan_ketua?: string;
    nama_wakil_ketua?: string;
    umur_wakil_ketua?: string;
    jurusan_wakil_ketua?: string;
    foto_paslon?: string;
    message?: string;
}

export interface UseEditProfilPaslonResult {
    // State
    username: string;
    namaKetua: string;
    umurKetua: string;
    jurusanKetua: string;
    namaWakil: string;
    umurWakil: string;
    jurusanWakil: string;
    fotoProfil: File | null;
    previewFoto: string | null;
    existingFotoUrl: string | null;
    errors: PaslonEditProfilErrors;
    success: string;
    processing: boolean;
    loading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;

    // Setters
    setUsername: (value: string) => void;
    setNamaKetua: (value: string) => void;
    setUmurKetua: (value: string) => void;
    setJurusanKetua: (value: string) => void;
    setNamaWakil: (value: string) => void;
    setUmurWakil: (value: string) => void;
    setJurusanWakil: (value: string) => void;

    // Handlers
    handleFotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleHapusFoto: () => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useEditProfilPaslon(): UseEditProfilPaslonResult {
    const [username, setUsername] = useState("");
    const [namaKetua, setNamaKetua] = useState("");
    const [umurKetua, setUmurKetua] = useState("");
    const [jurusanKetua, setJurusanKetua] = useState("");
    const [namaWakil, setNamaWakil] = useState("");
    const [umurWakil, setUmurWakil] = useState("");
    const [jurusanWakil, setJurusanWakil] = useState("");
    const [fotoProfil, setFotoProfil] = useState<File | null>(null);
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);
    const [existingFotoUrl, setExistingFotoUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<PaslonEditProfilErrors>({});
    const [success, setSuccess] = useState("");
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran file (maksimal 2MB sesuai backend)
        if (file.size > 2 * 1024 * 1024) {
            setErrors({
                foto_paslon: "Ukuran file maksimal 2MB",
            });
            return;
        }

        // Validasi tipe file
        if (!file.type.startsWith("image/")) {
            setErrors({
                foto_paslon: "File harus berupa gambar",
            });
            return;
        }

        setFotoProfil(file);
        setErrors((prev) => ({ ...prev, foto_paslon: undefined }));

        // Buat preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewFoto(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleHapusFoto = () => {
        setFotoProfil(null);
        setPreviewFoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Fetch data paslon saat component mount
    useEffect(() => {
        const fetchPaslonData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/api/paslon/profile");

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = typeof errorData === 'object' && errorData !== null && 'message' in errorData
                        ? String(errorData.message)
                        : "Gagal mengambil data profil";
                    setErrors({ message: errorMessage });
                    setLoading(false);
                    return;
                }

                const data = await response.json();

                if (data.success && data.data) {
                    const paslon = data.data;
                    setUsername(paslon.username || "");
                    setNamaKetua(paslon.nama_ketua || "");
                    setUmurKetua(paslon.umur_ketua?.toString() || "");
                    setJurusanKetua(paslon.jurusan_ketua || "");
                    setNamaWakil(paslon.nama_wakil_ketua || "");
                    setUmurWakil(paslon.umur_wakil_ketua?.toString() || "");
                    setJurusanWakil(paslon.jurusan_wakil_ketua || "");
                    
                    if (paslon.foto_paslon) {
                        setExistingFotoUrl(paslon.foto_paslon);
                    }
                }
            } catch (error) {
                console.error("Error fetching paslon data:", error);
                setErrors({
                    message: "Terjadi kesalahan saat mengambil data profil. Silakan coba lagi.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPaslonData();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setSuccess("");
        setProcessing(true);

        // Validasi client-side
        if (!namaKetua || !namaWakil) {
            setErrors({
                message: "Nama ketua dan nama wakil harus diisi",
            });
            setProcessing(false);
            return;
        }

        // Validasi umur ketua
        if (umurKetua) {
            const umurKetuaNum = parseInt(umurKetua);
            if (isNaN(umurKetuaNum) || umurKetuaNum < 1 || umurKetuaNum > 100) {
                setErrors({
                    umur_ketua: "Umur ketua harus berupa angka antara 1-100",
                });
                setProcessing(false);
                return;
            }
        }

        // Validasi umur wakil
        if (umurWakil) {
            const umurWakilNum = parseInt(umurWakil);
            if (isNaN(umurWakilNum) || umurWakilNum < 1 || umurWakilNum > 100) {
                setErrors({
                    umur_wakil_ketua: "Umur wakil harus berupa angka antara 1-100",
                });
                setProcessing(false);
                return;
            }
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content") || "";

            // Jika ada foto profil, gunakan FormData, jika tidak gunakan JSON
            if (fotoProfil) {
                const formData = new FormData();
                if (username) formData.append("username", username);
                if (namaKetua) formData.append("nama_ketua", namaKetua);
                if (umurKetua) formData.append("umur_ketua", umurKetua);
                if (jurusanKetua) formData.append("jurusan_ketua", jurusanKetua);
                if (namaWakil) formData.append("nama_wakil_ketua", namaWakil);
                if (umurWakil) formData.append("umur_wakil_ketua", umurWakil);
                if (jurusanWakil) formData.append("jurusan_wakil_ketua", jurusanWakil);
                formData.append("foto_paslon", fotoProfil);

                const response = await apiClient.post("/api/paslon/profile/edit", formData, {
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Accept": "application/json",
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({ message: "Terjadi kesalahan saat mengubah profil" });
                    }
                    setProcessing(false);
                    return;
                }
            } else {
                const response = await apiClient.post(
                    "/api/paslon/profile/edit",
                    {
                        username: username || undefined,
                        nama_ketua: namaKetua || undefined,
                        umur_ketua: umurKetua ? parseInt(umurKetua) : undefined,
                        jurusan_ketua: jurusanKetua || undefined,
                        nama_wakil_ketua: namaWakil || undefined,
                        umur_wakil_ketua: umurWakil ? parseInt(umurWakil) : undefined,
                        jurusan_wakil_ketua: jurusanWakil || undefined,
                    },
                    {
                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                            "Accept": "application/json",
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (data.errors) {
                        setErrors(data.errors);
                    } else if (data.message) {
                        setErrors({ message: data.message });
                    } else {
                        setErrors({ message: "Terjadi kesalahan saat mengubah profil" });
                    }
                    setProcessing(false);
                    return;
                }
            }

            setSuccess("Profil berhasil diubah!");
            setErrors({});
            setFotoProfil(null);
            setPreviewFoto(null);

            // Refresh data paslon untuk mendapatkan foto yang baru
            try {
                const refreshResponse = await apiClient.get("/api/paslon/profile");
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    if (refreshData.success && refreshData.data?.foto_paslon) {
                        setExistingFotoUrl(refreshData.data.foto_paslon);
                    }
                }
            } catch (error) {
                console.error("Error refreshing paslon data:", error);
            }

            // Reset success message setelah 5 detik
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
        }
    };

    return {
        // State
        username,
        namaKetua,
        umurKetua,
        jurusanKetua,
        namaWakil,
        umurWakil,
        jurusanWakil,
        fotoProfil,
        previewFoto,
        existingFotoUrl,
        errors,
        success,
        processing,
        loading,
        fileInputRef,

        // Setters
        setUsername,
        setNamaKetua,
        setUmurKetua,
        setJurusanKetua,
        setNamaWakil,
        setUmurWakil,
        setJurusanWakil,

        // Handlers
        handleFotoChange,
        handleHapusFoto,
        handleSubmit,
    };
}

