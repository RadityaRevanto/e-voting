import { apiClient } from './api-client';

/**
 * Response data dari API validasi QR Code
 */
export interface QrValidationResponseData {
  valid: boolean;
  token: string;
  warga_nik: string;
  expires_at: string;
}

/**
 * Response dari API validasi QR Code
 */
interface QrValidationApiResponse {
  success: boolean;
  message: string;
  data: QrValidationResponseData;
}

/**
 * Hasil validasi QR Code yang sudah dinormalisasi
 */
export interface QrValidationResult {
  valid: boolean;
  token: string;
  wargaNik: string;
  expiresAt: string;
  message: string;
}

/**
 * Error yang terjadi saat validasi QR Code
 */
export class QrValidationError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'QrValidationError';
  }
}

/**
 * Service untuk validasi QR Code ke backend
 * 
 * @param qrCodeContent Konten QR Code yang akan divalidasi
 * @returns Promise yang resolve dengan hasil validasi
 * @throws QrValidationError jika validasi gagal
 */
export const validateQrCode = async (
  qrCodeContent: string
): Promise<QrValidationResult> => {
  // Validasi input: QR code content tidak boleh kosong
  if (!qrCodeContent || typeof qrCodeContent !== 'string' || qrCodeContent.trim().length === 0) {
    throw new QrValidationError('QR code tidak boleh kosong', 'EMPTY_QR_CODE');
  }

  try {
    const response = await apiClient.post('/api/voter/qr-codes/validate', {
      qr_code_content: qrCodeContent.trim(),
    });

    // Handle HTTP error status
    if (!response.ok) {
      let errorMessage = 'Gagal memvalidasi QR code';
      
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          errorMessage = String(errorData.message);
        }
      } catch {
        // Jika parsing JSON gagal, gunakan default message
        errorMessage = `Gagal memvalidasi QR code (${response.status})`;
      }

      throw new QrValidationError(
        errorMessage,
        `HTTP_${response.status}`,
        { status: response.status }
      );
    }

    // Parse response
    const data: QrValidationApiResponse = await response.json();

    // Validasi struktur response
    if (!data || typeof data !== 'object') {
      throw new QrValidationError(
        'Format response tidak valid',
        'INVALID_RESPONSE_FORMAT'
      );
    }

    // Jika API mengembalikan success: false
    if (!data.success) {
      const errorMessage = data.message || 'QR code tidak valid';
      throw new QrValidationError(errorMessage, 'VALIDATION_FAILED');
    }

    // Validasi struktur data
    if (!data.data || typeof data.data !== 'object') {
      throw new QrValidationError(
        'Data validasi tidak ditemukan',
        'MISSING_VALIDATION_DATA'
      );
    }

    const validationData = data.data;

    // Validasi field-field yang diperlukan
    if (typeof validationData.valid !== 'boolean') {
      throw new QrValidationError(
        'Status validasi tidak valid',
        'INVALID_VALIDATION_STATUS'
      );
    }

    // Jika QR code tidak valid, throw error dengan message dari backend
    if (!validationData.valid) {
      throw new QrValidationError(
        data.message || 'QR code tidak valid',
        'QR_CODE_INVALID'
      );
    }

    // Validasi field-field yang diperlukan untuk QR code yang valid
    if (!validationData.token || typeof validationData.token !== 'string') {
      throw new QrValidationError(
        'Token tidak ditemukan dalam response',
        'MISSING_TOKEN'
      );
    }

    if (!validationData.warga_nik || typeof validationData.warga_nik !== 'string') {
      throw new QrValidationError(
        'NIK tidak ditemukan dalam response',
        'MISSING_WARGA_NIK'
      );
    }

    if (!validationData.expires_at || typeof validationData.expires_at !== 'string') {
      throw new QrValidationError(
        'Tanggal kadaluarsa tidak ditemukan dalam response',
        'MISSING_EXPIRES_AT'
      );
    }

    // Return hasil validasi yang sudah dinormalisasi
    return {
      valid: validationData.valid,
      token: validationData.token,
      wargaNik: validationData.warga_nik,
      expiresAt: validationData.expires_at,
      message: data.message || 'QR code valid',
    };
  } catch (error) {
    // Jika error sudah berupa QrValidationError, throw langsung
    if (error instanceof QrValidationError) {
      throw error;
    }

    // Handle network error atau error lainnya
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new QrValidationError(
        'Gagal terhubung ke server. Periksa koneksi internet Anda.',
        'NETWORK_ERROR',
        error
      );
    }

    // Handle error yang tidak diketahui
    const errorMessage = error instanceof Error
      ? error.message
      : 'Terjadi kesalahan saat memvalidasi QR code';

    throw new QrValidationError(
      errorMessage,
      'UNKNOWN_ERROR',
      error
    );
  }
};

