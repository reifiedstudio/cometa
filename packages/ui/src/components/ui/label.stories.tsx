import type { Meta, StoryObj } from "@storybook/react"
import { Label } from "./label"
import { Checkbox } from "./checkbox"

const meta: Meta = {
  title: "Components/Label",
  component: Label,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Label htmlFor="email">Email address</Label>,
}

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}
