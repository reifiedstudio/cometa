import type { Meta, StoryObj } from "@storybook/react";
import { colors, fonts, fontWeights } from "./tokens";

const ColorSwatch = ({ name, value }: { name: string; value: string }) => {
  const isLight =
    value.startsWith("rgba(255") || ["#FFFFFF", "#F8F8F8", "#F1F1F1", "#EBEEF1"].includes(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: value,
          border: isLight ? "1px solid #D2D3D5" : "none",
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 14, color: "#212327" }}>
          {name}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 12, color: "#717983" }}>{value}</div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 40 }}>
    <h2
      style={{
        fontFamily: fonts.heading,
        fontSize: 24,
        fontWeight: 500,
        color: "#212327",
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: "2px solid #EBEEF1",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

const ColorGroup = ({ name, group }: { name: string; group: Record<string, string> }) => (
  <div style={{ marginBottom: 24 }}>
    <h3
      style={{
        fontFamily: fonts.body,
        fontSize: 14,
        fontWeight: 600,
        color: "#555A65",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
      }}
    >
      {name}
    </h3>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 4 }}>
      {Object.entries(group).map(([key, value]) => (
        <ColorSwatch key={key} name={key} value={value} />
      ))}
    </div>
  </div>
);

const StyleGuide = () => (
  <div style={{ padding: 32, maxWidth: 960, fontFamily: fonts.body }}>
    <h1
      style={{
        fontFamily: fonts.heading,
        fontSize: 36,
        fontWeight: 500,
        color: "#212327",
        marginBottom: 8,
      }}
    >
      Cometa Style Guide
    </h1>
    <p style={{ fontSize: 16, color: "#555A65", marginBottom: 48 }}>
      Design tokens extracted from cometa.co
    </p>

    <Section title="Colors">
      <ColorGroup name="Brand" group={colors.brand} />
      <ColorGroup name="Backgrounds" group={colors.background} />
      <ColorGroup name="Text" group={colors.text} />
      <ColorGroup name="Neutrals" group={colors.neutral} />
      <ColorGroup name="Accent" group={colors.accent} />
      <ColorGroup name="Overlays" group={colors.overlay} />
    </Section>

    <Section title="Typography">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(fonts).map(([name, value]) => (
          <div key={name}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#555A65",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              {name}
            </div>
            <div style={{ fontFamily: value, fontSize: 32, color: "#212327" }}>
              The quick brown fox jumps over the lazy dog
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: "#717983", marginTop: 4 }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Font Weights">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(fontWeights).map(([name, weight]) => (
          <div key={name} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 24,
                fontWeight: weight,
                color: "#212327",
                minWidth: 300,
              }}
            >
              {name} ({weight})
            </div>
            <div style={{ fontFamily: fonts.body, fontWeight: weight, fontSize: 16, color: "#555A65" }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>
    </Section>
  </div>
);

const meta: Meta = {
  title: "Style Guide/Tokens",
  component: StyleGuide,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
