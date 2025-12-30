import { useCallback } from 'react';

/**
 * Hook untuk menghasilkan inisial dari nama lengkap
 * @returns Function yang menerima nama lengkap dan mengembalikan inisial (2 karakter)
 */
export function useInitials() {
    return useCallback((fullName: string): string => {
        // Validasi input
        if (typeof fullName !== 'string' || !fullName.trim()) {
            return '';
        }

        const trimmedName = fullName.trim();
        const names = trimmedName.split(/\s+/).filter(name => name.length > 0);

        if (names.length === 0) {
            return '';
        }
        
        if (names.length === 1) {
            const firstChar = names[0].charAt(0);
            return firstChar ? firstChar.toUpperCase() : '';
        }

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        // Pastikan kedua karakter ada sebelum menggabungkan
        if (!firstInitial || !lastInitial) {
            return firstInitial ? firstInitial.toUpperCase() : '';
        }

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
