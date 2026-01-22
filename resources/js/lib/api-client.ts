import * as authStorage from './auth-storage';

// Flag untuk mencegah multiple refresh token bersamaan
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token menggunakan refresh token untuk role aktif
 * @param role Role yang ingin di-refresh (opsional, default: active role)
 * @returns Promise yang resolve dengan access token baru
 */
export const refreshAccessToken = async (role?: authStorage.UserRole): Promise<string> => {
  // Jika sedang refresh, kembalikan promise yang sama
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const targetRole = role || authStorage.getActiveRole();
  if (!targetRole) {
    throw new Error('Role tidak tersedia');
  }

  const refreshToken = authStorage.getRefreshToken(targetRole);
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
        // Refresh gagal, bersihkan token untuk role tersebut
        authStorage.clearTokens(targetRole);
        throw new Error(data.message || 'Refresh token gagal');
      }

      // Update access token baru untuk role tersebut
      const { access_token, expires_in } = data.data;
      authStorage.updateAccessToken(access_token, expires_in, targetRole);

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
 * Menggunakan token berdasarkan active role
 * @param url URL endpoint (relative atau absolute)
 * @param options Request options (headers, body, dll)
 * @returns Promise<Response>
 */
export const apiFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  // Ambil active role
  const activeRole = authStorage.getActiveRole();
  
  // Jika tidak ada active role, lakukan request tanpa token
  if (!activeRole) {
    const headers = new Headers(options.headers);
    const isFormDataBody =
      typeof FormData !== 'undefined' && options.body instanceof FormData;

    if (options.body && !headers.has('Content-Type') && !isFormDataBody) {
      headers.set('Content-Type', 'application/json');
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  // Cek apakah token expired sebelum request
  if (authStorage.isTokenExpired(60, activeRole)) {
    const refreshToken = authStorage.getRefreshToken(activeRole);
    if (refreshToken) {
      // Refresh token jika tersedia
      await refreshAccessToken(activeRole);
    }
  }

  // Ambil access token terbaru untuk active role
  const accessToken = authStorage.getAccessToken(activeRole);

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
    const refreshToken = authStorage.getRefreshToken(activeRole);
    if (refreshToken) {
      try {
        // Coba refresh token untuk active role
        await refreshAccessToken(activeRole);

        // Ambil access token baru
        const newAccessToken = authStorage.getAccessToken(activeRole);

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