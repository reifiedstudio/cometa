import type { Meta, StoryObj } from "@storybook/react"
import { Kbd, KbdGroup } from "./kbd"

const meta: Meta = {
  title: "Components/Kbd",
  component: Kbd,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Kbd>⌘K</Kbd>,
}

export const Group: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
}
