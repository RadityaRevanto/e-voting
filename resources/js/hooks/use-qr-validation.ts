import { useState, useCallback, useRef, useEffect } from 'react';
import {
  validateQrCode,
  QrValidationResult,
  QrValidationError,
} from '../lib/qr-validation-service';

/**
 * Status validasi QR Code
 */
export type QrValidationStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Return type dari hook useQrValidation
 */
export interface UseQrValidationResult {
  /**
   * Status validasi saat ini
   */
  status: QrValidationStatus;

  /**
   * Hasil validasi jika berhasil (hanya tersedia saat status = 'success')
   */
  validationResult: QrValidationResult | null;

  /**
   * Pesan error jika validasi gagal (hanya tersedia saat status = 'error')
   */
  errorMessage: string | null;

  /**
   * Flag untuk menonaktifkan scanner (true saat loading atau success)
   */
  isScannerDisabled: boolean;

  /**
   * Flag untuk menandakan apakah QR code sudah divalidasi dengan sukses
   */
  isValidated: boolean;

  /**
   * Handler untuk memproses hasil scan QR Code
   * Akan memvalidasi QR code ke backend secara otomatis
   * 
   * @param qrCodeContent Konten QR Code yang di-scan
   * @returns Promise yang resolve dengan hasil validasi atau reject dengan error
   */
  handleScan: (qrCodeContent: string) => Promise<QrValidationResult>;

  /**
   * Reset state validasi ke kondisi awal (idle)
   * Berguna untuk mengizinkan scan ulang setelah error
   */
  reset: () => void;
}

/**
 * Custom hook untuk validasi QR Code
 * 
 * Hook ini menangani:
 * - State management untuk validasi QR Code
 * - Validasi ke backend melalui service layer
 * - Mencegah double scan dan race condition
 * - Cleanup state saat component unmount
 * 
 * @returns Object berisi state dan handler untuk validasi QR Code
 * 
 * @example
 * ```tsx
 * const {
 *   status,
 *   validationResult,
 *   errorMessage,
 *   isScannerDisabled,
 *   isValidated,
 *   handleScan,
 *   reset,
 * } = useQrValidation();
 * 
 * // Di handler scan dari komponen scanner
 * const onScanSuccess = useCallback((decodedText: string) => {
 *   handleScan(decodedText)
 *     .then((result) => {
 *       console.log('QR Code valid:', result);
 *     })
 *     .catch((error) => {
 *       console.error('Validasi gagal:', error);
 *     });
 * }, [handleScan]);
 * ```
 */
export function useQrValidation(): UseQrValidationResult {
  // State management
  const [status, setStatus] = useState<QrValidationStatus>('idle');
  const [validationResult, setValidationResult] = useState<QrValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref untuk mencegah race condition dan update state setelah unmount
  const isMountedRef = useRef<boolean>(true);
  const isValidatingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup saat component unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      
      // Cancel ongoing request jika ada
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // Reset flag
      isValidatingRef.current = false;
    };
  }, []);

  /**
   * Handler untuk memproses hasil scan QR Code
   * Mencegah double scan dengan guard menggunakan ref
   */
  const handleScan = useCallback(
    async (qrCodeContent: string): Promise<QrValidationResult> => {
      // Guard: Cegah double scan
      if (isValidatingRef.current) {
        throw new QrValidationError(
          'Validasi sedang berlangsung. Harap tunggu.',
          'ALREADY_VALIDATING'
        );
      }

      // Guard: Jika sudah berhasil divalidasi, tolak scan ulang
      if (status === 'success' && validationResult !== null) {
        throw new QrValidationError(
          'QR code sudah divalidasi. Gunakan reset() untuk scan ulang.',
          'ALREADY_VALIDATED'
        );
      }

      // Validasi input: QR code content tidak boleh kosong
      if (!qrCodeContent || typeof qrCodeContent !== 'string' || qrCodeContent.trim().length === 0) {
        const error = new QrValidationError(
          'QR code tidak boleh kosong',
          'EMPTY_QR_CODE'
        );
        
        if (isMountedRef.current) {
          setStatus('error');
          setErrorMessage(error.message);
          setValidationResult(null);
        }
        
        throw error;
      }

      // Set flag untuk mencegah double scan
      isValidatingRef.current = true;

      // Buat AbortController untuk cancel request jika perlu
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Update state ke loading
      if (isMountedRef.current) {
        setStatus('loading');
        setErrorMessage(null);
        setValidationResult(null);
      }

      try {
        // Validasi QR code ke backend
        const result = await validateQrCode(qrCodeContent);

        // Guard: Cek apakah component masih mounted dan request belum di-cancel
        if (!isMountedRef.current || abortController.signal.aborted) {
          // Component sudah unmount atau request di-cancel, jangan update state
          throw new QrValidationError(
            'Validasi dibatalkan',
            'CANCELLED'
          );
        }

        // Guard: Cek apakah masih dalam proses validasi (tidak ada double scan)
        if (!isValidatingRef.current) {
          throw new QrValidationError(
            'Validasi dibatalkan',
            'CANCELLED'
          );
        }

        // Update state ke success
        if (isMountedRef.current) {
          setStatus('success');
          setValidationResult(result);
          setErrorMessage(null);
        }

        return result;
      } catch (error) {
        // Guard: Jangan update state jika component sudah unmount atau request di-cancel
        if (!isMountedRef.current || abortController.signal.aborted) {
          throw error;
        }

        // Handle error
        let finalError: QrValidationError;

        if (error instanceof QrValidationError) {
          finalError = error;
        } else {
          // Error yang tidak diketahui
          finalError = new QrValidationError(
            'Terjadi kesalahan saat memvalidasi QR code',
            'UNKNOWN_ERROR',
            error
          );
        }

        // Update state ke error
        if (isMountedRef.current) {
          setStatus('error');
          setErrorMessage(finalError.message);
          setValidationResult(null);
        }

        throw finalError;
      } finally {
        // Reset flag setelah selesai (hanya jika masih mounted)
        if (isMountedRef.current) {
          isValidatingRef.current = false;
          abortControllerRef.current = null;
        }
      }
    },
    [status, validationResult]
  );

  /**
   * Reset state validasi ke kondisi awal
   * Berguna untuk mengizinkan scan ulang setelah error
   */
  const reset = useCallback(() => {
    // Guard: Jangan reset jika component sudah unmount
    if (!isMountedRef.current) {
      return;
    }

    // Cancel ongoing request jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset flags
    isValidatingRef.current = false;

    // Reset state
    setStatus('idle');
    setValidationResult(null);
    setErrorMessage(null);
  }, []);

  // Computed values
  const isScannerDisabled = status === 'loading' || status === 'success';
  const isValidated = status === 'success' && validationResult !== null;

  return {
    status,
    validationResult,
    errorMessage,
    isScannerDisabled,
    isValidated,
    handleScan,
    reset,
  };
}

