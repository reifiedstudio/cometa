import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible"
import { Button } from "./button"
import { ChevronsUpDownIcon } from "lucide-react"

const meta: Meta = {
  title: "Components/Collapsible",
}
export default meta

type Story = StoryObj

export const Default: Story = {
  render: function CollapsibleStory() {
    const [open, setOpen] = useState(false)
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">3 repositories</h4>
          <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <ChevronsUpDownIcon className="size-4" />
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-2 text-sm">@base-ui/react</div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
}
