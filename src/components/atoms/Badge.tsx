import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-bg-tertiary text-text-secondary",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        danger: "bg-danger/10 text-danger border border-danger/20",
        info: "bg-info/10 text-info border border-info/20",
        new: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        finalStretch: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        migrated: "bg-green-500/10 text-green-400 border border-green-500/20",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0",
        md: "text-xs px-2 py-0.5",
        lg: "text-sm px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional dot indicator before text */
  withDot?: boolean;
}

/**
 * Badge component for displaying status labels and tags
 * Supports multiple color variants and sizes
 */
export function Badge({
  className,
  variant,
  size,
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {withDot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "danger" && "bg-danger",
            variant === "info" && "bg-info",
            variant === "new" && "bg-blue-400",
            variant === "finalStretch" && "bg-yellow-400",
            variant === "migrated" && "bg-green-400",
            (!variant || variant === "default") && "bg-text-secondary"
          )}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Status badge specifically for token status
 */
export function StatusBadge({
  status,
  className,
}: {
  status: "new" | "finalStretch" | "migrated";
  className?: string;
}) {
  const labels = {
    new: "New",
    finalStretch: "Final Stretch",
    migrated: "Migrated",
  };

  return (
    <Badge variant={status} size="sm" withDot className={className}>
      {labels[status]}
    </Badge>
  );
}
