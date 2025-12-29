"use client";

import { memo, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

const sizeMap = {
  sm: { container: "h-6 w-6", text: "text-xs" },
  md: { container: "h-8 w-8", text: "text-sm" },
  lg: { container: "h-10 w-10", text: "text-base" },
  xl: { container: "h-12 w-12", text: "text-lg" },
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
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        sizes={`(max-width: 768px) ${sizeMap[size].container}, ${sizeMap[size].container}`}
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
