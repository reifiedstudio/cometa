import type { Meta, StoryObj } from "@storybook/react"
import { Spinner } from "./spinner"

const meta: Meta = {
  title: "Components/Spinner",
  component: Spinner,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Spinner />,
}

export const Large: Story = {
  render: () => <Spinner className="size-8" />,
}

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  ),
}
