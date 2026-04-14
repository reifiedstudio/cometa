import type { Meta, StoryObj } from "@storybook/react"
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "./native-select"
import { Label } from "./label"

const meta: Meta = {
  title: "Components/NativeSelect",
  component: NativeSelect,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="fruit">Fruit</Label>
      <NativeSelect id="fruit">
        <NativeSelectOption value="">Select a fruit...</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="orange">Orange</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}
