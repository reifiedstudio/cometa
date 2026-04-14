"use client";

import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GATEWAY_URL, type Note, type NoteWithContent } from "@/lib/api";

async function authFetch(getToken: () => Promise<string | null>, url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers });
}

export const queryKeys = {
  notes: ["notes"] as const,
  note: (id: string) => ["note", id] as const,
};

export function useNotesQuery() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.notes,
    queryFn: async (): Promise<Note[]> => {
      const res = await authFetch(getToken, `${GATEWAY_URL}/api/notes`);
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
      const data = await res.json();
      return data.notes;
    },
  });
}

export function useNoteQuery(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.note(id),
    queryFn: async (): Promise<NoteWithContent> => {
      const res = await authFetch(getToken, `${GATEWAY_URL}/api/notes/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch note: ${res.status}`);
      return res.json();
    },
    enabled: !!id,
    // Refetch every 10 minutes to keep presigned URL fresh (expires after 15 min)
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useStarNote() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, starred }: { id: string; starred: boolean }) => {
      const res = await authFetch(getToken, `${GATEWAY_URL}/api/notes/${id}/star`, {
        method: "PATCH",
        body: JSON.stringify({ starred }),
      });
      if (!res.ok) throw new Error(`Failed to star note: ${res.status}`);
      return { id, starred };
    },
    onSuccess: (_, { id, starred }) => {
      toast.success(starred ? "Note saved" : "Note unsaved");
      queryClient.invalidateQueries({ queryKey: queryKeys.notes });
      queryClient.invalidateQueries({ queryKey: queryKeys.note(id) });
    },
    onError: () => {
      toast.error("Failed to update note");
    },
  });
}

export function useDeleteNote() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(getToken, `${GATEWAY_URL}/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
    },
    onSuccess: () => {
      toast.success("Note deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.notes });
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });
}
