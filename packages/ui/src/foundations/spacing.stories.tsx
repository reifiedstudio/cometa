import type { Meta, StoryObj } from "@storybook/react";

const spacingScale = [
  { name: "0.5", px: "2px", tw: "p-0.5" },
  { name: "1", px: "4px", tw: "p-1" },
  { name: "1.5", px: "6px", tw: "p-1.5" },
  { name: "2", px: "8px", tw: "p-2" },
  { name: "3", px: "12px", tw: "p-3" },
  { name: "4", px: "16px", tw: "p-4" },
  { name: "5", px: "20px", tw: "p-5" },
  { name: "6", px: "24px", tw: "p-6" },
  { name: "8", px: "32px", tw: "p-8" },
  { name: "10", px: "40px", tw: "p-10" },
  { name: "12", px: "48px", tw: "p-12" },
  { name: "16", px: "64px", tw: "p-16" },
];

const radii = [
  { name: "sm", value: "var(--radius-sm)", tw: "rounded-sm" },
  { name: "md", value: "var(--radius-md)", tw: "rounded-md" },
  { name: "lg", value: "var(--radius-lg)", tw: "rounded-lg" },
  { name: "xl", value: "var(--radius-xl)", tw: "rounded-xl" },
  { name: "full", value: "9999px", tw: "rounded-full" },
];

function SpacingPage() {
  return (
    <div className="max-w-4xl p-8 font-[family-name:var(--font-body)]">
      <h1 className="mb-2 text-3xl font-medium text-foreground font-[family-name:var(--font-heading)]">
        Spacing & Radius
      </h1>
      <p className="mb-10 text-foreground-secondary">
        Standard Tailwind spacing scale and custom border radii.
      </p>

      <section className="mb-12">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Spacing Scale
        </h2>
        <div className="space-y-3">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="w-16 shrink-0 text-right text-sm font-medium text-foreground-muted">
                {s.name}
              </div>
              <div
                className="h-4 rounded-sm bg-accent"
                style={{ width: s.px === "2px" ? "2px" : s.px }}
              />
              <div className="text-xs text-foreground-muted">
                {s.px} — <code className="rounded bg-surface-tertiary px-1 py-0.5">{s.tw}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Border Radius
        </h2>
        <div className="flex flex-wrap gap-6">
          {radii.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="h-16 w-16 border-2 border-accent bg-accent-light"
                style={{ borderRadius: r.value }}
              />
              <div className="text-sm font-medium text-foreground">{r.name}</div>
              <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-xs text-foreground-muted">
                {r.tw}
              </code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Spacing & Radius",
  component: SpacingPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
