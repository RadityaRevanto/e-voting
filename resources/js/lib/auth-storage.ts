// Utilitas penyimpanan token autentikasi di localStorage.
// File ini hanya mengurus penyimpanan & pembacaan token, tanpa akses jaringan.

const ACCESS_TOKEN_KEY = 'auth.access_token';
const REFRESH_TOKEN_KEY = 'auth.refresh_token';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'auth.access_token_expires_at';

// Cek ketersediaan localStorage (berguna untuk SSR atau environment non-browser)
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

// Hitung timestamp expiry dalam milidetik
const computeExpiryTimestamp = (expiresInSeconds: number): number => {
  return Date.now() + expiresInSeconds * 1000;
};

export const setTokens = (
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number,
): void => {
  if (!isLocalStorageAvailable()) return;

  const expiresAt = computeExpiryTimestamp(expiresInSeconds);

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
};

export const getAccessToken = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Mengecek apakah access token sudah atau hampir kedaluwarsa.
// bufferSeconds: waktu buffer dalam detik sebelum kedaluwarsa yang dianggap "expired".
export const isTokenExpired = (bufferSeconds: number = 60): boolean => {
  if (!isLocalStorageAvailable()) return true;

  const rawExpiresAt = window.localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  if (!rawExpiresAt) return true;

  const expiresAt = Number(rawExpiresAt);
  if (Number.isNaN(expiresAt)) return true;

  const nowWithBuffer = Date.now() + bufferSeconds * 1000;
  return nowWithBuffer >= expiresAt;
};

// Meng-update hanya access token dan expiry setelah proses refresh token.
export const updateAccessToken = (
  accessToken: string,
  expiresInSeconds: number,
): void => {
  if (!isLocalStorageAvailable()) return;

  const expiresAt = computeExpiryTimestamp(expiresInSeconds);

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
};

// Menghapus seluruh informasi token (digunakan saat logout).
export const clearTokens = (): void => {
  if (!isLocalStorageAvailable()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
};

// Helper sederhana untuk mengecek apakah user dianggap sudah login.
export const isAuthenticated = (): boolean => {
    return !!getAccessToken() && !!getRefreshToken();
  };
  

