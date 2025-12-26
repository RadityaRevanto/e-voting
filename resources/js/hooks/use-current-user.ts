import { useState, useEffect } from 'react';
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

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Gagal mengambil data user'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

