import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, PenLine, Trash2, Search } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Documents: Story = {
  args: {
    icon: <FileText size={48} strokeWidth={1} />,
    message: "No documents found",
    hint: "Upload one to get started.",
  },
};

export const Signatures: Story = {
  args: {
    icon: <PenLine size={48} strokeWidth={1} />,
    message: "No signature requests yet",
    hint: 'Open a document and click "Send for Signature" to get started',
  },
};

export const Trash: Story = {
  args: {
    icon: <Trash2 size={48} strokeWidth={1} />,
    message: "Trash is empty",
  },
};

export const SearchNoResults: Story = {
  args: {
    icon: <Search size={48} strokeWidth={1} />,
    message: "No results found",
    hint: "Try a different search term.",
  },
};
