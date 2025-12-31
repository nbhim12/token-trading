"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { TokenRow, TokenCard } from "@/components/molecules/TokenRow";
import { SortableHeader } from "@/components/molecules/SortableHeader";
import { SkeletonRow, SkeletonCard } from "@/components/atoms/Skeleton";
import { Badge } from "@/components/atoms/Badge";
import { RefreshCw } from "@/components/atoms/Icon";
import { useTableSort } from "@/hooks/useTableSort";
import type { Token, TokenStatus } from "@/lib/types";

interface TokenColumnProps {
  title: string;
  status: TokenStatus;
  tokens: Token[];
  isLoading?: boolean;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  favoriteIds?: Set<string>;
  variant?: "table" | "card";
}

const STATUS_ICONS: Record<TokenStatus, string> = {
  new: "🆕",
  finalStretch: "🏁",
  migrated: "✅",
};

const STATUS_LABELS: Record<TokenStatus, string> = {
  new: "New Pairs",
  finalStretch: "Final Stretch",
  migrated: "Migrated",
};

/**
 * Token column displaying a list of tokens with a specific status
 * Supports table and card view variants
 */
export const TokenColumn = memo(function TokenColumn({
  title,
  status,
  tokens,
  isLoading = false,
  className,
  onBuy,
  onFavorite,
  onViewDetails,
  favoriteIds = new Set(),
  variant = "table",
}: TokenColumnProps) {
  const { sortedData, sortConfig, handleSort } = useTableSort<Token>(tokens, {
    key: "createdAt",
    direction: "desc",
  });

  const currentSortKey = sortConfig?.key ?? null;
  const currentDirection = sortConfig?.direction ?? null;

  if (variant === "card") {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <ColumnHeader
          title={title}
          status={status}
          count={tokens.length}
          isLoading={isLoading}
        />

        {/* Card List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          ) : sortedData.length === 0 ? (
            <EmptyState status={status} />
          ) : (
            sortedData.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onBuy={onBuy}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <ColumnHeader
        title={title}
        status={status}
        count={tokens.length}
        isLoading={isLoading}
      />

      {/* Table Header */}
      <div className="flex items-center px-4 py-2 border-b border-border-primary bg-bg-secondary/30 text-xs">
        <div className="w-[180px]">
          <SortableHeader
            label="Token"
            sortKey="name"
            currentSortKey={currentSortKey}
            currentDirection={currentDirection}
            onSort={handleSort}
          />
        </div>
        <div className="w-[90px] text-right">
          <SortableHeader
            label="Price"
            sortKey="price"
            currentSortKey={currentSortKey}
            currentDirection={currentDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="w-[70px] text-right hidden md:block">
          <SortableHeader
            label="MCap"
            sortKey="marketCap"
            currentSortKey={currentSortKey}
            currentDirection={currentDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="w-[60px] text-right hidden lg:block">
          <SortableHeader
            label="Liq"
            sortKey="liquidity"
            currentSortKey={currentSortKey}
            currentDirection={currentDirection}
            onSort={handleSort}
            align="right"
          />
        </div>
        <div className="w-[80px] text-center">
          <SortableHeader
            label="Progress"
            sortKey="bondingProgress"
            currentSortKey={currentSortKey}
            currentDirection={currentDirection}
            onSort={handleSort}
            align="center"
          />
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} columns={5} />)
        ) : sortedData.length === 0 ? (
          <EmptyState status={status} />
        ) : (
          sortedData.map((token) => (
            <CompactTokenRow
              key={token.id}
              token={token}
              onBuy={onBuy}
              onFavorite={onFavorite}
              onViewDetails={onViewDetails}
              isFavorite={favoriteIds.has(token.id)}
            />
          ))
        )}
      </div>
    </div>
  );
});

/**
 * Column header with title, count, and status indicator
 */
const ColumnHeader = memo(function ColumnHeader({
  title,
  status,
  count,
  isLoading,
}: {
  title: string;
  status: TokenStatus;
  count: number;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary bg-bg-secondary">
      <div className="flex items-center gap-2">
        <span className="text-lg">{STATUS_ICONS[status]}</span>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <Badge variant={status} size="sm">
          {count}
        </Badge>
      </div>
      {isLoading && (
        <RefreshCw className="h-4 w-4 text-text-tertiary animate-spin" />
      )}
    </div>
  );
});

/**
 * Compact token row for column view
 */
const CompactTokenRow = memo(function CompactTokenRow({
  token,
  onBuy,
  onFavorite,
  onViewDetails,
  isFavorite,
}: {
  token: Token;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  isFavorite?: boolean;
}) {
  return (
    <TokenRow
      token={token}
      variant="compact"
      onBuy={onBuy}
      onFavorite={onFavorite}
      onViewDetails={onViewDetails}
      isFavorite={isFavorite}
      showActions={false}
    />
  );
});

/**
 * Empty state when no tokens match
 */
const EmptyState = memo(function EmptyState({
  status,
}: {
  status: TokenStatus;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">{STATUS_ICONS[status]}</span>
      <p className="text-sm text-text-secondary">No {STATUS_LABELS[status].toLowerCase()} found</p>
      <p className="text-xs text-text-tertiary mt-1">Check back soon!</p>
    </div>
  );
});
