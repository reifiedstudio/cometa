import { cn } from "@/lib/utils";
import type * as React from "react";

/**
 * Card primitive — a bordered, rounded container used across the app for
 * grouped content blocks (panels, list shells, info boxes).
 *
 * Compose like:
 *
 *   <Card>
 *     <Card.Header>
 *       <Card.Title>Signers</Card.Title>
 *       <Button>Add</Button>
 *     </Card.Header>
 *     <Card.Body>...</Card.Body>
 *   </Card>
 *
 * Header and Body are both optional — for simple boxes you can put content
 * directly inside <Card>.
 */
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-card overflow-hidden", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border-b flex-shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;

export { Card };
