"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PopoverProps {
  /** Trigger element */
  trigger: ReactNode;
  /** Popover content */
  children: ReactNode;
  /** Placement relative to trigger */
  placement?: "top" | "bottom" | "left" | "right";
  /** Alignment along the placement axis */
  align?: "start" | "center" | "end";
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether popover is controlled */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Custom class for popover content */
  className?: string;
  /** Whether to close on outside click */
  closeOnOutsideClick?: boolean;
}

/**
 * Popover component with positioning and portal rendering
 */
export function Popover({
  trigger,
  children,
  placement = "bottom",
  align = "start",
  offset = 8,
  open: controlledOpen,
  onOpenChange,
  className,
  closeOnOutsideClick = true,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen ?? internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (onOpenChange) {
        onOpenChange(value);
      } else {
        setInternalOpen(value);
      }
    },
    [onOpenChange]
  );

  // Calculate position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;

    // Calculate base position based on placement
    switch (placement) {
      case "top":
        top = triggerRect.top - contentRect.height - offset;
        break;
      case "bottom":
        top = triggerRect.bottom + offset;
        break;
      case "left":
        left = triggerRect.left - contentRect.width - offset;
        break;
      case "right":
        left = triggerRect.right + offset;
        break;
    }

    // Calculate alignment
    if (placement === "top" || placement === "bottom") {
      switch (align) {
        case "start":
          left = triggerRect.left;
          break;
        case "center":
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          break;
        case "end":
          left = triggerRect.right - contentRect.width;
          break;
      }
    } else {
      switch (align) {
        case "start":
          top = triggerRect.top;
          break;
        case "center":
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          break;
        case "end":
          top = triggerRect.bottom - contentRect.height;
          break;
      }
    }

    // Viewport boundary checks
    if (left < 8) left = 8;
    if (left + contentRect.width > viewportWidth - 8) {
      left = viewportWidth - contentRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + contentRect.height > viewportHeight - 8) {
      top = viewportHeight - contentRect.height - 8;
    }

    setPosition({ top, left });
  }, [placement, align, offset]);

  // Update position on open
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure content is rendered
      requestAnimationFrame(updatePosition);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeOnOutsideClick, setOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  const handleTriggerClick = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="inline-flex"
      >
        {trigger}
      </div>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={contentRef}
            className={cn(
              "fixed z-50 bg-bg-secondary border border-border-primary rounded-lg shadow-xl",
              "animate-scale-in origin-top-left",
              className
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}

/**
 * Dropdown menu built on Popover
 */
interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      align="end"
      className={cn("min-w-[180px] py-1", className)}
    >
      <div onClick={() => setOpen(false)}>{children}</div>
    </Popover>
  );
}

/**
 * Dropdown menu item
 */
export function DropdownMenuItem({
  children,
  onClick,
  disabled,
  destructive,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full px-3 py-2 text-left text-sm transition-colors",
        "hover:bg-bg-hover focus:bg-bg-hover focus:outline-none",
        disabled && "opacity-50 cursor-not-allowed",
        destructive ? "text-danger hover:text-danger" : "text-text-primary",
        className
      )}
    >
      {children}
    </button>
  );
}

/**
 * Dropdown menu separator
 */
export function DropdownMenuSeparator() {
  return <div className="my-1 border-t border-border-primary" />;
}
