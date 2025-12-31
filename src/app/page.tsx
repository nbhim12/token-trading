"use client";

import { useState, useCallback, useEffect } from "react";
import { RealtimeTokenTable } from "@/components/organisms/RealtimeTokenTable";
import { ErrorBoundaryEnhanced } from "@/components/organisms/ErrorBoundaryEnhanced";
import { LoadingState } from "@/components/organisms/LoadingState";
import { SkeletonPage } from "@/components/atoms/SkeletonTable";
import { Spinner } from "@/components/atoms/Shimmer";
import { generateAllMockData } from "@/services/mockData";
import { useWebSocketMock } from "@/hooks/useWebSocket";
import { useProgressiveLoad, useLoadingState } from "@/hooks/useProgressiveLoad";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTokens, selectAllTokens, selectIsConnected } from "@/features/tokens";
import { Badge } from "@/components/atoms/Badge";
import type { Token } from "@/lib/types";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const allTokens = useAppSelector(selectAllTokens);
  const isConnected = useAppSelector(selectIsConnected);
  
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<Error | null>(null);

  // Progressive loading for initial data
  const {
    data: loadedTokens,
    isLoading,
    isLoadingMore,
    progress,
    reload,
  } = useProgressiveLoad<Token>({
    fetchFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockData = generateAllMockData(15);
      return [...mockData.newPairs, ...mockData.finalStretch, ...mockData.migrated];
    },
    batchSize: 10,
    batchDelay: 100,
    autoStart: true,
  });

  // Refresh loading state with minimum display time
  const { isLoading: isRefreshing, startLoading, stopLoading } = useLoadingState(400);

  // Sync loaded tokens to Redux
  useEffect(() => {
    if (loadedTokens.length > 0) {
      dispatch(setTokens(loadedTokens));
    }
  }, [loadedTokens, dispatch]);

  // WebSocket mock for real-time updates
  const { reconnect } = useWebSocketMock({
    tokens: allTokens,
    enabled: !isLoading && allTokens.length > 0,
    interval: 2000,
  });

  // Handlers
  const handleRefresh = useCallback(() => {
    startLoading();
    setError(null);
    
    // Simulate refresh with potential error
    setTimeout(() => {
      try {
        const newData = generateAllMockData(15);
        dispatch(setTokens([...newData.newPairs, ...newData.finalStretch, ...newData.migrated]));
        stopLoading();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to refresh"));
        stopLoading();
      }
    }, 600);
  }, [dispatch, startLoading, stopLoading]);

  const handleBuy = useCallback((tokenId: string) => {
    console.log("Buy token:", tokenId);
    // TODO: Implement buy modal
  }, []);

  const handleFavorite = useCallback((tokenId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(tokenId)) {
        next.delete(tokenId);
      } else {
        next.add(tokenId);
      }
      return next;
    });
  }, []);

  const handleViewDetails = useCallback((tokenId: string) => {
    console.log("View details:", tokenId);
    // TODO: Implement details modal
  }, []);

  // Show full page skeleton during initial load
  if (isLoading && loadedTokens.length === 0) {
    return <SkeletonPage />;
  }

  return (
    <main className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-border-primary bg-bg-secondary/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold text-text-primary hidden sm:block">
              Axiom Trade
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors hidden md:block">
              Discover
            </span>
            <span className="text-sm text-accent-primary font-medium cursor-pointer">
              Pulse
            </span>
            <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors hidden md:block">
              Trackers
            </span>
          </nav>

          <div className="flex items-center gap-3">
            {/* Loading/refresh indicator */}
            {(isLoadingMore || isRefreshing) && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Spinner size="sm" className="text-accent-primary" />
                <span className="text-xs hidden sm:inline">
                  {isRefreshing ? "Refreshing..." : `Loading ${progress}%`}
                </span>
              </div>
            )}
            
            {/* Connection status */}
            <Badge
              variant={isConnected ? "success" : "danger"}
              size="sm"
              withDot
            >
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress bar for loading more */}
      {isLoadingMore && (
        <div className="h-0.5 bg-bg-tertiary">
          <div
            className="h-full bg-accent-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ErrorBoundaryEnhanced onError={(err) => setError(err)} resetKey={allTokens.length}>
          <LoadingState
            isLoading={false}
            error={error}
            onRetry={() => {
              setError(null);
              reload();
            }}
          >
            <RealtimeTokenTable
              isLoading={isRefreshing}
              onBuy={handleBuy}
              onFavorite={handleFavorite}
              onViewDetails={handleViewDetails}
              onRefresh={handleRefresh}
              onReconnect={reconnect}
              favoriteIds={favoriteIds}
            />
          </LoadingState>
        </ErrorBoundaryEnhanced>
      </div>

      {/* Footer */}
      <footer className="h-10 border-t border-border-primary bg-bg-secondary/50 flex items-center justify-center">
        <p className="text-xs text-text-tertiary">
          Token Trading Demo • Built with Next.js 16 + Redux Toolkit
        </p>
      </footer>
    </main>
  );
}
