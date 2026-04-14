"use client";

import { fetchDocumentTypes } from "@/lib/api";
import { useEffect, useState } from "react";

export interface DocumentTypeInfo {
  slug: string;
  name: string;
  pluralName: string;
  badgeColor: string;
  isActive: boolean;
}

/**
 * Hook to fetch document types from the API.
 * Only active types are included in labels/plurals/colors used for filters.
 * All types (including archived) are available via `allTypes` for display purposes.
 */
export function useDocumentTypes() {
  const [allTypes, setAllTypes] = useState<DocumentTypeInfo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchDocumentTypes()
      .then((data) => {
        setAllTypes(data.types ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const activeTypes = allTypes.filter((t) => t.isActive);

  // Build maps from active types only (used for filters)
  const labels: Record<string, string> = {};
  const plurals: Record<string, string> = { all: "All" };
  const colors: Record<string, string> = {};

  for (const t of activeTypes) {
    labels[t.slug] = t.name;
    plurals[t.slug] = t.pluralName;
    colors[t.slug] = t.badgeColor;
  }

  // Also include archived types in labels/colors for display (e.g. badges on old docs)
  for (const t of allTypes) {
    if (!labels[t.slug]) labels[t.slug] = t.name;
    if (!colors[t.slug]) colors[t.slug] = t.badgeColor;
  }

  return { types: activeTypes, allTypes, loaded, labels, plurals, colors };
}
