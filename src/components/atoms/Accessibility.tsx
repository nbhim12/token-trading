"use client";

import { cn } from "@/lib/utils";

interface VisuallyHiddenProps {
  children: React.ReactNode;
  /** If true, content becomes visible when focused */
  focusable?: boolean;
  className?: string;
}

/**
 * Visually hidden content for screen readers
 * Content is hidden from visual display but accessible to assistive technologies
 */
export function VisuallyHidden({
  children,
  focusable = false,
  className,
}: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        "[clip:rect(0,0,0,0)]",
        focusable && "focus:static focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:clip-auto",
        className
      )}
    >
      {children}
    </span>
  );
}

interface SkipLinkProps {
  /** ID of the target element to skip to */
  targetId: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Skip link for keyboard navigation accessibility
 * Allows users to skip to main content
 */
export function SkipLink({
  targetId,
  children = "Skip to main content",
  className,
}: SkipLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        // Visually hidden by default
        "absolute -top-10 left-0 z-[100]",
        // Visible on focus
        "focus:top-0 focus:left-4 focus:p-4",
        "focus:bg-accent-primary focus:text-white",
        "focus:rounded-b-lg focus:shadow-lg",
        "transition-all duration-200",
        "text-sm font-medium",
        className
      )}
    >
      {children}
    </a>
  );
}

interface LiveRegionProps {
  children?: React.ReactNode;
  /** Politeness level */
  politeness?: "polite" | "assertive" | "off";
  /** If true, the entire region is read when updated */
  atomic?: boolean;
  /** What types of changes should be announced */
  relevant?: "additions" | "removals" | "text" | "all";
  className?: string;
}

/**
 * ARIA live region for dynamic content announcements
 */
export function LiveRegion({
  children,
  politeness = "polite",
  atomic = true,
  relevant = "additions",
  className,
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}
