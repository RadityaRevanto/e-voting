import { apiFetch } from './api-client';
import * as authStorage from './auth-storage';

// Tipe untuk kredensial login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Tipe untuk data user dari API
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Tipe untuk response API standar
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Tipe untuk response login
interface LoginResponseData {
  user: UserData;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Melakukan proses login dan menyimpan token
 * @param credentials Kredensial login (email & password)
 * @returns Data user yang berhasil login
 * @throws Error jika login gagal
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<UserData> => {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const result: ApiResponse<LoginResponseData> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Login gagal');
  }

  const { user, access_token, refresh_token, expires_in } = result.data;

  // Simpan token ke storage
  authStorage.setTokens(access_token, refresh_token, expires_in);

  return user;
};

/**
 * Melakukan proses logout dan menghapus token lokal
 * Apapun hasil request logout, token lokal akan selalu dihapus
 */
export const logout = async (): Promise<void> => {
  try {
    // Coba kirim request logout ke backend
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Abaikan error dari request logout
    // Token lokal tetap harus dihapus
  } finally {
    // Pastikan token lokal selalu dihapus
    authStorage.clearTokens();
  }
};

/**
 * Mengambil data user yang sedang login
 * @returns Data user yang sedang terautentikasi
 * @throws Error jika user tidak terautentikasi atau request gagal
 */
export const getCurrentUser = async (): Promise<UserData> => {
  const response = await apiFetch('/api/auth/me', {
    method: 'GET',
  });

  const result: ApiResponse<UserData> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Gagal mengambil data user');
  }

  return result.data;
};

