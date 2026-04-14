import type { Meta, StoryObj } from "@storybook/react"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"
import { CalendarIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/HoverCard",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        render={
          <a href="#" className="text-sm font-medium underline underline-offset-4" />
        }
      >
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm text-muted-foreground">
              The React Framework -- created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
