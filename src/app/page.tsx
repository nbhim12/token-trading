"use client";

import { useState, useCallback, useEffect } from "react";
import { RealtimeTokenTable } from "@/components/organisms/RealtimeTokenTable";
import { ErrorBoundary } from "@/components/organisms/ErrorBoundary";
import { generateAllMockData } from "@/services/mockData";
import { useWebSocketMock } from "@/hooks/useWebSocket";
import { useAppDispatch, useAppSelector } from "@/store";
import { setTokens, selectAllTokens, selectIsConnected } from "@/features/tokens";
import { Badge } from "@/components/atoms/Badge";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const allTokens = useAppSelector(selectAllTokens);
  const isConnected = useAppSelector(selectIsConnected);
  
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Initialize mock data
  useEffect(() => {
    const data = generateAllMockData(15);
    dispatch(setTokens([...data.newPairs, ...data.finalStretch, ...data.migrated]));
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // WebSocket mock for real-time updates
  const { reconnect } = useWebSocketMock({
    tokens: allTokens,
    enabled: !isLoading,
    interval: 2000,
  });

  // Handlers
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateAllMockData(15);
      dispatch(setTokens([...newData.newPairs, ...newData.finalStretch, ...newData.migrated]));
      setIsLoading(false);
    }, 500);
  }, [dispatch]);

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
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary onReset={handleRefresh}>
          <RealtimeTokenTable
            isLoading={isLoading}
            onBuy={handleBuy}
            onFavorite={handleFavorite}
            onViewDetails={handleViewDetails}
            onRefresh={handleRefresh}
            onReconnect={reconnect}
            favoriteIds={favoriteIds}
          />
        </ErrorBoundary>
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
