import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownRenderer } from "./markdown-renderer.js";
import { mdFinancialSummary } from "./templates/financial-summary.js";
import { mdProfitAndLoss } from "./templates/profit-and-loss.js";

const meta: Meta<typeof MarkdownRenderer> = {
  title: "Reports",
  component: MarkdownRenderer,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const FinancialSummary: Story = {
  args: {
    content: mdFinancialSummary({
      accountsReceivable: 285000,
      accountsPayable: 142000,
      overdueInvoices: 3,
      overdueAmount: 67500,
      totalRevenue: 450000,
      totalExpenses: 310000,
      netProfit: 140000,
      period: { from: "2026-01-01", to: "2026-03-31" },
    }),
  },
};

export const ProfitAndLoss: Story = {
  args: {
    content: mdProfitAndLoss({
      period: { from: "2026-01-01", to: "2026-03-31" },
      months: ["2026-01", "2026-02", "2026-03"],
      revenue: {
        "Professional Services": { "2026-01": 80000, "2026-02": 95000, "2026-03": 102000 },
        "Product Sales": { "2026-01": 40000, "2026-02": 40000, "2026-03": 40000 },
        Consulting: { "2026-01": 15000, "2026-02": 18000, "2026-03": 20000 },
      },
      costOfSales: {
        "Direct Labour": { "2026-01": 35000, "2026-02": 38000, "2026-03": 40000 },
        Materials: { "2026-01": 12000, "2026-02": 14000, "2026-03": 13000 },
      },
      operatingExpenses: {
        Salaries: { "2026-01": 45000, "2026-02": 45000, "2026-03": 45000 },
        Rent: { "2026-01": 15000, "2026-02": 15000, "2026-03": 15000 },
        Utilities: { "2026-01": 3000, "2026-02": 3200, "2026-03": 2800 },
      },
      totals: {
        revenue: { "2026-01": 135000, "2026-02": 153000, "2026-03": 162000 },
        costOfSales: { "2026-01": 47000, "2026-02": 52000, "2026-03": 53000 },
        grossProfit: { "2026-01": 88000, "2026-02": 101000, "2026-03": 109000 },
        operatingExpenses: { "2026-01": 63000, "2026-02": 63200, "2026-03": 62800 },
        netProfit: { "2026-01": 25000, "2026-02": 37800, "2026-03": 46200 },
      },
    }),
  },
};

export const CustomReport: Story = {
  args: {
    content: `## Sales Performance — Q1 2026

*Generated 14 April 2026*

| Region | Target | Actual | Variance |
|--------|-------:|-------:|---------:|
| **Gauteng** | R 200,000 | R 218,000 | +9% |
| **Western Cape** | R 150,000 | R 142,000 | -5.3% |
| **KZN** | R 100,000 | R 108,000 | +8% |

\`\`\`chart
${JSON.stringify({ type: "bar", title: "Actual vs Target by Region", data: [{ label: "Gauteng", value: 218000 }, { label: "Western Cape", value: 142000 }, { label: "KZN", value: 108000 }] })}
\`\`\`

### Key Takeaways

- Gauteng exceeded target by **R 18,000**
- Western Cape needs attention — missed by R 8,000
- Overall Q1 revenue: **R 468,000** (target: R 450,000)

> Next review scheduled for 15 July 2026.`,
  },
};
