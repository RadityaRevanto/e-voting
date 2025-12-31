/**
 * Hook untuk guard authorization berdasarkan role
 * Menggunakan exact match - tidak ada akses implisit antar role
 * 
 * @example
 * // Admin only
 * useRoleGuard(['admin'], '/unauthorized');
 * 
 * // Super admin only
 * useRoleGuard(['super_admin'], '/unauthorized');
 * 
 * // Admin + Super Admin (jika diizinkan)
 * useRoleGuard(['admin', 'super_admin'], '/unauthorized');
 */

import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useCurrentUser } from './use-current-user';
import { hasRole, validateRole, type UserRole } from '@/lib/authorization';

interface UseRoleGuardOptions {
  /**
   * Array role yang diizinkan (readonly untuk mencegah mutasi)
   */
  allowedRoles: readonly UserRole[];
  /**
   * Path untuk redirect jika tidak memiliki akses (default: '/')
   */
  redirectTo?: string;
  /**
   * Apakah harus menunggu loading selesai sebelum cek (default: true)
   */
  waitForLoading?: boolean;
}

/**
 * Hook untuk guard authorization berdasarkan role
 * 
 * @param allowedRoles Array role yang diizinkan
 * @param redirectTo Path untuk redirect jika tidak memiliki akses (default: '/')
 * @param waitForLoading Apakah harus menunggu loading selesai sebelum cek (default: true)
 * 
 * @example
 * // Admin only
 * useRoleGuard({ allowedRoles: ['admin'] });
 * 
 * // Super admin only
 * useRoleGuard({ allowedRoles: ['super_admin'], redirectTo: '/unauthorized' });
 * 
 * // Admin + Super Admin (jika diizinkan)
 * useRoleGuard({ allowedRoles: ['admin', 'super_admin'] });
 */
export function useRoleGuard({
  allowedRoles,
  redirectTo = '/',
  waitForLoading = true,
}: UseRoleGuardOptions): void {
  const { user, loading, error } = useCurrentUser();

  useEffect(() => {
    // Tunggu loading selesai jika diperlukan
    if (waitForLoading && loading) {
      return;
    }

    // Jika ada error atau user tidak ada, redirect
    if (error || !user) {
      router.visit(redirectTo);
      return;
    }

    // Validasi role dari user
    const userRole = validateRole(user.role);
    if (!userRole) {
      // Role tidak valid, redirect
      router.visit(redirectTo);
      return;
    }

    // Cek apakah user memiliki salah satu role yang diizinkan (exact match)
    if (!hasRole(userRole, allowedRoles)) {
      // User tidak memiliki role yang diizinkan, redirect
      router.visit(redirectTo);
      return;
    }

    // Logging untuk development (bisa dihapus di production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Role guard passed:', {
        userRole,
        allowedRoles,
      });
    }
  }, [user, loading, error, allowedRoles, redirectTo, waitForLoading]);
}

/**
 * Hook untuk guard admin only
 */
export function useAdminGuard(redirectTo?: string): void {
  useRoleGuard({ allowedRoles: ['admin'], redirectTo });
}

/**
 * Hook untuk guard super admin only
 */
export function useSuperAdminGuard(redirectTo?: string): void {
  useRoleGuard({ allowedRoles: ['super_admin'], redirectTo });
}

/**
 * Hook untuk guard paslon only
 */
export function usePaslonGuard(redirectTo?: string): void {
  useRoleGuard({ allowedRoles: ['paslon'], redirectTo });
}

/**
 * Hook untuk guard user only
 */
export function useUserGuard(redirectTo?: string): void {
  useRoleGuard({ allowedRoles: ['user'], redirectTo });
}

