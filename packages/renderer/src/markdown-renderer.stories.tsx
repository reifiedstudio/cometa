import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownRenderer } from "./markdown-renderer";

const meta: Meta<typeof MarkdownRenderer> = {
  title: "MarkdownRenderer",
  component: MarkdownRenderer,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Headings: Story = {
  args: {
    content: `# Heading 1
## Heading 2
### Heading 3

Regular paragraph text below headings.`,
  },
};

export const Tables: Story = {
  args: {
    content: `## Monthly Summary

| Month | Revenue | Expenses | Profit |
|-------|--------:|---------:|-------:|
| Jan   | R 120,000 | R 85,000 | R 35,000 |
| Feb   | R 135,000 | R 90,000 | R 45,000 |
| Mar   | R 142,000 | R 88,000 | R 54,000 |`,
  },
};

export const Lists: Story = {
  args: {
    content: `## Action Items

- Review Q1 financials
- Approve pending invoices
- Schedule board meeting

## Priority Order

1. Outstanding payments
2. Tax filing deadline
3. Budget review`,
  },
};

export const CodeBlocks: Story = {
  args: {
    content: `## Configuration

Inline code: \`npm install\`

\`\`\`json
{
  "name": "@cometa/renderer",
  "version": "0.1.0"
}
\`\`\``,
  },
};

export const LinksAndBlockquotes: Story = {
  args: {
    content: `## Notes

> This is an important observation from the quarterly review.
> Revenue growth exceeded projections by 15%.

For more details, see [the full report](https://example.com).

---

*Last updated: April 2026*`,
  },
};

export const MixedContent: Story = {
  args: {
    content: `## Financial Overview

*Q1 2026 Summary*

| Metric | Value |
|--------|------:|
| **Revenue** | R 450,000 |
| **Expenses** | R 310,000 |
| **Net Profit** | R 140,000 |

### Key Highlights

- Revenue up **18%** from Q4
- Three new contracts signed
- Operating costs reduced by \`R 15,000\`

> Management recommendation: increase marketing budget for Q2.

---

### Next Steps

1. Finalise budget allocation
2. Review staffing requirements
3. Submit tax filings by **30 April**`,
  },
};
