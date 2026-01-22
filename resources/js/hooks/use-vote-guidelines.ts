import { useCallback, useEffect, useMemo, useState } from "react";
import { apiClient } from "../lib/api-client";

export interface Guideline {
  id: number;
  text: string;
}

interface UseAdminVoteGuidelinesResult {
  guidelines: Guideline[];
  loading: boolean;
  processing: boolean;
  error: string | null;

  newGuideline: string;
  setNewGuideline: (v: string) => void;

  editingId: number | null;
  editingText: string;
  startEdit: (id: number, text: string) => void;
  setEditingText: (v: string) => void;
  cancelEdit: () => void;

  deleteConfirmId: number | null;
  requestDelete: (id: number) => void;
  cancelDelete: () => void;

  draggedId: number | null;
  dragOverId: number | null;

  fetchGuidelines: () => Promise<void>;
  addGuideline: (e?: React.FormEvent) => Promise<void>;
  updateGuideline: (id: number, e?: React.FormEvent) => Promise<void>;
  confirmDelete: () => Promise<void>;

  handleDragStart: (e: React.DragEvent, id: number) => void;
  handleDragOver: (e: React.DragEvent, id: number) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetId: number) => void;
  handleDragEnd: () => void;
}

export function useAdminVoteGuidelines(): UseAdminVoteGuidelinesResult {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newGuideline, setNewGuideline] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const fetchGuidelines = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/api/vote-guidelines/", {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : "Gagal memuat guidelines";
        throw new Error(errorMessage);
      }
      
      // Validasi response structure
      if (!data || typeof data !== 'object' || !data.success) {
        throw new Error("Format data tidak valid");
      }

      // Validasi data array
      if (!Array.isArray(data.data)) {
        throw new Error("Format data tidak valid");
      }

      // Validasi setiap guideline dalam array
      const dataArray = data.data as unknown[];
      const validGuidelines: Guideline[] = dataArray.filter((item: unknown): item is Guideline => {
        if (typeof item !== 'object' || item === null) {
          return false;
        }
        
        const obj = item as Record<string, unknown>;
        return (
          typeof obj.id === 'number' &&
          typeof obj.text === 'string'
        );
      });

      setGuidelines(validGuidelines);
    } catch (err: unknown) {
      console.error("Error fetching guidelines:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat memuat guidelines";
      
      setError(errorMessage);
      setGuidelines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuidelines();
  }, [fetchGuidelines]);

  const addGuideline = useCallback(
    async (e?: React.FormEvent): Promise<void> => {
      e?.preventDefault();
      
      // Validasi input
      const trimmedGuideline = typeof newGuideline === 'string' ? newGuideline.trim() : '';
      if (!trimmedGuideline || processing) {
        return;
      }

      setProcessing(true);
      setError(null);
      try {
        const response = await apiClient.post("/api/admin/vote-guidelines/create", {
          text: trimmedGuideline,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : "Gagal menambahkan guideline";
          throw new Error(errorMessage);
        }

        if (data.success) {
          setNewGuideline("");
          await fetchGuidelines();
        } else {
          const errorMessage = typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : "Gagal menambahkan guideline";
          throw new Error(errorMessage);
        }
      } catch (err: unknown) {
        console.error("Error adding guideline:", err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Terjadi kesalahan saat menambahkan guideline";
        
        setError(errorMessage);
      } finally {
        setProcessing(false);
      }
    },
    [fetchGuidelines, newGuideline, processing],
  );

  const startEdit = useCallback((id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingText("");
  }, []);

  const updateGuideline = useCallback(
    async (id: number, e?: React.FormEvent): Promise<void> => {
      e?.preventDefault();
      
      // Validasi input
      if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
        setError("ID guideline tidak valid");
        return;
      }

      const trimmedText = typeof editingText === 'string' ? editingText.trim() : '';
      if (!trimmedText || processing) {
        return;
      }

      setProcessing(true);
      setError(null);
      try {
        const response = await apiClient.post(`/api/admin/vote-guidelines/${id}/update`, {
          text: trimmedText,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : "Gagal mengupdate guideline";
          throw new Error(errorMessage);
        }

        if (data.success) {
          setEditingId(null);
          setEditingText("");
          await fetchGuidelines();
        } else {
          const errorMessage = typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : "Gagal mengupdate guideline";
          throw new Error(errorMessage);
        }
      } catch (err: unknown) {
        console.error("Error updating guideline:", err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Terjadi kesalahan saat mengupdate guideline";
        
        setError(errorMessage);
      } finally {
        setProcessing(false);
      }
    },
    [editingText, fetchGuidelines, processing],
  );

  const requestDelete = useCallback((id: number) => {
    setDeleteConfirmId(id);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  const confirmDelete = useCallback(async (): Promise<void> => {
    // Validasi input
    if (deleteConfirmId === null || typeof deleteConfirmId !== 'number' || !Number.isInteger(deleteConfirmId) || deleteConfirmId <= 0) {
      setError("ID guideline tidak valid");
      return;
    }

    if (processing) {
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const response = await apiClient.delete(
        `/api/admin/vote-guidelines/${deleteConfirmId}/delete`,
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : "Gagal menghapus guideline";
        throw new Error(errorMessage);
      }

      if (data.success) {
        setDeleteConfirmId(null);
        await fetchGuidelines();
      } else {
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : "Gagal menghapus guideline";
        throw new Error(errorMessage);
      }
    } catch (err: unknown) {
      console.error("Error deleting guideline:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat menghapus guideline";
      
      setError(errorMessage);
    } finally {
      setProcessing(false);
    }
  }, [deleteConfirmId, fetchGuidelines, processing]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: number) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", id.toString());
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (draggedId !== id) {
        setDragOverId(id);
      }
    },
    [draggedId],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: number) => {
      e.preventDefault();
      if (draggedId === null || draggedId === targetId) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const draggedIndex = guidelines.findIndex((g) => g.id === draggedId);
      const targetIndex = guidelines.findIndex((g) => g.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const newGuidelines = [...guidelines];
      const [removed] = newGuidelines.splice(draggedIndex, 1);
      newGuidelines.splice(targetIndex, 0, removed);

      setGuidelines(newGuidelines);
      setDraggedId(null);
      setDragOverId(null);
    },
    [draggedId, guidelines],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  return useMemo(
    () => ({
      guidelines,
      loading,
      processing,
      error,

      newGuideline,
      setNewGuideline,

      editingId,
      editingText,
      startEdit,
      setEditingText,
      cancelEdit,

      deleteConfirmId,
      requestDelete,
      cancelDelete,

      draggedId,
      dragOverId,

      fetchGuidelines,
      addGuideline,
      updateGuideline,
      confirmDelete,

      handleDragStart,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      handleDragEnd,
    }),
    [
      addGuideline,
      cancelDelete,
      cancelEdit,
      confirmDelete,
      deleteConfirmId,
      dragOverId,
      draggedId,
      editingId,
      editingText,
      error,
      fetchGuidelines,
      guidelines,
      handleDragEnd,
      handleDragLeave,
      handleDragOver,
      handleDragStart,
      handleDrop,
      loading,
      newGuideline,
      processing,
      requestDelete,
      setEditingText,
      setNewGuideline,
      startEdit,
      updateGuideline,
    ],
  );
}

interface UseVoteGuidelinesResult {
  guidelines: Guideline[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook untuk user untuk menampilkan vote guidelines (read-only)
 * Mengambil data dari endpoint public /api/vote-guidelines/
 */
export function useVoteGuidelines(): UseVoteGuidelinesResult {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuidelines = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/api/vote-guidelines/", {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data !== null && 'message' in data
          ? String(data.message)
          : "Gagal memuat guidelines";
        throw new Error(errorMessage);
      }
      
      // Validasi response structure
      if (!data || typeof data !== 'object' || !data.success) {
        throw new Error("Format data tidak valid");
      }

      // Validasi data array
      if (!Array.isArray(data.data)) {
        throw new Error("Format data tidak valid");
      }

      // Validasi setiap guideline dalam array
      const dataArray = data.data as unknown[];
      const validGuidelines: Guideline[] = dataArray.filter((item: unknown): item is Guideline => {
        if (typeof item !== 'object' || item === null) {
          return false;
        }
        
        const obj = item as Record<string, unknown>;
        return (
          typeof obj.id === 'number' &&
          typeof obj.text === 'string'
        );
      });

      setGuidelines(validGuidelines);
    } catch (err: unknown) {
      console.error("Error fetching guidelines:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Terjadi kesalahan saat memuat guidelines";
      
      setError(errorMessage);
      setGuidelines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuidelines();
  }, [fetchGuidelines]);

  return useMemo(
    () => ({
      guidelines,
      loading,
      error,
      refetch: fetchGuidelines,
    }),
    [guidelines, loading, error, fetchGuidelines],
  );
}

