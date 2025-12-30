import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, type UserData } from '@/lib/auth-service';

interface UseCurrentUserReturn {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook untuk mengambil data user yang sedang login dari endpoint /me
 * @returns Object berisi user data, loading state, error, dan fungsi refetch
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const userData: UserData = await getCurrentUser();
      
      // Validasi runtime untuk memastikan data user valid
      if (!userData || typeof userData.id !== 'number' || !userData.email || !userData.name) {
        throw new Error('Data user tidak valid');
      }
      
      setUser(userData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Gagal mengambil data user';
      
      setError(new Error(errorMessage));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

