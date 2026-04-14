export function formatZAR(amount: number): string {
  const abs = Math.abs(amount);
  return `R ${abs.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function statusEmoji(status: string): string {
  const map: Record<string, string> = {
    completed: "✅",
    paid: "✅",
    approved: "✅",
    signed: "✅",
    processing: "🔄",
    assigned: "🔄",
    authorised: "🔵",
    active: "🔵",
    pending: "⏳",
    queued: "⏳",
    awaiting_approval: "⏳",
    draft: "📝",
    failed: "❌",
    overdue: "🔴",
    rejected: "❌",
  };
  return map[status] ?? "⚪";
}
