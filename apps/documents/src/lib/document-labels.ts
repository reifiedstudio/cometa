/** Document type & status labels and badge colors.
 *  Static defaults are used for initial render; pages should fetch
 *  dynamic types from /api/document-types for the full list.
 */

// ── Static defaults (used as fallback) ──

export const typeLabels: Record<string, string> = {
  invoice: "Invoice",
  receipt: "Receipt",
  contract: "Contract",
  delivery_note: "Delivery Note",
  bill: "Bill",
};

export const typePluralLabels: Record<string, string> = {
  all: "All",
  invoice: "Invoices",
  receipt: "Receipts",
  contract: "Contracts",
  delivery_note: "Delivery Notes",
  bill: "Bills",
};

export const typeBadgeColors: Record<string, string> = {
  invoice: "bg-orange-100 text-orange-700",
  receipt: "bg-emerald-100 text-emerald-700",
  contract: "bg-blue-100 text-blue-700",
  delivery_note: "bg-red-100 text-red-700",
  bill: "bg-sky-100 text-sky-700",
};

// ── Status labels (these are system-defined, not user-configurable) ──

export const statusLabels: Record<string, string> = {
  reviewed: "Reviewed",
  approved: "Approved",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

export const statusBadgeColors: Record<string, string> = {
  reviewed: "bg-gray-100 text-gray-600",
  approved: "bg-emerald-100 text-emerald-600",
  pending: "bg-orange-100 text-orange-600",
  processing: "bg-blue-100 text-blue-600",
  rejected: "bg-red-100 text-red-600",
  overdue: "bg-red-100 text-red-600",
  awaiting_signature: "bg-blue-100 text-blue-600",
};

export const flagLabels: Record<string, string> = {
  verified: "Verified",
  duplicate: "Duplicate",
};

export const flagBadgeColors: Record<string, string> = {
  verified: "bg-emerald-100 text-emerald-600",
  duplicate: "bg-red-100 text-red-600",
};

// ── Helper to merge DB types into the static maps ──

export interface DocumentTypeRecord {
  slug: string;
  name: string;
  pluralName: string;
  badgeColor: string;
}

export function mergeDocumentTypes(types: DocumentTypeRecord[]) {
  const labels: Record<string, string> = { ...typeLabels };
  const plurals: Record<string, string> = { all: "All", ...typePluralLabels };
  const colors: Record<string, string> = { ...typeBadgeColors };

  for (const t of types) {
    labels[t.slug] = t.name;
    plurals[t.slug] = t.pluralName;
    colors[t.slug] = t.badgeColor;
  }

  return { labels, plurals, colors };
}
