import type { Meta, StoryObj } from "@storybook/react";
import { DocumentShell } from "./document-shell";
import { MarkdownRenderer } from "./markdown-renderer";

const meta: Meta<typeof DocumentShell> = {
  title: "Document/Shell",
  component: DocumentShell,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DocumentShell>;

const company = {
  name: "Reified Studio",
  registrationNumber: "2024/123456/07",
  vatNumber: "4012345678",
  address: "123 Main Road, Cape Town, 8001",
  email: "hello@reified.studio",
  website: "reified.studio",
  phone: "+27 21 123 4567",
};

const serviceAgreementMd = `## 1. Services

The Service Provider agrees to provide the following services to the Client:

- Software development and consulting
- System architecture and design
- Technical project management

## 2. Term

This Agreement shall commence on **1 May 2026** and continue for a period of **12 months**, unless terminated earlier in accordance with the provisions of this Agreement.

## 3. Fees

| Service | Rate | Frequency |
|---------|-----:|-----------|
| Development | R 1,500/hr | Monthly |
| Consulting | R 2,000/hr | Monthly |
| Project Management | R 25,000 | Monthly retainer |

## 4. Payment Terms

- Invoices issued on the 1st of each month
- Payment due within **30 days** of invoice date
- Late payments subject to interest at **2% per month**

## 5. Confidentiality

Both parties agree to maintain the confidentiality of all proprietary information disclosed during the course of this Agreement.

## 6. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of the Republic of South Africa.`;

export const ServiceAgreement: Story = {
  args: {
    company,
    title: "Service Agreement",
    reference: "SA-2026-0042",
    date: "14 April 2026",
    confidential: true,
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio" },
      { name: "Jane Smith", role: "CEO", company: "Acme Corp" },
    ],
    children: <MarkdownRenderer content={serviceAgreementMd} />,
  },
};

const ndaMd = `## 1. Definition of Confidential Information

"Confidential Information" means any information disclosed by either party to the other, whether orally, in writing, or by inspection, that is designated as confidential or that reasonably should be understood to be confidential.

## 2. Obligations

The Receiving Party shall:

1. Hold all Confidential Information in strict confidence
2. Not disclose Confidential Information to any third party without prior written consent
3. Use Confidential Information solely for the purpose of evaluating the proposed business relationship
4. Return or destroy all Confidential Information upon request

## 3. Exclusions

This Agreement does not apply to information that:

- Is or becomes publicly available through no fault of the Receiving Party
- Was already in the possession of the Receiving Party prior to disclosure
- Is independently developed by the Receiving Party
- Is required to be disclosed by law or court order

## 4. Term

This Agreement shall remain in effect for a period of **2 years** from the date of execution.`;

export const NDA: Story = {
  args: {
    company,
    title: "Non-Disclosure Agreement",
    reference: "NDA-2026-0015",
    date: "14 April 2026",
    confidential: true,
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio" },
      { name: "Bob Johnson", role: "Contractor" },
    ],
    children: <MarkdownRenderer content={ndaMd} />,
  },
};

const invoiceMd = `## Invoice Details

| Description | Qty | Rate | Amount |
|-------------|----:|-----:|-------:|
| Software Development (April) | 80 hrs | R 1,500 | R 120,000 |
| Consulting | 10 hrs | R 2,000 | R 20,000 |
| Project Management | 1 | R 25,000 | R 25,000 |
| | | **Subtotal** | **R 165,000** |
| | | VAT (15%) | R 24,750 |
| | | **Total Due** | **R 189,750** |

### Banking Details

| | |
|---|---|
| **Bank** | First National Bank |
| **Account** | Reified Studio (Pty) Ltd |
| **Account No.** | 62812345678 |
| **Branch Code** | 250655 |
| **Reference** | INV-2026-0089 |`;

export const Invoice: Story = {
  args: {
    company,
    title: "Tax Invoice",
    reference: "INV-2026-0089",
    date: "1 April 2026",
    children: <MarkdownRenderer content={invoiceMd} />,
  },
};

export const SignedDocument: Story = {
  args: {
    company,
    title: "Service Agreement",
    reference: "SA-2026-0042",
    date: "14 April 2026",
    confidential: true,
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio", signedAt: "14 April 2026" },
      { name: "Jane Smith", role: "CEO", company: "Acme Corp", signedAt: "15 April 2026" },
    ],
    children: <MarkdownRenderer content={serviceAgreementMd} />,
  },
};
