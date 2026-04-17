import { formatZAR, statusEmoji } from "./utils";

export function mdInvoiceList(data: {
  invoices: {
    id: string;
    contact: string;
    date: string;
    status: string;
    total: number;
    type: string;
  }[];
  totalAmount: number;
  title?: string;
}): string {
  if (data.invoices.length === 0) {
    return `## ${data.title ?? "Invoices"}\n\nNo invoices found.`;
  }

  const rows = data.invoices
    .slice(0, 25)
    .map(
      (inv) =>
        `| ${inv.id} | ${inv.contact} | ${inv.date} | ${statusEmoji(inv.status)} ${inv.status} | ${formatZAR(inv.total)} |`,
    )
    .join("\n");

  const statusCounts: Record<string, number> = {};
  for (const inv of data.invoices) {
    statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
  }

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    label: status,
    value: count,
  }));

  return `## ${data.title ?? "Invoices"}
*${data.invoices.length} invoices — Total: ${formatZAR(data.totalAmount)}*

| Ref | Contact | Date | Status | Amount |
|-----|---------|------|--------|-------:|
${rows}
${data.invoices.length > 25 ? `\n*Showing 25 of ${data.invoices.length}*\n` : ""}
\`\`\`chart
${JSON.stringify({ type: "pie", title: "Invoice Status", data: chartData })}
\`\`\``;
}
