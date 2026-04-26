"use client"

import * as React from "react"
import { ChevronDown, Clock, LayoutGrid, List, User } from "lucide-react"
import { cn } from "../lib/cn"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

// ── Types ──

type View = "grid" | "list"

interface CollectionContextValue {
  view: View
  setView: (view: View) => void
}

// ── Context ──

const CollectionContext = React.createContext<CollectionContextValue | null>(null)

function useCollectionView(): CollectionContextValue {
  const ctx = React.useContext(CollectionContext)
  if (!ctx) throw new Error("useCollectionView must be used within a CollectionProvider")
  return ctx
}

// ── Provider ──

interface CollectionProviderProps {
  children: React.ReactNode
  /** Controlled view state. */
  view?: View
  /** Callback when view changes. */
  onViewChange?: (view: View) => void
  /** Default view when uncontrolled. */
  defaultView?: View
}

/**
 * Provides grid/list view state to `ViewToggle` and `CollectionView`.
 * Wrap your page content with this at the level that makes sense.
 *
 * ```tsx
 * <CollectionProvider>
 *   <PageHeader title="Notes"><ViewToggle /></PageHeader>
 *   <CollectionView>...</CollectionView>
 * </CollectionProvider>
 * ```
 */
export function CollectionProvider({
  children,
  view: controlledView,
  onViewChange,
  defaultView = "grid",
}: CollectionProviderProps) {
  const [internalView, setInternalView] = React.useState<View>(defaultView)
  const view = controlledView ?? internalView
  const setView = onViewChange ?? setInternalView

  const value = React.useMemo(() => ({ view, setView }), [view, setView])

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}

// ── View Toggle ──

/**
 * Grid/list toggle buttons. Reads state from `CollectionProvider`.
 * Drop this anywhere inside the provider — PageHeader, toolbar, etc.
 */
export function ViewToggle({ className }: { className?: string }) {
  const { view, setView } = useCollectionView()

  return (
    <div className={cn("inline-flex items-center rounded-md border", className)}>
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="icon"
        className="size-8 rounded-r-none"
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="size-4" />
      </Button>
      <Button
        variant={view === "list" ? "secondary" : "ghost"}
        size="icon"
        className="size-8 rounded-l-none border-l"
        onClick={() => setView("list")}
      >
        <List className="size-4" />
      </Button>
    </div>
  )
}

// ── Collection View ──

interface CollectionViewProps {
  children: React.ReactNode
  /** Number of items to show initially. Enables "load more" when set. */
  pageSize?: number
  /** Label for the load more button. */
  loadMoreLabel?: string
  className?: string
}

/**
 * Container that switches between grid and list layout based on context.
 * Supports incremental loading via `pageSize`.
 *
 * ```tsx
 * <CollectionView pageSize={12}>
 *   {items.map(item => (
 *     <CollectionItem key={item.id} title={item.title} ... />
 *   ))}
 * </CollectionView>
 * ```
 */
export function CollectionView({
  children,
  pageSize,
  loadMoreLabel = "Load more",
  className,
}: CollectionViewProps) {
  const { view } = useCollectionView()
  const allItems = React.Children.toArray(children)
  const [visibleCount, setVisibleCount] = React.useState(pageSize ?? allItems.length)

  // Reset visible count when children change (e.g. filter applied)
  const childCount = allItems.length
  React.useEffect(() => {
    setVisibleCount(pageSize ?? childCount)
  }, [childCount, pageSize])

  const visibleItems = pageSize ? allItems.slice(0, visibleCount) : allItems
  const hasMore = pageSize ? visibleCount < allItems.length : false
  const remaining = allItems.length - visibleCount

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + (pageSize ?? 9), allItems.length))
  }

  const content = view === "list" ? (
    <div className={cn("divide-y rounded-lg border", className)}>
      {visibleItems}
    </div>
  ) : (
    <div className={cn("grid gap-3 md:grid-cols-2 lg:grid-cols-3", className)}>
      {visibleItems}
    </div>
  )

  return (
    <>
      {content}
      {hasMore && (
        <div className="flex items-center justify-center py-4">
          <Button variant="outline" size="lg" onClick={loadMore} className="w-full max-w-xs">
            <ChevronDown className="size-4" />
            Show more ({remaining})
          </Button>
        </div>
      )}
    </>
  )
}

// ── Collection Item ──

interface CollectionItemProps {
  title: string
  description?: string
  timestamp?: string
  /** Format timestamp as relative time (e.g. "3h ago"). Defaults to true. */
  relativeTime?: boolean
  href?: string
  /** Slot for icons/badges between title and actions (e.g. star icon) */
  indicator?: React.ReactNode
  /** Badge slot — shown next to title (e.g. status badge) */
  badge?: React.ReactNode
  /** Slot for action buttons (e.g. dropdown menu) */
  actions?: React.ReactNode
  /** Secondary label shown bottom-right (e.g. creator name/email) */
  meta?: string
  /** Extra info shown in footer area (e.g. "0/1 signers", expiry date) */
  footer?: React.ReactNode
  className?: string
  onClick?: () => void
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return new Date(iso).toLocaleDateString()
}

/**
 * A single item in a collection. Renders as a card in grid view
 * and a compact row in list view. Reads layout from `CollectionProvider`.
 */
export function CollectionItem({
  title,
  description,
  timestamp,
  relativeTime = true,
  href,
  indicator,
  badge,
  actions,
  meta,
  footer,
  className,
  onClick,
}: CollectionItemProps) {
  const { view } = useCollectionView()
  const timeLabel = timestamp
    ? relativeTime ? formatRelativeTime(timestamp) : new Date(timestamp).toLocaleDateString()
    : undefined

  const Wrapper = href ? "a" : "div"
  const wrapperProps = href ? { href } : {}

  if (view === "list") {
    return (
      <Wrapper
        {...wrapperProps}
        onClick={onClick}
        className={cn(
          "group flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50",
          className,
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{title}</p>
            {indicator}
            {badge}
          </div>
          {description && (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {footer}
        {meta && (
          <span className="shrink-0 text-xs text-muted-foreground">{meta}</span>
        )}
        {timeLabel && (
          <span className="shrink-0 text-xs text-muted-foreground">{timeLabel}</span>
        )}
        {actions}
      </Wrapper>
    )
  }

  return (
    <Wrapper {...wrapperProps} onClick={onClick}>
      <Card className={cn("group flex cursor-pointer flex-col transition-colors hover:bg-muted/50", className)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <CardTitle className="text-base truncate">{title}</CardTitle>
              {badge}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {indicator}
              {actions}
            </div>
          </div>
          {description && (
            <CardDescription className="line-clamp-2 min-h-[2.5rem]">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        {(timeLabel || meta || footer) && (
          <CardFooter className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {timeLabel && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="size-3" />
                  {timeLabel}
                </Badge>
              )}
              {footer}
            </div>
            {meta && (
              <Badge variant="secondary" className="text-xs">
                <User className="size-3" />
                {meta}
              </Badge>
            )}
          </CardFooter>
        )}
      </Card>
    </Wrapper>
  )
}
