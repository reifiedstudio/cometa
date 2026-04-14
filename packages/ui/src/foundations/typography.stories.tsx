import type { Meta, StoryObj } from "@storybook/react";

const sample = "The quick brown fox jumps over the lazy dog";

function TypeScale({
  label,
  className,
  text = sample,
}: {
  label: string;
  className: string;
  text?: string;
}) {
  return (
    <div className="flex items-baseline gap-6 border-b border-border py-4">
      <div className="w-32 shrink-0 text-xs font-medium text-foreground-muted">{label}</div>
      <div className={className}>{text}</div>
    </div>
  );
}

function TypographyPage() {
  return (
    <div className="max-w-4xl p-8 font-[family-name:var(--font-body)]">
      <h1 className="mb-2 text-3xl font-medium text-foreground font-[family-name:var(--font-heading)]">
        Typography
      </h1>
      <p className="mb-10 text-foreground-secondary">
        Two font families — <strong>Aeonik</strong> for headings and <strong>Inter</strong> for body
        text. Accessed via{" "}
        <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-sm">
          font-[family-name:var(--font-heading)]
        </code>{" "}
        and the default sans stack.
      </p>

      <section className="mb-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Heading Scale (Aeonik)
        </h2>
        <div className="font-[family-name:var(--font-heading)]">
          <TypeScale label="Display" className="text-5xl font-medium text-foreground" />
          <TypeScale label="H1" className="text-4xl font-medium text-foreground" />
          <TypeScale label="H2" className="text-3xl font-medium text-foreground" />
          <TypeScale label="H3" className="text-2xl font-medium text-foreground" />
          <TypeScale label="H4" className="text-xl font-medium text-foreground" />
          <TypeScale label="H5" className="text-lg font-medium text-foreground" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Body Scale (Inter)
        </h2>
        <TypeScale label="Body Large" className="text-lg text-foreground" />
        <TypeScale label="Body" className="text-base text-foreground" />
        <TypeScale label="Body Small" className="text-sm text-foreground" />
        <TypeScale label="Caption" className="text-xs text-foreground-muted" />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Weights
        </h2>
        <TypeScale label="Light (300)" className="text-lg font-light text-foreground" />
        <TypeScale label="Regular (400)" className="text-lg font-normal text-foreground" />
        <TypeScale label="Medium (500)" className="text-lg font-medium text-foreground" />
        <TypeScale label="Semibold (600)" className="text-lg font-semibold text-foreground" />
        <TypeScale label="Bold (700)" className="text-lg font-bold text-foreground" />
      </section>

      <section>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Text Colors
        </h2>
        <TypeScale label="Primary" className="text-base text-foreground" text="Primary text for main content" />
        <TypeScale label="Secondary" className="text-base text-foreground-secondary" text="Secondary text for supporting info" />
        <TypeScale label="Muted" className="text-base text-foreground-muted" text="Muted text for timestamps, hints" />
        <TypeScale label="Disabled" className="text-base text-foreground-disabled" text="Disabled text for inactive elements" />
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Typography",
  component: TypographyPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
