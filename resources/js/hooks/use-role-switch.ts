import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import * as authStorage from '@/lib/auth-storage';

/**
 * Hook untuk auto switch role berdasarkan route yang diakses
 * 
 * Behavior:
 * - Jika route diawali /admin/* atau /superadmin/* → set active role = admin atau super_admin
 * - Jika route diawali /paslon/* → set active role = paslon
 * - Jika route diawali /user/* → set active role = user
 * 
 * Hook ini hanya mengatur role aktif, tidak melakukan API call.
 */
export function useRoleSwitch(): void {
  const { url } = usePage();

  useEffect(() => {
    // url dari usePage sudah berupa pathname (misalnya "/admin/dashboard")
    const pathname = url;

    // Tentukan role berdasarkan prefix route
    let targetRole: authStorage.UserRole | null = null;

    if (pathname.startsWith('/admin/') || pathname.startsWith('/superadmin/')) {
      // Untuk admin/superadmin, cek dulu apakah user punya token untuk salah satu role
      // Prioritaskan super_admin jika ada, kalau tidak pakai admin
      if (authStorage.isAuthenticated('super_admin')) {
        targetRole = 'super_admin';
      } else if (authStorage.isAuthenticated('admin')) {
        targetRole = 'admin';
      } else {
        // Jika tidak ada token, default ke admin
        targetRole = 'admin';
      }
    } else if (pathname.startsWith('/paslon/')) {
      targetRole = 'paslon';
    } else if (pathname.startsWith('/user/')) {
      targetRole = 'user';
    }

    // Set active role jika ditemukan dan berbeda dengan current active role
    if (targetRole) {
      const currentActiveRole = authStorage.getActiveRole();
      
      // Hanya update jika berbeda atau belum ada active role
      if (currentActiveRole !== targetRole) {
        // Cek apakah user punya token untuk role tersebut
        // Jika tidak punya token, tetap set active role (untuk kasus pertama kali akses)
        authStorage.setActiveRole(targetRole);
      }
    }
  }, [url]);
}

