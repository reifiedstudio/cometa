import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Body>
        <p className="text-sm text-foreground">A simple card with just a body.</p>
      </Card.Body>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Signers</Card.Title>
        <Button variant="ghost" size="xs">
          <Plus />
          Add
        </Button>
      </Card.Header>
      <Card.Body>
        <p className="text-sm text-muted-foreground">2 of 3 have signed this document.</p>
      </Card.Body>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Header>
        <Card.Title>Recent activity</Card.Title>
        <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </Card.Header>
    </Card>
  ),
};

export const SummaryCard: Story = {
  render: () => (
    <Card className="w-96">
      <Card.Body>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold text-foreground">2 of 3 signed</p>
            <p className="text-sm text-muted-foreground mt-0.5">1 signature remaining</p>
          </div>
          <span className="text-xs text-muted-foreground">Due 12 Apr</span>
        </div>
      </Card.Body>
    </Card>
  ),
};
