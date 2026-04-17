import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChartBlock } from "./chart-block";
import type { ChartDef } from "./chart-types";

export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type Segment = { type: "md"; value: string } | { type: "chart"; def: ChartDef };

/** Split markdown into alternating text / chart segments. */
function parseSegments(content: string): Segment[] {
  const segments: Segment[] = [];
  const re = /```chart\n([\s\S]*?)```/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(content)) !== null) {
    if (match.index > last) {
      segments.push({ type: "md", value: content.slice(last, match.index) });
    }
    try {
      const def: ChartDef = JSON.parse(match[1].trim());
      segments.push({ type: "chart", def });
    } catch {
      // If JSON is invalid, render as regular code block
      segments.push({ type: "md", value: match[0] });
    }
    last = match.index + match[0].length;
  }

  if (last < content.length) {
    segments.push({ type: "md", value: content.slice(last) });
  }

  return segments;
}

const mdComponents = {
  table({ children }: { children?: React.ReactNode }) {
    return (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    );
  },
  thead({ children }: { children?: React.ReactNode }) {
    return <thead className="border-b bg-muted/50">{children}</thead>;
  },
  th({ children }: { children?: React.ReactNode }) {
    return (
      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
        {children}
      </th>
    );
  },
  td({ children }: { children?: React.ReactNode }) {
    return <td className="border-b px-3 py-2">{children}</td>;
  },
  h1({ children }: { children?: React.ReactNode }) {
    return <h1 className="mt-8 mb-4 text-2xl font-bold">{children}</h1>;
  },
  h2({ children }: { children?: React.ReactNode }) {
    return <h2 className="mt-6 mb-3 text-xl font-semibold">{children}</h2>;
  },
  h3({ children }: { children?: React.ReactNode }) {
    return <h3 className="mt-5 mb-2 text-lg font-medium">{children}</h3>;
  },
  p({ children }: { children?: React.ReactNode }) {
    return <p className="mb-3 leading-relaxed">{children}</p>;
  },
  ul({ children }: { children?: React.ReactNode }) {
    return <ul className="mb-3 ml-6 list-disc space-y-1">{children}</ul>;
  },
  ol({ children }: { children?: React.ReactNode }) {
    return <ol className="mb-3 ml-6 list-decimal space-y-1">{children}</ol>;
  },
  blockquote({ children }: { children?: React.ReactNode }) {
    return (
      <blockquote className="my-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    );
  },
  a({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  hr() {
    return <hr className="my-6 border-border" />;
  },
  code({ children }: { children?: React.ReactNode }) {
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{children}</code>
    );
  },
  pre({ children }: { children?: React.ReactNode }) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">{children}</pre>
    );
  },
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const segments = React.useMemo(() => parseSegments(content), [content]);

  return (
    <div className={className}>
      {segments.map((seg, i) =>
        seg.type === "chart" ? (
          <ChartBlock key={i} def={seg.def} />
        ) : (
          <Markdown key={i} remarkPlugins={[remarkGfm]} components={mdComponents}>
            {seg.value}
          </Markdown>
        ),
      )}
    </div>
  );
}
