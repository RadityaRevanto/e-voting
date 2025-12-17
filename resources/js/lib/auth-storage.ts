/**
 * Utility untuk menyimpan dan mengambil token dari localStorage
 */

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at';

export const authStorage = {
    /**
     * Simpan access token dan refresh token
     */
    setTokens(accessToken: string, refreshToken: string, expiresIn: number = 3600): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

        // Simpan waktu expiration (current time + expiresIn seconds)
        const expiresAt = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
    },

    /**
     * Ambil access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Ambil refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Cek apakah access token sudah expired atau akan expired dalam beberapa detik
     */
    isTokenExpired(bufferSeconds: number = 60): boolean {
        const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
        if (!expiresAt) {
            return true;
        }

        const expirationTime = parseInt(expiresAt, 10);
        const currentTime = Date.now();

        // Token dianggap expired jika waktu sekarang + buffer >= waktu expiration
        return currentTime + (bufferSeconds * 1000) >= expirationTime;
    },

    /**
     * Update access token setelah refresh
     */
    updateAccessToken(accessToken: string, expiresIn: number = 3600): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        const expiresAt = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
    },

    /**
     * Hapus semua token (untuk logout)
     */
    clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
    },

    /**
     * Cek apakah user sudah login (ada token)
     */
    isAuthenticated(): boolean {
        return !!this.getAccessToken() && !!this.getRefreshToken();
    },
};
