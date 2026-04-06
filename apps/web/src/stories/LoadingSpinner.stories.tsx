import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "UI/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 16, className: "py-8" },
};

export const Large: Story = {
  args: { size: 32 },
};
