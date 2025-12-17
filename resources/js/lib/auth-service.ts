import { authStorage } from './auth-storage';
import { apiClient } from './api-client';

/**
 * Interface untuk response login
 */
interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
    };
}

/**
 * Service untuk handle authentication
 */
export const authService = {
    /**
     * Login dan simpan token ke storage
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data: LoginResponse = await response.json();

        if (data.success && data.data.access_token && data.data.refresh_token) {
            // Simpan token ke storage
            authStorage.setTokens(
                data.data.access_token,
                data.data.refresh_token,
                data.data.expires_in
            );
        }

        return data;
    },

    /**
     * Logout dan hapus token dari storage
     */
    async logout(): Promise<void> {
        try {
            // Panggil API logout jika diperlukan
            await apiClient.post('/api/auth/logout');
        } catch (error) {
            console.error('Error saat logout:', error);
        } finally {
            // Hapus token dari storage
            authStorage.clearTokens();
        }
    },

    /**
     * Cek apakah user sudah login
     */
    isAuthenticated(): boolean {
        return authStorage.isAuthenticated();
    },

    /**
     * Ambil access token
     */
    getAccessToken(): string | null {
        return authStorage.getAccessToken();
    },

    /**
     * Ambil refresh token
     */
    getRefreshToken(): string | null {
        return authStorage.getRefreshToken();
    },
};
