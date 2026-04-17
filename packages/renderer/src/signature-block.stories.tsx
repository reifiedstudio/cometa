import type { Meta, StoryObj } from "@storybook/react";
import { SignatureBlock } from "./signature-block";

const meta: Meta<typeof SignatureBlock> = {
  title: "Document/SignatureBlock",
  component: SignatureBlock,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SignatureBlock>;

export const TwoSigners: Story = {
  args: {
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio" },
      { name: "Jane Smith", role: "Client", company: "Acme Corp" },
    ],
  },
};

export const SingleSigner: Story = {
  args: {
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio", email: "daniel@reified.studio" },
    ],
  },
};

export const ThreeSigners: Story = {
  args: {
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio" },
      { name: "Jane Smith", role: "Legal Counsel", company: "Acme Corp" },
      { name: "Bob Johnson", role: "Witness" },
    ],
  },
};

export const WithSigned: Story = {
  args: {
    title: "Executed",
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio", signedAt: "14 April 2026" },
      { name: "Jane Smith", role: "Client", company: "Acme Corp", signedAt: "14 April 2026" },
    ],
  },
};

export const FourSigners: Story = {
  args: {
    signers: [
      { name: "Daniel Lourie", role: "Director", company: "Reified Studio" },
      { name: "Jane Smith", role: "CEO", company: "Acme Corp" },
      { name: "Bob Johnson", role: "Witness" },
      { name: "Sarah Williams", role: "Notary Public" },
    ],
  },
};
