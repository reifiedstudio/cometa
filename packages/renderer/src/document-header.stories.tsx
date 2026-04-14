import type { Meta, StoryObj } from "@storybook/react";
import { DocumentHeader } from "./document-header.js";

const meta: Meta<typeof DocumentHeader> = {
  title: "Document/Header",
  component: DocumentHeader,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DocumentHeader>;

export const Default: Story = {
  args: {
    company: {
      name: "Reified Studio",
      registrationNumber: "2024/123456/07",
    },
    title: "Service Agreement",
    reference: "REF-2026-0042",
    date: "14 April 2026",
  },
};

export const WithLogo: Story = {
  args: {
    company: {
      name: "Reified Studio",
      logo: "https://placehold.co/120x40/1a1a1a/ffffff?text=Reified",
      registrationNumber: "2024/123456/07",
    },
    title: "Non-Disclosure Agreement",
    reference: "NDA-2026-0015",
    date: "14 April 2026",
  },
};

export const Minimal: Story = {
  args: {
    company: { name: "Reified Studio" },
    title: "Invoice",
  },
};
