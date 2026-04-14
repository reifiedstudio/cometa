import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import type { Meta, StoryObj } from "@storybook/react";
import { FileText, PenLine, Trash2, Upload } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "UI/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="border border-[#EBEEF1] rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Simple: Story = {
  args: { title: "Documents", icon: <FileText size={20} /> },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader title="Documents" icon={<FileText size={20} />}>
      <SearchInput />
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg"
      >
        <Upload size={14} />
        Upload
      </button>
    </PageHeader>
  ),
};

export const Signatures: Story = {
  render: () => (
    <PageHeader title="Signatures" icon={<PenLine size={20} />}>
      <SearchInput />
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#212327] rounded-lg"
      >
        <Upload size={14} />
        Upload
      </button>
    </PageHeader>
  ),
};

export const Trash: Story = {
  args: { title: "Trash", icon: <Trash2 size={20} /> },
};
