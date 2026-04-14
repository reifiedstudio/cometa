import type { Meta, StoryObj } from "@storybook/react";

const colors = {
  Brand: [
    { name: "brand", css: "var(--color-brand)", hex: "#D09305" },
    { name: "brand-bright", css: "var(--color-brand-bright)", hex: "#FFBB0D" },
    { name: "brand-light", css: "var(--color-brand-light)", hex: "#FFB300" },
  ],
  Surface: [
    { name: "surface", css: "var(--color-surface)", hex: "#FFFFFF" },
    { name: "surface-secondary", css: "var(--color-surface-secondary)", hex: "#F8F8F8" },
    { name: "surface-tertiary", css: "var(--color-surface-tertiary)", hex: "#F1F1F1" },
    { name: "surface-dark", css: "var(--color-surface-dark)", hex: "#141414" },
    { name: "surface-dark-alt", css: "var(--color-surface-dark-alt)", hex: "#1A1A1A" },
  ],
  Foreground: [
    { name: "foreground", css: "var(--color-foreground)", hex: "#212327" },
    { name: "foreground-secondary", css: "var(--color-foreground-secondary)", hex: "#555A65" },
    { name: "foreground-muted", css: "var(--color-foreground-muted)", hex: "#717983" },
    { name: "foreground-disabled", css: "var(--color-foreground-disabled)", hex: "#B4B6BC" },
    { name: "foreground-inverse", css: "var(--color-foreground-inverse)", hex: "#FFFFFF" },
  ],
  Neutral: [
    { name: "neutral-50", css: "var(--color-neutral-50)", hex: "#F8F8F8" },
    { name: "neutral-100", css: "var(--color-neutral-100)", hex: "#EBEEF1" },
    { name: "neutral-150", css: "var(--color-neutral-150)", hex: "#E0E0E0" },
    { name: "neutral-200", css: "var(--color-neutral-200)", hex: "#D2D3D5" },
    { name: "neutral-300", css: "var(--color-neutral-300)", hex: "#BCCACE" },
    { name: "neutral-400", css: "var(--color-neutral-400)", hex: "#B4B6BC" },
    { name: "neutral-500", css: "var(--color-neutral-500)", hex: "#80838B" },
    { name: "neutral-600", css: "var(--color-neutral-600)", hex: "#717983" },
    { name: "neutral-700", css: "var(--color-neutral-700)", hex: "#555A65" },
    { name: "neutral-800", css: "var(--color-neutral-800)", hex: "#464E58" },
    { name: "neutral-900", css: "var(--color-neutral-900)", hex: "#2C2F34" },
    { name: "neutral-950", css: "var(--color-neutral-950)", hex: "#212327" },
  ],
  Accent: [
    { name: "accent", css: "var(--color-accent)", hex: "#0075C9" },
    { name: "accent-light", css: "var(--color-accent-light)", hex: "#E6F1FA" },
    { name: "success", css: "var(--color-success)", hex: "#16A349" },
  ],
  Border: [
    { name: "border", css: "var(--color-border)", hex: "#EBEEF1" },
    { name: "border-strong", css: "var(--color-border-strong)", hex: "#D2D3D5" },
  ],
};

function Swatch({ name, hex }: { name: string; hex: string }) {
  const isLight = ["#FFFFFF", "#F8F8F8", "#F1F1F1", "#EBEEF1", "#E0E0E0", "#E6F1FA"].includes(hex);
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-12 w-12 shrink-0 rounded-lg"
        style={{
          backgroundColor: hex,
          border: isLight ? "1px solid var(--color-neutral-200)" : undefined,
        }}
      />
      <div>
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="font-mono text-xs text-foreground-muted">{hex}</div>
      </div>
    </div>
  );
}

function ColorGroup({ name, swatches }: { name: string; swatches: typeof colors.Brand }) {
  return (
    <div className="mb-10">
      <h3 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
        {name}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {swatches.map((s) => (
          <Swatch key={s.name} name={s.name} hex={s.hex} />
        ))}
      </div>
    </div>
  );
}

function ColorsPage() {
  return (
    <div className="max-w-4xl p-8 font-[family-name:var(--font-body)]">
      <h1 className="mb-2 text-3xl font-medium text-foreground font-[family-name:var(--font-heading)]">
        Colors
      </h1>
      <p className="mb-10 text-foreground-secondary">
        Design tokens defined as CSS custom properties in <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-sm">globals.css</code>. Use via Tailwind utilities like <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-sm">bg-brand</code> or <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-sm">text-foreground-muted</code>.
      </p>
      {Object.entries(colors).map(([group, swatches]) => (
        <ColorGroup key={group} name={group} swatches={swatches} />
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Colors",
  component: ColorsPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
