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

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";
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

  const fetchGuidelines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/vote-guidelines/", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat guidelines");
      }

      const data = await response.json();
      if (data.success && data.data) {
        setGuidelines(data.data);
      } else {
        throw new Error("Format data tidak valid");
      }
    } catch (err) {
      console.error("Error fetching guidelines:", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat memuat guidelines",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuidelines();
  }, [fetchGuidelines]);

  const addGuideline = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!newGuideline.trim() || processing) return;

      setProcessing(true);
      setError(null);
      try {
        const response = await apiClient.post("/api/admin/vote-guidelines/create", {
          text: newGuideline.trim(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal menambahkan guideline");
        }

        if (data.success) {
          setNewGuideline("");
          await fetchGuidelines();
        }
      } catch (err) {
        console.error("Error adding guideline:", err);
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan guideline",
        );
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
    async (id: number, e?: React.FormEvent) => {
      e?.preventDefault();
      if (!editingText.trim() || processing) return;

      setProcessing(true);
      setError(null);
      try {
        const response = await apiClient.post(`/api/admin/vote-guidelines/${id}/update`, {
          text: editingText.trim(),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengupdate guideline");
        }

        if (data.success) {
          setEditingId(null);
          setEditingText("");
          await fetchGuidelines();
        }
      } catch (err) {
        console.error("Error updating guideline:", err);
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan saat mengupdate guideline",
        );
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

  const confirmDelete = useCallback(async () => {
    if (deleteConfirmId === null || processing) return;

    setProcessing(true);
    setError(null);
    try {
      const response = await apiClient.delete(
        `/api/admin/vote-guidelines/${deleteConfirmId}/delete`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus guideline");
      }

      if (data.success) {
        setDeleteConfirmId(null);
        await fetchGuidelines();
      }
    } catch (err) {
      console.error("Error deleting guideline:", err);
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus guideline",
      );
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


