import type { Meta, StoryObj } from "@storybook/react"
import { ButtonGroup } from "./button-group"
import { Button } from "./button"

const meta: Meta = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
}
