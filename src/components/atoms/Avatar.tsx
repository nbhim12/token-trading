"use client";

import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

const sizeMap = {
  sm: { container: "h-6 w-6", text: "text-xs", pixels: 24 },
  md: { container: "h-8 w-8", text: "text-sm", pixels: 32 },
  lg: { container: "h-10 w-10", text: "text-base", pixels: 40 },
  xl: { container: "h-12 w-12", text: "text-lg", pixels: 48 },
};

/**
 * Avatar component with image and fallback support
 * Optimized with Next.js Image for performance
 */
export const Avatar = memo(function Avatar({
  src,
  alt,
  size = "md",
  fallback,
  className,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const { container, text } = sizeMap[size];

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Generate fallback from alt text
  const fallbackText = fallback || alt.slice(0, 2).toUpperCase();

  // Generate consistent background color from string
  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "bg-purple-500/20 text-purple-400",
      "bg-blue-500/20 text-blue-400",
      "bg-green-500/20 text-green-400",
      "bg-yellow-500/20 text-yellow-400",
      "bg-red-500/20 text-red-400",
      "bg-pink-500/20 text-pink-400",
      "bg-indigo-500/20 text-indigo-400",
      "bg-cyan-500/20 text-cyan-400",
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-medium",
          container,
          getColorFromString(alt),
          className
        )}
      >
        <span className={text}>{fallbackText}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-bg-tertiary",
        container,
        className
      )}
    >
      {/* Using img tag for external placeholder images (SVG format) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
});

/**
 * Token avatar with optional badge/indicator
 */
export const TokenAvatar = memo(function TokenAvatar({
  src,
  symbol,
  size = "md",
  showBadge = false,
  badgeColor = "bg-success",
  className,
}: {
  src: string | null;
  symbol: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  badgeColor?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Avatar src={src} alt={symbol} size={size} fallback={symbol} />
      {showBadge && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-primary",
            badgeColor
          )}
        />
      )}
    </div>
  );
});
