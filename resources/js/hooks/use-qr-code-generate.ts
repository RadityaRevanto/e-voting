import { useCallback, useState } from "react";
import { apiClient } from "../lib/api-client";

export interface QRCodeData {
  token: string;
  qr_code_content: string;
  qr_code_id: number;
  expires_at: string;
  warga_nik: string;
}

interface UseQRCodeGenerateResult {
  // State
  qrCodeData: QRCodeData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  generateQRCode: (nik: string, expirationMinutes?: number) => Promise<void>;
  reset: () => void;
}

export function useQRCodeGenerate(): UseQRCodeGenerateResult {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = useCallback(
    async (nik: string, expirationMinutes: number = 10) => {
      // Validasi NIK
      if (!nik) {
        setError("NIK KTP harus diisi");
        return;
      }

      if (nik.length !== 16) {
        setError("NIK KTP harus terdiri dari 16 digit");
        return;
      }

      // Validasi expiration minutes sesuai backend (min: 5, max: 1440)
      if (expirationMinutes < 5 || expirationMinutes > 1440) {
        setError("Expiration minutes harus antara 5 sampai 1440 menit");
        return;
      }

      setLoading(true);
      setError(null);
      setQrCodeData(null);

      try {
        const response = await apiClient.post("/api/admin/qr-codes/generate", {
          warga_nik: nik,
          expiration_minutes: expirationMinutes,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal generate QR code");
        }

        if (data.data) {
          setQrCodeData(data.data);
        } else {
          throw new Error("Data QR code tidak ditemukan");
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat generate QR code"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setQrCodeData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    qrCodeData,
    loading,
    error,
    generateQRCode,
    reset,
  };
}

