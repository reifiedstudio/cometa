import type { Meta, StoryObj } from "@storybook/react";
import { NoteCreatedEmail } from "../index";
import { EmailPreview } from "./email-preview";

const meta: Meta<typeof EmailPreview> = {
  title: "Notes",
  component: EmailPreview,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof EmailPreview>;

export const NoteCreated: Story = {
  args: {
    name: "Note Created",
    subject: "Note created: World Coffee Guide",
    email: (
      <NoteCreatedEmail
        title="World Coffee Guide — Beans, Brews & Culture"
        snippet="A tour of the planet's best coffee cultures, beans, and brewing methods. Coffee is the second most traded commodity on Earth..."
        viewUrl="https://notes.daniellourie.me/view/note-123"
      />
    ),
  },
};
