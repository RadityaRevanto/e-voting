// Utilitas penyimpanan token autentikasi di localStorage.
// File ini hanya mengurus penyimpanan & pembacaan token, tanpa akses jaringan.
// Mendukung multi-role: setiap role memiliki token sendiri.

// Tipe role yang didukung
export type UserRole = 'admin' | 'super_admin' | 'paslon' | 'user';

// Key untuk active role
const ACTIVE_ROLE_KEY = 'auth.active_role';

// Helper untuk generate key per role
const getAccessTokenKey = (role: UserRole): string => `auth.access_token.${role}`;
const getRefreshTokenKey = (role: UserRole): string => `auth.refresh_token.${role}`;
const getExpiresAtKey = (role: UserRole): string => `auth.expires_at.${role}`;

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

/**
 * Menyimpan token untuk role tertentu
 * @param role Role user (admin, super_admin, paslon, user)
 * @param accessToken Access token
 * @param refreshToken Refresh token
 * @param expiresInSeconds Waktu expiry dalam detik
 */
export const setTokens = (
  role: UserRole,
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number,
): void => {
  if (!isLocalStorageAvailable()) return;

  const expiresAt = computeExpiryTimestamp(expiresInSeconds);

  window.localStorage.setItem(getAccessTokenKey(role), accessToken);
  window.localStorage.setItem(getRefreshTokenKey(role), refreshToken);
  window.localStorage.setItem(getExpiresAtKey(role), String(expiresAt));
};

/**
 * Mengambil access token untuk role aktif (atau role tertentu)
 * @param role Role yang ingin diambil tokennya (opsional, default: active role)
 * @returns Access token atau null
 */
export const getAccessToken = (role?: UserRole): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  const targetRole = role || getActiveRole();
  if (!targetRole) return null;
  
  return window.localStorage.getItem(getAccessTokenKey(targetRole));
};

/**
 * Mengambil refresh token untuk role aktif (atau role tertentu)
 * @param role Role yang ingin diambil tokennya (opsional, default: active role)
 * @returns Refresh token atau null
 */
export const getRefreshToken = (role?: UserRole): string | null => {
  if (!isLocalStorageAvailable()) return null;
  
  const targetRole = role || getActiveRole();
  if (!targetRole) return null;
  
  return window.localStorage.getItem(getRefreshTokenKey(targetRole));
};

/**
 * Mengecek apakah access token sudah atau hampir kedaluwarsa untuk role aktif (atau role tertentu)
 * @param bufferSeconds Waktu buffer dalam detik sebelum kedaluwarsa yang dianggap "expired"
 * @param role Role yang ingin dicek (opsional, default: active role)
 * @returns true jika token expired atau tidak ada
 */
export const isTokenExpired = (bufferSeconds: number = 60, role?: UserRole): boolean => {
  if (!isLocalStorageAvailable()) return true;

  const targetRole = role || getActiveRole();
  if (!targetRole) return true;

  const rawExpiresAt = window.localStorage.getItem(getExpiresAtKey(targetRole));
  if (!rawExpiresAt) return true;

  const expiresAt = Number(rawExpiresAt);
  if (Number.isNaN(expiresAt)) return true;

  const nowWithBuffer = Date.now() + bufferSeconds * 1000;
  return nowWithBuffer >= expiresAt;
};

/**
 * Meng-update hanya access token dan expiry setelah proses refresh token untuk role aktif (atau role tertentu)
 * @param accessToken Access token baru
 * @param expiresInSeconds Waktu expiry dalam detik
 * @param role Role yang ingin di-update (opsional, default: active role)
 */
export const updateAccessToken = (
  accessToken: string,
  expiresInSeconds: number,
  role?: UserRole,
): void => {
  if (!isLocalStorageAvailable()) return;

  const targetRole = role || getActiveRole();
  if (!targetRole) return;

  const expiresAt = computeExpiryTimestamp(expiresInSeconds);

  window.localStorage.setItem(getAccessTokenKey(targetRole), accessToken);
  window.localStorage.setItem(getExpiresAtKey(targetRole), String(expiresAt));
};

/**
 * Menghapus token untuk role tertentu (digunakan saat logout)
 * @param role Role yang ingin dihapus tokennya (opsional, default: active role)
 */
export const clearTokens = (role?: UserRole): void => {
  if (!isLocalStorageAvailable()) return;

  const targetRole = role || getActiveRole();
  if (!targetRole) return;

  window.localStorage.removeItem(getAccessTokenKey(targetRole));
  window.localStorage.removeItem(getRefreshTokenKey(targetRole));
  window.localStorage.removeItem(getExpiresAtKey(targetRole));
};

/**
 * Menghapus semua token untuk semua role (digunakan saat logout semua)
 */
export const clearAllTokens = (): void => {
  if (!isLocalStorageAvailable()) return;

  const roles: UserRole[] = ['admin', 'super_admin', 'paslon', 'user'];
  roles.forEach((role) => {
    window.localStorage.removeItem(getAccessTokenKey(role));
    window.localStorage.removeItem(getRefreshTokenKey(role));
    window.localStorage.removeItem(getExpiresAtKey(role));
  });
  
  // Hapus active role juga
  window.localStorage.removeItem(ACTIVE_ROLE_KEY);
};

/**
 * Mengatur role aktif
 * @param role Role yang ingin dijadikan aktif
 */
export const setActiveRole = (role: UserRole): void => {
  if (!isLocalStorageAvailable()) return;
  window.localStorage.setItem(ACTIVE_ROLE_KEY, role);
};

/**
 * Mengambil role aktif
 * @returns Role aktif atau null jika tidak ada
 */
export const getActiveRole = (): UserRole | null => {
  if (!isLocalStorageAvailable()) return null;
  const role = window.localStorage.getItem(ACTIVE_ROLE_KEY);
  if (!role) return null;
  
  // Validasi role
  const validRoles: UserRole[] = ['admin', 'super_admin', 'paslon', 'user'];
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  
  return null;
};

/**
 * Helper sederhana untuk mengecek apakah user dianggap sudah login untuk role tertentu
 * @param role Role yang ingin dicek (opsional, default: active role)
 * @returns true jika user sudah login untuk role tersebut
 */
export const isAuthenticated = (role?: UserRole): boolean => {
  const targetRole = role || getActiveRole();
  if (!targetRole) return false;
  
  return !!getAccessToken(targetRole) && !!getRefreshToken(targetRole);
};

