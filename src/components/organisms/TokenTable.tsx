"use client";

import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TokenColumn } from "./TokenColumn";
import { Tabs } from "@/components/atoms/Tabs";
import { Button } from "@/components/atoms/Button";
import { RefreshCw } from "@/components/atoms/Icon";
import type { Token, TokenStatus } from "@/lib/types";

interface TokenTableProps {
  newPairs: Token[];
  finalStretch: Token[];
  migrated: Token[];
  isLoading?: boolean;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  onRefresh?: () => void;
  favoriteIds?: Set<string>;
}

const TAB_ITEMS = [
  { value: "new", label: "New Pairs", icon: "🆕" },
  { value: "finalStretch", label: "Final Stretch", icon: "🏁" },
  { value: "migrated", label: "Migrated", icon: "✅" },
];

/**
 * Main token table with three columns
 * Responsive: shows tabs on mobile, columns on desktop
 */
export const TokenTable = memo(function TokenTable({
  newPairs,
  finalStretch,
  migrated,
  isLoading = false,
  className,
  onBuy,
  onFavorite,
  onViewDetails,
  onRefresh,
  favoriteIds = new Set(),
}: TokenTableProps) {
  const [activeTab, setActiveTab] = useState<TokenStatus>("new");

  // Mobile tab view data
  const getActiveTokens = useCallback(() => {
    switch (activeTab) {
      case "new":
        return newPairs;
      case "finalStretch":
        return finalStretch;
      case "migrated":
        return migrated;
      default:
        return newPairs;
    }
  }, [activeTab, newPairs, finalStretch, migrated]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
        <h1 className="text-lg font-semibold text-text-primary">Token Pulse</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Mobile: Tab navigation */}
      <div className="lg:hidden px-4 py-2 border-b border-border-primary bg-bg-secondary/30">
        <Tabs
          items={TAB_ITEMS.map((tab) => ({
            value: tab.value,
            label: tab.label,
            count:
              tab.value === "new"
                ? newPairs.length
                : tab.value === "finalStretch"
                  ? finalStretch.length
                  : migrated.length,
          }))}
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TokenStatus)}
        />
      </div>

      {/* Mobile: Single column view */}
      <div className="lg:hidden flex-1 overflow-hidden">
        <TokenColumn
          title={TAB_ITEMS.find((t) => t.value === activeTab)?.label ?? "Tokens"}
          status={activeTab}
          tokens={getActiveTokens()}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
          variant="card"
        />
      </div>

      {/* Desktop: Three column view */}
      <div className="hidden lg:grid lg:grid-cols-3 flex-1 overflow-hidden divide-x divide-border-primary">
        <TokenColumn
          title="New Pairs"
          status="new"
          tokens={newPairs}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
        />
        <TokenColumn
          title="Final Stretch"
          status="finalStretch"
          tokens={finalStretch}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
        />
        <TokenColumn
          title="Migrated"
          status="migrated"
          tokens={migrated}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
        />
      </div>
    </div>
  );
});

/**
 * Simplified token table for single column display
 */
export const TokenTableSingle = memo(function TokenTableSingle({
  tokens,
  status,
  title,
  isLoading = false,
  className,
  onBuy,
  onViewDetails,
}: {
  tokens: Token[];
  status: TokenStatus;
  title: string;
  isLoading?: boolean;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
}) {
  return (
    <div className={cn("rounded-xl border border-border-primary bg-bg-secondary overflow-hidden", className)}>
      <TokenColumn
        title={title}
        status={status}
        tokens={tokens}
        isLoading={isLoading}
        onBuy={onBuy}
        onViewDetails={onViewDetails}
      />
    </div>
  );
});
