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

// Helper untuk normalisasi role dari backend ke UserRole
const normalizeRole = (role: string): authStorage.UserRole | null => {
  // Normalisasi role dari backend
  if (role === 'admin' || role === 'super_admin') {
    return role === 'super_admin' ? 'super_admin' : 'admin';
  }
  if (role === 'paslon') return 'paslon';
  if (role === 'user' || role === 'voter') return 'user';
  return null;
};

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
 * Melakukan proses login dan menyimpan token sesuai role
 * @param credentials Kredensial login (email & password)
 * @returns Data user yang berhasil login
 * @throws Error jika login gagal
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<UserData> => {
  // Login request tidak memerlukan token (public endpoint)
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result: ApiResponse<LoginResponseData> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Login gagal');
  }

  const { user, access_token, refresh_token, expires_in } = result.data;

  // Normalisasi role dari backend
  const normalizedRole = normalizeRole(user.role);
  if (!normalizedRole) {
    throw new Error('Role tidak valid');
  }

  // Simpan token ke storage sesuai role
  authStorage.setTokens(normalizedRole, access_token, refresh_token, expires_in);
  
  // Set active role
  authStorage.setActiveRole(normalizedRole);

  return user;
};

/**
 * Melakukan proses logout dan menghapus token lokal untuk role aktif
 * Apapun hasil request logout, token lokal akan selalu dihapus
 * @param role Role yang ingin di-logout (opsional, default: active role)
 */
export const logout = async (role?: authStorage.UserRole): Promise<void> => {
  const targetRole = role || authStorage.getActiveRole();
  
  try {
    // Coba kirim request logout ke backend jika ada role
    if (targetRole) {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
      });
    }
  } catch (error) {
    // Abaikan error dari request logout
    // Token lokal tetap harus dihapus
  } finally {
    // Pastikan token lokal selalu dihapus untuk role tersebut
    if (targetRole) {
      authStorage.clearTokens(targetRole);
      
      // Jika role yang di-logout adalah active role, hapus active role juga
      if (targetRole === authStorage.getActiveRole()) {
        // Cari role lain yang masih punya token untuk dijadikan active role
        const roles: authStorage.UserRole[] = ['admin', 'super_admin', 'paslon', 'user'];
        const nextActiveRole = roles.find(r => r !== targetRole && authStorage.isAuthenticated(r));
        
        if (nextActiveRole) {
          authStorage.setActiveRole(nextActiveRole);
        } else {
          // Tidak ada role lain yang login, hapus active role
          window.localStorage.removeItem('auth.active_role');
        }
      }
    }
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

