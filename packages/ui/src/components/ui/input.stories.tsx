import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"
import { Label } from "./label"

const meta: Meta = {
  title: "Components/Input",
  component: Input,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <Input type="email" placeholder="Email" className="max-w-sm" />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Input disabled type="email" placeholder="Email" className="max-w-sm" />
  ),
}

export const File: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" />
    </div>
  ),
}
