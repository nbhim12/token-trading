"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/components/atoms/Button";
import { Tooltip } from "@/components/atoms/Tooltip";
import {
  ExternalLink,
  Star,
  MoreHorizontal,
  TrendingUp,
} from "@/components/atoms/Icon";

interface ActionCellProps {
  tokenId: string;
  tokenAddress: string;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  isFavorite?: boolean;
}

/**
 * Action cell with quick action buttons
 * Includes buy, favorite, and more actions
 */
export const ActionCell = memo(function ActionCell({
  tokenId,
  tokenAddress,
  className,
  onBuy,
  onFavorite,
  onViewDetails,
  isFavorite = false,
}: ActionCellProps) {
  const handleBuy = useCallback(() => {
    onBuy?.(tokenId);
  }, [onBuy, tokenId]);

  const handleFavorite = useCallback(() => {
    onFavorite?.(tokenId);
  }, [onFavorite, tokenId]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(tokenId);
  }, [onViewDetails, tokenId]);

  const explorerUrl = `https://solscan.io/token/${tokenAddress}`;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Quick Buy Button */}
      <Tooltip content="Quick Buy">
        <Button
          size="sm"
          variant="success"
          onClick={handleBuy}
          className="h-7 px-2"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Buy
        </Button>
      </Tooltip>

      {/* Favorite Button */}
      <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          className={cn(isFavorite && "text-yellow-400")}
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </IconButton>
      </Tooltip>

      {/* External Link */}
      <Tooltip content="View on Explorer">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <IconButton variant="ghost" size="sm" asChild>
            <span>
              <ExternalLink className="h-4 w-4" />
            </span>
          </IconButton>
        </a>
      </Tooltip>

      {/* More Actions */}
      <Tooltip content="More actions">
        <IconButton variant="ghost" size="sm" onClick={handleViewDetails}>
          <MoreHorizontal className="h-4 w-4" />
        </IconButton>
      </Tooltip>
    </div>
  );
});

/**
 * Compact action buttons for mobile
 */
export const ActionCellCompact = memo(function ActionCellCompact({
  tokenId,
  onBuy,
  className,
}: {
  tokenId: string;
  onBuy?: (tokenId: string) => void;
  className?: string;
}) {
  const handleBuy = useCallback(() => {
    onBuy?.(tokenId);
  }, [onBuy, tokenId]);

  return (
    <Button
      size="sm"
      variant="primary"
      onClick={handleBuy}
      className={cn("h-8 px-4", className)}
    >
      Buy
    </Button>
  );
});

/**
 * Row hover actions that appear on hover
 */
export const HoverActions = memo(function HoverActions({
  tokenId,
  onBuy,
  onViewDetails,
  className,
}: {
  tokenId: string;
  onBuy?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        "bg-bg-secondary/90 backdrop-blur-sm rounded-lg px-2 py-1",
        className
      )}
    >
      <Button
        size="sm"
        variant="primary"
        onClick={() => onBuy?.(tokenId)}
        className="h-7"
      >
        Buy
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => onViewDetails?.(tokenId)}
        className="h-7"
      >
        Details
      </Button>
    </div>
  );
});
