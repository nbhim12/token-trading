"use client";

import { memo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RealtimeTokenColumn } from "./RealtimeTokenColumn";
import { Tabs } from "@/components/atoms/Tabs";
import { Button } from "@/components/atoms/Button";
import { RefreshCw } from "@/components/atoms/Icon";
import { ConnectionStatusWithAction, LastUpdateTime } from "@/components/molecules/ConnectionStatus";
import { useRealtimeTokens } from "@/hooks/useRealtimeTokens";
import type { TokenStatus } from "@/lib/types";

interface RealtimeTokenTableProps {
  isLoading?: boolean;
  className?: string;
  onBuy?: (tokenId: string) => void;
  onFavorite?: (tokenId: string) => void;
  onViewDetails?: (tokenId: string) => void;
  onRefresh?: () => void;
  onReconnect?: () => void;
  favoriteIds?: Set<string>;
}

const TAB_ITEMS = [
  { value: "new", label: "New Pairs", icon: "🆕" },
  { value: "finalStretch", label: "Final Stretch", icon: "🏁" },
  { value: "migrated", label: "Migrated", icon: "✅" },
];

/**
 * Main token table with real-time updates from Redux
 * Reads tokens directly from Redux store instead of props
 */
export const RealtimeTokenTable = memo(function RealtimeTokenTable({
  isLoading = false,
  className,
  onBuy,
  onFavorite,
  onViewDetails,
  onRefresh,
  onReconnect,
  favoriteIds = new Set(),
}: RealtimeTokenTableProps) {
  const [activeTab, setActiveTab] = useState<TokenStatus>("new");
  const { newPairs, finalStretch, migrated } = useRealtimeTokens();

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
      {/* Header with refresh button and connection status */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-text-primary">Token Pulse</h1>
          <LastUpdateTime />
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatusWithAction onReconnect={onReconnect} />
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
        <RealtimeTokenColumn
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
        <RealtimeTokenColumn
          title="New Pairs"
          status="new"
          tokens={newPairs}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
        />
        <RealtimeTokenColumn
          title="Final Stretch"
          status="finalStretch"
          tokens={finalStretch}
          isLoading={isLoading}
          onBuy={onBuy}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
          favoriteIds={favoriteIds}
        />
        <RealtimeTokenColumn
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
