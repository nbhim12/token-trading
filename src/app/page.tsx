"use client";

import { useState, useCallback, useEffect } from "react";
import { RealtimeTokenTable } from "@/components/organisms/RealtimeTokenTable";
import { ErrorBoundaryEnhanced } from "@/components/organisms/ErrorBoundaryEnhanced";
import { LoadingState } from "@/components/organisms/LoadingState";
import { SkeletonPage } from "@/components/atoms/SkeletonTable";
import { Spinner } from "@/components/atoms/Shimmer";
import { SkipLink, LiveRegion } from "@/components/atoms/Accessibility";
import { generateAllMockData } from "@/services/mockData";
import { useWebSocketMock } from "@/hooks/useWebSocket";
import { useLoadingState } from "@/hooks/useProgressiveLoad";
import { useLoadingAnnouncement } from "@/hooks/useAccessibility";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTokens, selectAllTokens, selectIsConnected } from "@/features/tokens";
import { Badge } from "@/components/atoms/Badge";
import { TokenModal } from "@/components/organisms/TokenModal";
import type { Token } from "@/lib/types";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const allTokens = useAppSelector(selectAllTokens);
  const isConnected = useAppSelector(selectIsConnected);
  
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<Error | null>(null);
  const [modalToken, setModalToken] = useState<Token | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mockData = generateAllMockData(15);
        const tokens = [...mockData.newPairs, ...mockData.finalStretch, ...mockData.migrated];
        dispatch(setTokens(tokens));
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load"));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  // Refresh loading state with minimum display time
  const { isLoading: isRefreshing, startLoading, stopLoading } = useLoadingState(400);

  // Screen reader announcements for loading states
  useLoadingAnnouncement(isLoading, "Loading tokens");
  useLoadingAnnouncement(isRefreshing, "Refreshing data");

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
    const token = allTokens.find((t) => t.id === tokenId) || null;
    setModalToken(token);
    setModalOpen(true);
  }, [allTokens]);

  // Show full page skeleton during initial load
  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <SkipLink targetId="main-content" />
      
      {/* Live region for dynamic announcements */}
      <LiveRegion>
        {isConnected ? "Real-time updates active" : "Offline mode"}
      </LiveRegion>

      <main className="min-h-screen bg-bg-primary flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 border-b border-border-primary bg-bg-secondary/80 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between px-4 max-w-[1920px] mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center hover-glow">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold text-text-primary hidden sm:block">
                Axiom Trade
              </span>
            </div>
            
            <nav className="flex items-center gap-6" role="navigation" aria-label="Main navigation">
              <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors hidden md:block focus-ring" tabIndex={0}>
                Discover
              </span>
              <span className="text-sm text-accent-primary font-medium cursor-pointer focus-ring" tabIndex={0} aria-current="page">
                Pulse
              </span>
              <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors hidden md:block focus-ring" tabIndex={0}>
                Trackers
              </span>
            </nav>

            <div className="flex items-center gap-3">
              {/* Loading/refresh indicator */}
              {isRefreshing && (
                <div className="flex items-center gap-2 text-text-secondary" role="status" aria-live="polite">
                  <Spinner size="sm" className="text-accent-primary" />
                  <span className="text-xs hidden sm:inline">Refreshing...</span>
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

        {/* Main content */}
        <div id="main-content" className="flex-1 overflow-hidden" tabIndex={-1}>
          <ErrorBoundaryEnhanced onError={(err) => setError(err)} resetKey={allTokens.length}>
            <LoadingState
              isLoading={false}
              error={error}
              onRetry={() => {
                setError(null);
                handleRefresh();
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
              <TokenModal
                token={modalToken}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onBuy={handleBuy}
                isFavorite={modalToken ? favoriteIds.has(modalToken.id) : false}
                onToggleFavorite={handleFavorite}
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
    </>
  );
}
