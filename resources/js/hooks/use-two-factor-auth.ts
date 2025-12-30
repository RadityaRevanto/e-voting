import { qrCode, recoveryCodes, secretKey } from '@/routes/two-factor';
import { useCallback, useMemo, useState } from 'react';

interface TwoFactorSetupData {
    svg: string;
    url: string;
}

interface TwoFactorSecretKey {
    secretKey: string;
}

export const OTP_MAX_LENGTH = 6;

const fetchJson = async <T>(url: string): Promise<T> => {
    if (typeof url !== 'string' || !url.trim()) {
        throw new Error('URL tidak valid');
    }

    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        const statusText = response.statusText || `HTTP ${response.status}`;
        throw new Error(`Failed to fetch: ${statusText}`);
    }

    const data = await response.json();
    return data as T;
};

export const useTwoFactorAuth = () => {
    const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
    const [manualSetupKey, setManualSetupKey] = useState<string | null>(null);
    const [recoveryCodesList, setRecoveryCodesList] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const hasSetupData = useMemo<boolean>(
        () => qrCodeSvg !== null && manualSetupKey !== null,
        [qrCodeSvg, manualSetupKey],
    );

    const fetchQrCode = useCallback(async (): Promise<void> => {
        try {
            const data = await fetchJson<TwoFactorSetupData>(qrCode.url());
            
            // Validasi response structure
            if (!data || typeof data !== 'object' || typeof data.svg !== 'string' || !data.svg.trim()) {
                throw new Error('Format data QR code tidak valid');
            }
            
            setQrCodeSvg(data.svg);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to fetch QR code';
            setErrors((prev) => [...prev, errorMessage]);
            setQrCodeSvg(null);
        }
    }, []);

    const fetchSetupKey = useCallback(async (): Promise<void> => {
        try {
            const data = await fetchJson<TwoFactorSecretKey>(
                secretKey.url(),
            );
            
            // Validasi response structure
            if (!data || typeof data !== 'object' || typeof data.secretKey !== 'string' || !data.secretKey.trim()) {
                throw new Error('Format data secret key tidak valid');
            }
            
            setManualSetupKey(data.secretKey);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to fetch a setup key';
            setErrors((prev) => [...prev, errorMessage]);
            setManualSetupKey(null);
        }
    }, []);

    const clearErrors = useCallback((): void => {
        setErrors([]);
    }, []);

    const clearSetupData = useCallback((): void => {
        setManualSetupKey(null);
        setQrCodeSvg(null);
        clearErrors();
    }, [clearErrors]);

    const fetchRecoveryCodes = useCallback(async (): Promise<void> => {
        try {
            clearErrors();
            const codes = await fetchJson<string[]>(recoveryCodes.url());
            
            // Validasi response structure
            if (!Array.isArray(codes)) {
                throw new Error('Format data recovery codes tidak valid');
            }
            
            // Validasi setiap code dalam array
            const validCodes = codes.filter((code): code is string => {
                return typeof code === 'string' && code.trim().length > 0;
            });
            
            setRecoveryCodesList(validCodes);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to fetch recovery codes';
            setErrors((prev) => [...prev, errorMessage]);
            setRecoveryCodesList([]);
        }
    }, [clearErrors]);

    const fetchSetupData = useCallback(async (): Promise<void> => {
        try {
            clearErrors();
            await Promise.all([fetchQrCode(), fetchSetupKey()]);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : 'Failed to fetch setup data';
            setErrors((prev) => [...prev, errorMessage]);
            setQrCodeSvg(null);
            setManualSetupKey(null);
        }
    }, [clearErrors, fetchQrCode, fetchSetupKey]);

    return {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        hasSetupData,
        errors,
        clearErrors,
        clearSetupData,
        fetchQrCode,
        fetchSetupKey,
        fetchSetupData,
        fetchRecoveryCodes,
    };
};
