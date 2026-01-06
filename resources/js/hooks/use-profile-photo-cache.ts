import { useState, useEffect, useRef } from "react";

type CacheKey = "admin" | "paslon";

const CACHE_PREFIX = "profile_photo_";
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

interface CacheData {
  photo: string | null;
  timestamp: number;
}

/**
 * Hook untuk cache foto profile agar tidak re-fetch setiap ganti halaman
 * Menggunakan sessionStorage untuk persistensi selama session
 */
export function useProfilePhotoCache(
  cacheKey: CacheKey,
  fetchFn: () => Promise<string | null>
) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const storageKey = `${CACHE_PREFIX}${cacheKey}`;
    
    // Cek cache dari sessionStorage
    const cachedData = sessionStorage.getItem(storageKey);
    if (cachedData) {
      try {
        const parsed: CacheData = JSON.parse(cachedData);
        const now = Date.now();
        
        // Jika cache masih valid (kurang dari 5 menit)
        if (now - parsed.timestamp < CACHE_DURATION && parsed.photo) {
          if (isMountedRef.current) {
            setPhoto(parsed.photo);
            setLoading(false);
            return;
          }
        } else {
          // Cache expired, hapus
          sessionStorage.removeItem(storageKey);
        }
      } catch (e) {
        // Invalid cache, hapus
        sessionStorage.removeItem(storageKey);
      }
    }

    // Fetch data baru
    const fetchPhoto = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await fetchFn();
        
        if (isMountedRef.current) {
          setPhoto(result);
          
          // Simpan ke cache
          const cacheData: CacheData = {
            photo: result,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(storageKey, JSON.stringify(cacheData));
        }
      } catch (err) {
        console.error(`Error fetching ${cacheKey} profile photo:`, err);
        if (isMountedRef.current) {
          setError(true);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchPhoto();
  }, [cacheKey, fetchFn]);

  // Function untuk invalidate cache (misalnya setelah update profile)
  const invalidateCache = () => {
    const storageKey = `${CACHE_PREFIX}${cacheKey}`;
    sessionStorage.removeItem(storageKey);
    setPhoto(null);
    setLoading(true);
  };

  return { photo, loading, error, invalidateCache };
}

