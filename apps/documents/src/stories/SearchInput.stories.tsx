import { SearchInput } from "@/components/ui/search-input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SearchInput> = {
  title: "UI/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};

export const CustomPlaceholder: Story = {
  args: { placeholder: "Search invoices..." },
};
