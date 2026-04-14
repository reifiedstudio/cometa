import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  File,
  FileText,
  Filter,
  FolderOpen,
  Inbox,
  Loader2,
  Mail,
  MoreHorizontal,
  Pen,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";

const icons = {
  Navigation: { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, ExternalLink },
  Actions: { Plus, Edit, Trash2, Copy, Download, Upload, Send, Search, Filter },
  Status: { Check, AlertCircle, Clock, Loader2, Eye },
  Content: { File, FileText, FolderOpen, Inbox, Mail, Archive },
  UI: { X, MoreHorizontal, Settings, User, Pen },
};

function IconGrid({
  group,
  items,
}: {
  group: string;
  items: Record<string, React.ComponentType<{ size?: number; className?: string }>>;
}) {
  return (
    <div className="mb-10">
      <h3 className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
        {group}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {Object.entries(items).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-surface-secondary"
          >
            <Icon size={20} className="text-foreground" />
            <span className="text-xs text-foreground-muted">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconsPage() {
  return (
    <div className="max-w-4xl p-8 font-[family-name:var(--font-body)]">
      <h1 className="mb-2 text-3xl font-medium text-foreground font-[family-name:var(--font-heading)]">
        Icons
      </h1>
      <p className="mb-10 text-foreground-secondary">
        Using{" "}
        <a href="https://lucide.dev" className="text-accent underline" target="_blank" rel="noreferrer">
          Lucide React
        </a>
        . Default size 20px for UI, 16px for inline, 24px for emphasis.
      </p>

      {Object.entries(icons).map(([group, items]) => (
        <IconGrid key={group} group={group} items={items} />
      ))}

      <section className="mt-12">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground-muted">
          Sizes
        </h3>
        <div className="flex items-end gap-8">
          {[14, 16, 20, 24, 32].map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <FileText size={size} className="text-foreground" />
              <span className="text-xs text-foreground-muted">{size}px</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Icons",
  component: IconsPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};
