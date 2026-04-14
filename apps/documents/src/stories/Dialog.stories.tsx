import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The document will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button variant="destructive" size="sm">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Add signer</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add signer</DialogTitle>
          <DialogDescription>
            They&apos;ll receive an email with a secure link to sign this document.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Email address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full text-sm h-9 px-3 rounded-lg border bg-muted/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ),
};
