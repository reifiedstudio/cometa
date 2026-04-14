import { SkeletonList } from "@/components/ui/skeleton-list";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SkeletonList> = {
  title: "UI/SkeletonList",
  component: SkeletonList,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SkeletonList>;

export const Default: Story = {};

export const ThreeRows: Story = {
  args: { rows: 3 },
};
