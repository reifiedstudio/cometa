import type { Meta, StoryObj } from "@storybook/react";
import { DocumentFooter } from "./document-footer";

const meta: Meta<typeof DocumentFooter> = {
  title: "Document/Footer",
  component: DocumentFooter,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DocumentFooter>;

export const Default: Story = {
  args: {
    company: {
      name: "Reified Studio",
      address: "123 Main Road, Cape Town, 8001",
      registrationNumber: "2024/123456/07",
      vatNumber: "4012345678",
      website: "reified.studio",
      email: "hello@reified.studio",
      phone: "+27 21 123 4567",
    },
  },
};

export const Confidential: Story = {
  args: {
    company: {
      name: "Reified Studio",
      address: "123 Main Road, Cape Town, 8001",
      registrationNumber: "2024/123456/07",
      email: "hello@reified.studio",
    },
    confidential: true,
  },
};

export const Minimal: Story = {
  args: {
    company: {
      name: "Reified Studio",
    },
  },
};
