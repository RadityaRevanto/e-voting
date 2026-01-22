import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";

export interface VisionMissionData {
  vision: string;
  missions: string[];
  ketua?: string;
  wakilKetua?: string;
  title?: string;
}

export interface UseVisionMissionResult {
  vision: string;
  missions: string[];
  ketua: string;
  wakilKetua: string;
  title: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  fetchVisionMission: () => Promise<void>;
  saveVisionMission: (vision: string, missions: string[]) => Promise<boolean>;
  setVision: (vision: string) => void;
  setMissions: (missions: string[]) => void;
  reset: () => void;
}

export function useVisionMission(
  autoFetch: boolean = true
): UseVisionMissionResult {
  const [vision, setVisionState] = useState<string>('');
  const [missions, setMissionsState] = useState<string[]>(['']);
  const [ketua, setKetua] = useState<string>('');
  const [wakilKetua, setWakilKetua] = useState<string>('');
  const [title, setTitle] = useState<string>('VILLAGE HEAD ELECTION');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchVisionMission = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      console.log('Fetching vision mission data...');
      
      const response = await apiFetch("/api/paslon/profile", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const text = await response.text();
          console.log('Error response text:', text);
          
          if (text) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorData.error || errorMessage;
            } catch {
              errorMessage = text || errorMessage;
            }
          }
        } catch {
          // Ignore parsing errors
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success === false) {
        throw new Error(data.message || "Gagal mengambil data");
      }

      // Extract data from response
      const paslonData = data.data;
      
      if (!paslonData) {
        throw new Error('Data paslon tidak ditemukan');
      }
      
      // Set vision (visi)
      setVisionState(paslonData.visi || '');
      
      // Set ketua dan wakil ketua
      setKetua(paslonData.nama_ketua || '');
      setWakilKetua(paslonData.nama_wakil_ketua || '');
      setTitle('VILLAGE HEAD ELECTION');
      
      // Convert misi string to array (split by newline)
      if (paslonData.misi && typeof paslonData.misi === 'string') {
        const missionsArray = paslonData.misi
          .split('\n')
          .map((m: string) => m.trim())
          .filter((m: string) => m.length > 0);
        
        setMissionsState(missionsArray.length > 0 ? missionsArray : ['']);
      } else {
        setMissionsState(['']);
      }
      
    } catch (err: unknown) {
      console.error('Error fetching vision mission:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat memuat data";
      
      setError(errorMessage);
      
      // Set default values jika error
      setVisionState('');
      setMissionsState(['']);
      setKetua('');
      setWakilKetua('');
      setTitle('VILLAGE HEAD ELECTION');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveVisionMission = useCallback(async (
    vision: string, 
    missions: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validasi input
      if (!vision.trim()) {
        setError("Vision harus diisi");
        setLoading(false);
        return false;
      }

      const validMissions = missions.filter((mission) => mission.trim() !== "");
      if (validMissions.length === 0) {
        setError("Minimal harus ada 1 mission");
        setLoading(false);
        return false;
      }

      // Convert missions array to string (join by newline)
      const misiString = validMissions.map((m) => m.trim()).join('\n');

      console.log('Saving vision mission:', { visi: vision.trim(), misi: misiString });
      
      const response = await apiFetch("/api/paslon/update-visi-misi", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          visi: vision.trim(),
          misi: misiString,
        }),
      });

      console.log('Save response status:', response.status);
      
      const responseText = await response.text();
      console.log('Save response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Save response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || data.error || `HTTP ${response.status}: Gagal menyimpan`);
        }
        setLoading(false);
        return false;
      }

      // Check success flag if exists
      if (data.success === false) {
        setError(data.message || "Gagal menyimpan");
        setLoading(false);
        return false;
      }

      // Update local state from response data
      if (data.data) {
        setVisionState(data.data.visi || vision);
        if (data.data.nama_ketua) {
          setKetua(data.data.nama_ketua);
        }
        if (data.data.nama_wakil_ketua) {
          setWakilKetua(data.data.nama_wakil_ketua);
        }
        
        // Convert misi string back to array
        if (data.data.misi && typeof data.data.misi === 'string') {
          const missionsArray = data.data.misi
            .split('\n')
            .map((m: string) => m.trim())
            .filter((m: string) => m.length > 0);
          setMissionsState(missionsArray.length > 0 ? missionsArray : validMissions);
        } else {
          setMissionsState(validMissions);
        }
      } else {
        // Fallback: use submitted values
        setVisionState(vision);
        setMissionsState(validMissions);
      }
      
      setSuccess(data.message || "Vision dan mission berhasil diperbarui!");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      
      setLoading(false);
      return true;
    } catch (err: unknown) {
      console.error('Error saving vision mission:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat menyimpan";
      
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const setVision = useCallback((vision: string) => {
    setVisionState(vision);
  }, []);

  const setMissions = useCallback((missions: string[]) => {
    setMissionsState(missions);
  }, []);

  const reset = useCallback(() => {
    setVisionState('');
    setMissionsState(['']);
    setKetua('');
    setWakilKetua('');
    setTitle('VILLAGE HEAD ELECTION');
    setError(null);
    setSuccess(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchVisionMission();
    }
  }, [autoFetch, fetchVisionMission]);

  return {
    vision,
    missions,
    ketua,
    wakilKetua,
    title,
    loading,
    error,
    success,
    fetchVisionMission,
    saveVisionMission,
    setVision,
    setMissions,
    reset,
  };
}