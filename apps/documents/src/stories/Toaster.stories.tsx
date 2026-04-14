import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";

const meta: Meta = {
  title: "UI/Toaster",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj;

export const AllToasts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Default toast")}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Document saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("3 new updates available")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Your session expires soon")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Failed to upload")}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast.loading("Uploading...");
          setTimeout(() => toast.success("Done", { id }), 1500);
        }}
      >
        Loading → success
      </Button>
    </div>
  ),
};
