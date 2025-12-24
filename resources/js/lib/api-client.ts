import { authStorage } from './auth-storage';

/**
 * Response dari API refresh token
 */
interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
    };
}

/**
 * Flag untuk mencegah multiple refresh request bersamaan
 */
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token menggunakan refresh token
 */
async function refreshAccessToken(): Promise<string> {
    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
        throw new Error('Refresh token tidak ditemukan');
    }

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Jika refresh token juga expired atau invalid, clear semua token
            if (response.status === 401) {
                authStorage.clearTokens();
                // Redirect ke login jika diperlukan
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }

            throw new Error(errorData.message || 'Gagal refresh token');
        }

        const data: RefreshTokenResponse = await response.json();

        if (data.success && data.data.access_token) {
            // Update access token di storage
            authStorage.updateAccessToken(
                data.data.access_token,
                data.data.expires_in
            );

            return data.data.access_token;
        }

        throw new Error('Format response tidak valid');
    } catch (error) {
        authStorage.clearTokens();
        throw error;
    }
}

/**
 * API Client dengan interceptor untuk handle token refresh otomatis
 */
export const apiClient = {
    /**
     * Fetch dengan automatic token refresh
     */
    async fetch(
        url: string,
        options: RequestInit = {}
    ): Promise<Response> {
        // Cek apakah token sudah expired atau akan expired
        const isExpired = authStorage.isTokenExpired(60); // Buffer 60 detik

        // Jika token expired, refresh terlebih dahulu
        if (isExpired && authStorage.getRefreshToken()) {
            // Jika sedang refresh, tunggu promise yang sudah ada
            if (isRefreshing && refreshPromise) {
                try {
                    await refreshPromise;
                } catch (error) {
                    // Jika refresh gagal, lanjutkan request dengan token lama
                    // Server akan return 401 dan kita handle di bawah
                }
            } else {
                // Mulai proses refresh
                isRefreshing = true;
                refreshPromise = refreshAccessToken();

                try {
                    await refreshPromise;
                } catch (error) {
                    // Jika refresh gagal, clear flag dan throw error
                    isRefreshing = false;
                    refreshPromise = null;
                    throw error;
                }

                isRefreshing = false;
                refreshPromise = null;
            }
        }

        // Ambil access token terbaru
        const accessToken = authStorage.getAccessToken();

        // Setup headers
        const headers = new Headers(options.headers);

        // Tambahkan Authorization header jika ada token
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        // Tambahkan CSRF token jika diperlukan
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        if (csrfToken) {
            headers.set('X-CSRF-TOKEN', csrfToken);
        }

        // Set default headers (jangan set Content-Type jika FormData, browser akan set otomatis dengan boundary)
        if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
            headers.set('Content-Type', 'application/json');
        }
        if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json');
        }

        // Buat request dengan headers yang sudah diupdate
        const requestOptions: RequestInit = {
            ...options,
            headers,
        };

        // Kirim request
        let response = await fetch(url, requestOptions);

        // Jika mendapat 401 Unauthorized, coba refresh token sekali lagi
        if (response.status === 401 && authStorage.getRefreshToken()) {
            try {
                // Refresh token
                const newAccessToken = await refreshAccessToken();

                // Update Authorization header dengan token baru
                headers.set('Authorization', `Bearer ${newAccessToken}`);

                // Retry request dengan token baru
                requestOptions.headers = headers;
                response = await fetch(url, requestOptions);
            } catch (refreshError) {
                // Jika refresh gagal, clear tokens dan redirect ke login
                authStorage.clearTokens();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                throw refreshError;
            }
        }

        return response;
    },

    /**
     * GET request
     */
    async get(url: string, options?: RequestInit): Promise<Response> {
        return this.fetch(url, {
            ...options,
            method: 'GET',
        });
    },

    /**
     * POST request
     */
    async post(url: string, body?: any, options?: RequestInit): Promise<Response> {
        return this.fetch(url, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    /**
     * PUT request
     */
    async put(url: string, body?: any, options?: RequestInit): Promise<Response> {
        return this.fetch(url, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    /**
     * PATCH request
     */
    async patch(url: string, body?: any, options?: RequestInit): Promise<Response> {
        return this.fetch(url, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    /**
     * DELETE request
     */
    async delete(url: string, options?: RequestInit): Promise<Response> {
        return this.fetch(url, {
            ...options,
            method: 'DELETE',
        });
    },
};
