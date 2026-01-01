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
      
      const response = await apiFetch("/api/paslon/dashboard/vision-mission", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Cek content type
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          // Coba parse error response
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

      // Pastikan response adalah JSON
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error('Response is not JSON');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Handle different response formats
      if (data.success === false) {
        throw new Error(data.message || "Gagal mengambil data");
      }

      // Extract data from response
      const visionData = data.data || data;
      
      // Set default values jika data kosong
      setVisionState(visionData.vision || '');
      setKetua(visionData.ketua || '');
      setWakilKetua(visionData.wakilKetua || '');
      setTitle(visionData.title || 'VILLAGE HEAD ELECTION');
      
      if (visionData.missions && Array.isArray(visionData.missions)) {
        setMissionsState(
          visionData.missions.length > 0 
            ? visionData.missions 
            : ['']
        );
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

      console.log('Saving vision mission:', { vision, missions: validMissions });
      
      const response = await apiFetch("/api/paslon/dashboard/vision-mission", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          vision: vision.trim(),
          missions: validMissions.map((m) => m.trim()),
        }),
      });

      console.log('Save response status:', response.status);
      
      const contentType = response.headers.get('content-type');
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

      // Update local state
      setVisionState(vision);
      setMissionsState(validMissions);
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