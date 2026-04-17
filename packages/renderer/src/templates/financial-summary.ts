import { formatZAR } from "./utils";

export function mdFinancialSummary(data: {
  accountsReceivable: number;
  accountsPayable: number;
  overdueInvoices: number;
  overdueAmount: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  period: { from: string; to: string };
}): string {
  const margin =
    data.totalRevenue > 0 ? ((data.netProfit / data.totalRevenue) * 100).toFixed(1) : "0";

  return `## Financial Summary
*${data.period.from} to ${data.period.to}*

| Metric | Amount |
|--------|--------|
| **Revenue** | ${formatZAR(data.totalRevenue)} |
| **Expenses** | ${formatZAR(data.totalExpenses)} |
| **Net Profit** | ${formatZAR(data.netProfit)} (${margin}% margin) |
| Accounts Receivable | ${formatZAR(data.accountsReceivable)} |
| Accounts Payable | ${formatZAR(data.accountsPayable)} |
| Overdue | ${data.overdueInvoices} invoices (${formatZAR(data.overdueAmount)}) |

\`\`\`chart
${JSON.stringify({ type: "pie", title: "Revenue vs Expenses", data: [{ label: "Net Profit", value: data.netProfit }, { label: "Expenses", value: data.totalExpenses }] })}
\`\`\``;
}
