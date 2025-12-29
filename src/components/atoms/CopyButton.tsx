"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "./Icon";
import { Tooltip } from "./Tooltip";

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: "sm" | "md";
  showTooltip?: boolean;
}

/**
 * Copy to clipboard button with success feedback
 */
export function CopyButton({
  value,
  className,
  size = "sm",
  showTooltip = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value]);

  const sizeStyles = {
    sm: "h-5 w-5 p-0.5",
    md: "h-6 w-6 p-1",
  };

  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  const button = (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "rounded text-text-tertiary hover:text-text-secondary hover:bg-bg-hover transition-colors",
        sizeStyles[size],
        className
      )}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className={cn(iconSize, "text-success")} />
      ) : (
        <Copy className={iconSize} />
      )}
    </button>
  );

  if (showTooltip) {
    return (
      <Tooltip content={copied ? "Copied!" : "Copy"}>
        {button}
      </Tooltip>
    );
  }

  return button;
}

/**
 * Truncated address with copy functionality
 */
export function CopyableAddress({
  address,
  chars = 4,
  className,
}: {
  address: string;
  chars?: number;
  className?: string;
}) {
  const truncated = `${address.slice(0, chars)}...${address.slice(-chars)}`;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-mono text-text-secondary">{truncated}</span>
      <CopyButton value={address} size="sm" />
    </span>
  );
}
