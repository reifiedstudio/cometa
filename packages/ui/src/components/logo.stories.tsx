import type { Meta, StoryObj } from "@storybook/react";
import { Logo, LogoIcon } from "./logo";

const meta: Meta = {
  title: "Components/Logo",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

export const Wordmark: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 rounded-lg bg-background p-6">
        <Logo />
      </div>
      <div className="flex items-center gap-4 rounded-lg bg-foreground p-6">
        <Logo variant="light" />
      </div>
    </div>
  ),
};

export const Icon: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 rounded-lg bg-background p-6">
        <LogoIcon />
        <LogoIcon className="h-8 w-auto" />
        <LogoIcon className="h-12 w-auto" />
      </div>
      <div className="flex items-center gap-4 rounded-lg bg-foreground p-6">
        <LogoIcon variant="light" />
        <LogoIcon variant="light" className="h-8 w-auto" />
        <LogoIcon variant="light" className="h-12 w-auto" />
      </div>
    </div>
  ),
};

export const Combined: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 rounded-lg bg-background p-6">
        <LogoIcon className="h-8 w-auto" />
        <Logo className="h-5 w-auto" />
      </div>
      <div className="flex items-center gap-3 rounded-lg bg-foreground p-6">
        <LogoIcon variant="light" className="h-8 w-auto" />
        <Logo variant="light" className="h-5 w-auto" />
      </div>
    </div>
  ),
};
