import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./calendar"

const meta: Meta = {
  title: "Components/Calendar",
  component: Calendar,
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: function CalendarStory() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
    )
  },
}
