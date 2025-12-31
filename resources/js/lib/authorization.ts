/**
 * Authorization helper - Single source of truth untuk pengecekan role
 * 
 * ⚠️ PENTING: Gunakan exact match, bukan substring atau includes
 * 
 * @example
 * // Admin only
 * if (!hasRole(user.role, ['admin'])) {
 *   redirect('/unauthorized');
 * }
 * 
 * // Super admin only
 * if (!hasRole(user.role, ['super_admin'])) {
 *   redirect('/unauthorized');
 * }
 * 
 * // Admin + Super Admin (jika diizinkan)
 * if (!hasRole(user.role, ['admin', 'super_admin'])) {
 *   redirect('/unauthorized');
 * }
 */

import type { UserRole } from './auth-storage';

// Re-export UserRole untuk kemudahan penggunaan
export type { UserRole } from './auth-storage';

/**
 * Mengecek apakah user memiliki salah satu role yang diizinkan
 * Menggunakan exact match (strict equality), bukan substring atau includes
 * 
 * @param userRole Role user yang sedang dicek
 * @param allowedRoles Array role yang diizinkan (readonly untuk mencegah mutasi)
 * @returns true jika userRole ada di allowedRoles (exact match)
 * 
 * @example
 * hasRole('admin', ['admin']) // true
 * hasRole('super_admin', ['admin']) // false (exact match)
 * hasRole('super_admin', ['admin', 'super_admin']) // true
 */
export const hasRole = (
  userRole: UserRole,
  allowedRoles: readonly UserRole[]
): boolean => {
  // Validasi input
  if (!userRole || !allowedRoles || allowedRoles.length === 0) {
    return false;
  }

  // Exact match menggunakan includes (untuk array)
  // Ini aman karena kita memastikan UserRole adalah tipe yang strict
  return allowedRoles.includes(userRole);
};

/**
 * Mengecek apakah user adalah admin (hanya admin, bukan super_admin)
 */
export const isAdmin = (userRole: UserRole): boolean => {
  return hasRole(userRole, ['admin']);
};

/**
 * Mengecek apakah user adalah super_admin (hanya super_admin, bukan admin)
 */
export const isSuperAdmin = (userRole: UserRole): boolean => {
  return hasRole(userRole, ['super_admin']);
};

/**
 * Mengecek apakah user adalah paslon
 */
export const isPaslon = (userRole: UserRole): boolean => {
  return hasRole(userRole, ['paslon']);
};

/**
 * Mengecek apakah user adalah user biasa
 */
export const isUser = (userRole: UserRole): boolean => {
  return hasRole(userRole, ['user']);
};

/**
 * Validasi role dari string (untuk data dari API)
 * Memastikan role yang diterima adalah valid UserRole
 * 
 * @param role String role dari API
 * @returns UserRole yang valid atau null jika tidak valid
 */
export const validateRole = (role: string | null | undefined): UserRole | null => {
  if (!role || typeof role !== 'string') {
    return null;
  }

  const validRoles: readonly UserRole[] = ['user', 'admin', 'paslon', 'super_admin'];
  
  // Exact match validation
  if (validRoles.includes(role as UserRole)) {
    return role as UserRole;
  }

  return null;
};

