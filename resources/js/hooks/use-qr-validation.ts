import { useState, useCallback, useRef, useEffect } from 'react';
import {
  validateQrCode,
  QrValidationResult,
  QrValidationError,
} from '../lib/qr-validation-service';
import type { SessionStatus } from './use-vote-session';

export type QrValidationStatus = 'idle' | 'validating' | 'success' | 'error';

export interface UseQrValidationResult {
  status: QrValidationStatus;
  validationResult: QrValidationResult | null;
  errorMessage: string | null;
  isScannerDisabled: boolean;
  isValidated: boolean;
  handleScan: (qrCodeContent: string, currentSessionStatus: SessionStatus) => Promise<QrValidationResult>;
  reset: () => void;
}

export function useQrValidation(): UseQrValidationResult {
  const [status, setStatus] = useState<QrValidationStatus>('idle');
  const [validationResult, setValidationResult] = useState<QrValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleScan = useCallback(
    async (qrCodeContent: string, currentSessionStatus: SessionStatus): Promise<QrValidationResult> => {
      if (isValidatingRef.current) {
        throw new QrValidationError(
          'Validasi sedang berlangsung. Harap tunggu.',
          'ALREADY_VALIDATING'
        );
      }

      if (currentSessionStatus !== 'idle' && currentSessionStatus !== 'expired') {
        throw new QrValidationError(
          'Session sudah aktif. Reset session terlebih dahulu untuk scan ulang.',
          'SESSION_ACTIVE'
        );
      }

      if (status === 'success' && validationResult !== null) {
        throw new QrValidationError(
          'QR code sudah divalidasi. Gunakan reset() untuk scan ulang.',
          'ALREADY_VALIDATED'
        );
      }

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

      isValidatingRef.current = true;

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      if (isMountedRef.current) {
        setStatus('validating');
        setErrorMessage(null);
        setValidationResult(null);
      }

      try {
        const result = await validateQrCode(qrCodeContent);

        if (!isMountedRef.current || abortController.signal.aborted) {
          throw new QrValidationError(
            'Validasi dibatalkan',
            'CANCELLED'
          );
        }

        if (!isValidatingRef.current) {
          throw new QrValidationError(
            'Validasi dibatalkan',
            'CANCELLED'
          );
        }

        if (isMountedRef.current) {
          setStatus('success');
          setValidationResult(result);
          setErrorMessage(null);
        }

        return result;
      } catch (error) {
        if (!isMountedRef.current || abortController.signal.aborted) {
          throw error;
        }

        let finalError: QrValidationError;

        if (error instanceof QrValidationError) {
          finalError = error;
        } else {
          finalError = new QrValidationError(
            'Terjadi kesalahan saat memvalidasi QR code',
            'UNKNOWN_ERROR',
            error
          );
        }

        if (isMountedRef.current) {
          setStatus('error');
          setErrorMessage(finalError.message);
          setValidationResult(null);
        }

        throw finalError;
      } finally {
        if (isMountedRef.current) {
          isValidatingRef.current = false;
          abortControllerRef.current = null;
        }
      }
    },
    [status, validationResult]
  );

  const reset = useCallback(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    isValidatingRef.current = false;

    setStatus('idle');
    setValidationResult(null);
    setErrorMessage(null);
  }, []);
  
  const isScannerDisabled = status === 'validating' || status === 'success';
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

