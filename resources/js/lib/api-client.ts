import * as authStorage from './auth-storage';

// Flag untuk mencegah multiple refresh token bersamaan
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token menggunakan refresh token
 * @returns Promise yang resolve dengan access token baru
 */
export const refreshAccessToken = async (): Promise<string> => {
  // Jika sedang refresh, kembalikan promise yang sama
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = authStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('Refresh token tidak tersedia');
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Refresh gagal, bersihkan token
        authStorage.clearTokens();
        throw new Error(data.message || 'Refresh token gagal');
      }

      // Update access token baru
      const { access_token, expires_in } = data.data;
      authStorage.updateAccessToken(access_token, expires_in);

      return access_token;
    } finally {
      // Reset flag setelah selesai
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * Wrapper fetch untuk semua request API dengan autentikasi otomatis
 * @param url URL endpoint (relative atau absolute)
 * @param options Request options (headers, body, dll)
 * @returns Promise<Response>
 */
export const apiFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  // Cek apakah token expired sebelum request
  if (authStorage.isTokenExpired()) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      // Refresh token jika tersedia
      await refreshAccessToken();
    }
  }

  // Ambil access token terbaru
  const accessToken = authStorage.getAccessToken();

  // Buat headers baru dari options yang ada
  const headers = new Headers(options.headers);

  // Tambahkan Authorization header jika token tersedia
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // Tambahkan Content-Type default hanya jika:
  // - Ada body
  // - Header Content-Type belum diset
  // - Body BUKAN FormData (biarkan browser set boundary untuk multipart)
  const isFormDataBody =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (options.body && !headers.has('Content-Type') && !isFormDataBody) {
    headers.set('Content-Type', 'application/json');
  }

  // Buat request dengan headers yang sudah di-update
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  // Lakukan request
  let response = await fetch(url, requestOptions);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        // Coba refresh token
        await refreshAccessToken();

        // Ambil access token baru
        const newAccessToken = authStorage.getAccessToken();

        if (newAccessToken) {
          // Update Authorization header dengan token baru
          headers.set('Authorization', `Bearer ${newAccessToken}`);

          // Retry request dengan token baru
          const retryOptions: RequestInit = {
            ...options,
            headers,
          };
          response = await fetch(url, retryOptions);
        }
      } catch (error) {
        // Refresh gagal, token sudah dibersihkan di refreshAccessToken
        throw error;
      }
    }
  }

  return response;
};

/**
 * Helper sederhana berbasis apiFetch agar bisa dipanggil sebagai apiClient
 * Digunakan di beberapa halaman (admin vote, vote guideline, dll).
 */
export const apiClient = {
  get: (url: string, options: RequestInit = {}) => {
    return apiFetch(url, { ...options, method: 'GET' });
  },

  post: (url: string, body?: any, options: RequestInit = {}) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const finalOptions: RequestInit = {
      ...options,
      method: 'POST',
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : options.body,
    };

    return apiFetch(url, finalOptions);
  },

  delete: (url: string, options: RequestInit = {}) => {
    return apiFetch(url, { ...options, method: 'DELETE' });
  },

  /**
   * Passthrough ke apiFetch untuk kasus khusus (misalnya FormData, method kustom, dll)
   */
  fetch: (url: string, options: RequestInit = {}) => {
    return apiFetch(url, options);
  },
};