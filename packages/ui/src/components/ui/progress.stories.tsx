import type { Meta, StoryObj } from "@storybook/react"
import { Progress, ProgressLabel, ProgressValue } from "./progress"

const meta: Meta = {
  title: "Components/Progress",
  component: Progress,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Progress value={60} className="max-w-md" />,
}

export const WithLabel: Story = {
  render: () => (
    <Progress value={45} className="max-w-md">
      <ProgressLabel>Uploading</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
}
