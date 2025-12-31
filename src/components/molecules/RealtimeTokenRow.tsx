"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { TokenNameCell } from "./TokenNameCell";
import { RealtimePriceCell } from "./RealtimePriceCell";
import { MarketCapCell, VolumeCell, LiquidityCell } from "./PriceCell";
import { HoldersCell, AgeCell } from "./StatsCell";
import { ProgressCell } from "./ProgressCell";
import { ActionCell, HoverActions } from "./ActionCell";
import { useTokenPrice } from "@/hooks/useRealtimeTokens";
import type { Token } from "@/lib/types";

interface RealtimeTokenRowProps {
  token: Token;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  isFavorite?: boolean;
  showActions?: boolean;
  variant?: "default" | "compact";
}

/**
 * Token row with real-time price updates from Redux
 * Shows flash animation when price changes
 */
export const RealtimeTokenRow = memo(function RealtimeTokenRow({
  token,
  className,
  onBuy,
  onFavorite,
  onViewDetails,
  isFavorite = false,
  showActions = true,
  variant = "default",
}: RealtimeTokenRowProps) {
  const { direction, isFlashing } = useTokenPrice(token.id);

  // Use direction and isFlashing directly for row flash
  const rowFlashClass = isFlashing && direction === "up"
    ? "bg-success/5"
    : isFlashing && direction === "down"
      ? "bg-danger/5"
      : "";

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group relative flex items-center gap-4 px-4 py-3",
          "border-b border-border-primary hover:bg-bg-hover/50 transition-all duration-300 cursor-pointer",
          rowFlashClass,
          className
        )}
        onClick={() => onViewDetails?.(token.id)}
      >
        <TokenNameCell token={token} size="sm" showAddress={false} className="flex-1 min-w-0" />
        <RealtimePriceCell tokenId={token.id} size="sm" />
        <ProgressCell value={token.bondingProgress} variant="compact" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 px-4 py-3",
        "border-b border-border-primary hover:bg-bg-hover/50 transition-all duration-300",
        rowFlashClass,
        className
      )}
    >
      {/* Token Name */}
      <div className="w-[200px] min-w-[180px]">
        <TokenNameCell token={token} />
      </div>

      {/* Real-time Price */}
      <div className="w-[100px] text-right">
        <RealtimePriceCell tokenId={token.id} />
      </div>

      {/* Market Cap */}
      <div className="w-[80px] text-right hidden lg:block">
        <MarketCapCell value={token.marketCap} />
      </div>

      {/* Volume */}
      <div className="w-[80px] text-right hidden xl:block">
        <VolumeCell value={token.volume24h} />
      </div>

      {/* Liquidity */}
      <div className="w-[80px] text-right hidden lg:block">
        <LiquidityCell value={token.liquidity} />
      </div>

      {/* Holders */}
      <div className="w-[70px] text-right hidden md:block">
        <HoldersCell count={token.holders} />
      </div>

      {/* Age */}
      <div className="w-[60px] text-right hidden md:block">
        <AgeCell createdAt={token.createdAt} />
      </div>

      {/* Bonding Progress */}
      <div className="w-[100px] hidden sm:block">
        <ProgressCell value={token.bondingProgress} showLabel />
      </div>

      {/* Actions */}
      {showActions && (
        <div className="w-[140px] flex justify-end">
          <ActionCell
            tokenId={token.id}
            tokenAddress={token.address}
            onBuy={onBuy}
            onFavorite={onFavorite}
            onViewDetails={onViewDetails}
            isFavorite={isFavorite}
          />
        </div>
      )}

      {/* Hover Actions */}
      {!showActions && (
        <HoverActions
          tokenId={token.id}
          onBuy={onBuy}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
});

/**
 * Real-time token card for mobile view
 */
export const RealtimeTokenCard = memo(function RealtimeTokenCard({
  token,
  className,
  onBuy,
  onViewDetails,
}: {
  token: Token;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
}) {
  const { direction, isFlashing } = useTokenPrice(token.id);

  const cardFlashClass = isFlashing && direction === "up"
    ? "border-success/50 shadow-success/10 shadow-lg"
    : isFlashing && direction === "down"
      ? "border-danger/50 shadow-danger/10 shadow-lg"
      : "";

  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border-primary bg-bg-secondary",
        "hover:border-border-secondary transition-all duration-300 cursor-pointer",
        cardFlashClass,
        className
      )}
      onClick={() => onViewDetails?.(token.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <TokenNameCell token={token} size="md" showStatus showAddress={false} />
        <RealtimePriceCell tokenId={token.id} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex justify-between py-1.5 px-2 rounded bg-bg-tertiary">
          <span className="text-text-tertiary">MCap</span>
          <MarketCapCell value={token.marketCap} className="text-xs" />
        </div>
        <div className="flex justify-between py-1.5 px-2 rounded bg-bg-tertiary">
          <span className="text-text-tertiary">Liq</span>
          <LiquidityCell value={token.liquidity} className="text-xs" />
        </div>
        <div className="flex justify-between py-1.5 px-2 rounded bg-bg-tertiary">
          <span className="text-text-tertiary">Holders</span>
          <HoldersCell count={token.holders} className="text-xs" />
        </div>
        <div className="flex justify-between py-1.5 px-2 rounded bg-bg-tertiary">
          <span className="text-text-tertiary">Age</span>
          <AgeCell createdAt={token.createdAt} className="text-xs" />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <ProgressCell value={token.bondingProgress} variant="detailed" />
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onBuy?.(token.id);
        }}
        className="w-full py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium transition-colors"
      >
        Quick Buy
      </button>
    </div>
  );
});
