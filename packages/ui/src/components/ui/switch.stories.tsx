import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "./switch"
import { Label } from "./label"

const meta: Meta = {
  title: "Components/Switch",
  component: Switch,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" size="sm" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="disabled" disabled />
      <Label htmlFor="disabled">Disabled</Label>
    </div>
  ),
}
