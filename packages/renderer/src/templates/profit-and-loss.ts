import { formatZAR } from "./utils.js";

export function mdProfitAndLoss(data: {
  period: { from: string; to: string };
  months: string[];
  revenue: Record<string, Record<string, number>>;
  costOfSales: Record<string, Record<string, number>>;
  operatingExpenses: Record<string, Record<string, number>>;
  totals: {
    revenue: Record<string, number>;
    costOfSales: Record<string, number>;
    grossProfit: Record<string, number>;
    operatingExpenses: Record<string, number>;
    netProfit: Record<string, number>;
  };
}): string {
  const totalRev = Object.values(data.totals.revenue).reduce((s, v) => s + v, 0);
  const totalProfit = Object.values(data.totals.netProfit).reduce((s, v) => s + v, 0);

  const revenueLines = Object.entries(data.revenue)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | ${formatZAR(total)} |`;
    })
    .join("\n");

  const costLines = Object.entries(data.costOfSales)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | (${formatZAR(total)}) |`;
    })
    .join("\n");

  const expenseLines = Object.entries(data.operatingExpenses)
    .map(([name, months]) => {
      const total = Object.values(months).reduce((s, v) => s + v, 0);
      return `| ${name} | (${formatZAR(total)}) |`;
    })
    .join("\n");

  const shortMonths = data.months.map((m) => {
    const month = Number.parseInt(m.split("-")[1]);
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      month - 1
    ];
  });

  const chartData = shortMonths.map((m, i) => ({
    label: m,
    value: Math.round((data.totals.revenue[data.months[i]] ?? 0) / 1000),
  }));

  return `## Profit & Loss
*${data.period.from} to ${data.period.to}*

| | Total |
|---|---:|
| **Revenue** | **${formatZAR(totalRev)}** |
${revenueLines}
| **Cost of Sales** | **(${formatZAR(Object.values(data.totals.costOfSales).reduce((s, v) => s + v, 0))})** |
${costLines}
| **Gross Profit** | **${formatZAR(Object.values(data.totals.grossProfit).reduce((s, v) => s + v, 0))}** |
| **Operating Expenses** | **(${formatZAR(Object.values(data.totals.operatingExpenses).reduce((s, v) => s + v, 0))})** |
${expenseLines}
| **Net Profit** | **${formatZAR(totalProfit)}** |

\`\`\`chart
${JSON.stringify({ type: "bar", title: "Revenue by Month (R thousands)", data: chartData })}
\`\`\``;
}
