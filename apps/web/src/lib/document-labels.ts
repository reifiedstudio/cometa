/** Single source of truth for document type & status labels and badge colors */

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

export const statusLabels: Record<string, string> = {
  reviewed: "Reviewed",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  overdue: "Overdue",
  awaiting_signature: "Awaiting Signature",
};

export const statusBadgeColors: Record<string, string> = {
  reviewed: "bg-gray-100 text-gray-600",
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
