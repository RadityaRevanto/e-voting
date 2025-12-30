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
    async (nik: string, expirationMinutes: number = 10): Promise<void> => {
      // Validasi NIK
      if (typeof nik !== 'string' || !nik.trim()) {
        setError("NIK KTP harus diisi");
        return;
      }

      const trimmedNik = nik.trim();
      if (trimmedNik.length !== 16 || !/^\d+$/.test(trimmedNik)) {
        setError("NIK KTP harus terdiri dari 16 digit angka");
        return;
      }

      // Validasi expiration minutes sesuai backend (min: 5, max: 1440)
      if (typeof expirationMinutes !== 'number' || !Number.isInteger(expirationMinutes) || expirationMinutes < 5 || expirationMinutes > 1440) {
        setError("Expiration minutes harus antara 5 sampai 1440 menit");
        return;
      }

      setLoading(true);
      setError(null);
      setQrCodeData(null);

      try {
        const response = await apiClient.post("/api/admin/qr-codes/generate", {
          warga_nik: trimmedNik,
          expiration_minutes: expirationMinutes,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          const errorMessage = typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : "Gagal generate QR code";
          throw new Error(errorMessage);
        }

        // Validasi response data structure
        if (!data.data || typeof data.data !== 'object') {
          throw new Error("Data QR code tidak ditemukan");
        }

        const qrData = data.data as QRCodeData;
        
        // Validasi runtime untuk memastikan data QR code valid
        if (
          typeof qrData.token !== 'string' ||
          typeof qrData.qr_code_content !== 'string' ||
          typeof qrData.qr_code_id !== 'number' ||
          typeof qrData.expires_at !== 'string' ||
          typeof qrData.warga_nik !== 'string'
        ) {
          throw new Error("Format data QR code tidak valid");
        }

        setQrCodeData(qrData);
      } catch (err: unknown) {
        console.error("Error generating QR code:", err);
        const errorMessage = err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat generate QR code";
        
        setError(errorMessage);
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

