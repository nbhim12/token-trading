"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import {
  selectNewTokens,
  selectFinalStretchTokens,
  selectMigratedTokens,
  selectAllTokens,
  selectLastUpdate,
  selectIsConnected,
} from "@/features/tokens";
import type { Token } from "@/lib/types";

interface UseRealtimeTokensReturn {
  newPairs: Token[];
  finalStretch: Token[];
  migrated: Token[];
  allTokens: Token[];
  lastUpdate: number | null;
  isConnected: boolean;
}

/**
 * Hook for accessing real-time token data from Redux
 */
export function useRealtimeTokens(): UseRealtimeTokensReturn {
  const newPairs = useAppSelector(selectNewTokens);
  const finalStretch = useAppSelector(selectFinalStretchTokens);
  const migrated = useAppSelector(selectMigratedTokens);
  const allTokens = useAppSelector(selectAllTokens);
  const lastUpdate = useAppSelector(selectLastUpdate);
  const isConnected = useAppSelector(selectIsConnected);

  return {
    newPairs,
    finalStretch,
    migrated,
    allTokens,
    lastUpdate,
    isConnected,
  };
}

/**
 * Hook for a single token's real-time price with direction tracking
 * Uses scheduled state updates to comply with React 19 rules
 */
export function useTokenPrice(tokenId: string) {
  const allTokens = useAppSelector(selectAllTokens);
  const token = useMemo(
    () => allTokens.find((t) => t.id === tokenId),
    [allTokens, tokenId]
  );

  const [direction, setDirection] = useState<"up" | "down" | "stable">("stable");
  const [isFlashing, setIsFlashing] = useState(false);
  const prevPriceRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use effect with setTimeout to schedule state updates (React 19 compliant)
  useEffect(() => {
    if (!token) return;

    const currentPrice = token.price;
    const prevPrice = prevPriceRef.current;

    // Initialize previous price on first render
    if (prevPrice === null) {
      prevPriceRef.current = currentPrice;
      return;
    }

    // Price hasn't changed
    if (prevPrice === currentPrice) return;

    // Schedule state update via setTimeout (async, React 19 compliant)
    const updateTimeout = setTimeout(() => {
      const newDirection = currentPrice > prevPrice ? "up" : "down";
      setDirection(newDirection);
      setIsFlashing(true);
    }, 0);

    prevPriceRef.current = currentPrice;

    // Clear previous flash timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule flash reset
    timeoutRef.current = setTimeout(() => {
      setDirection("stable");
      setIsFlashing(false);
    }, 1000);

    return () => {
      clearTimeout(updateTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [token?.price]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    price: token?.price ?? 0,
    priceChange: token?.priceChange24h ?? 0,
    direction,
    isFlashing,
  };
}

/**
 * Hook for tracking which tokens were recently updated
 */
export function useRecentlyUpdatedTokens(windowMs = 2000) {
  const allTokens = useAppSelector(selectAllTokens);
  const [recentIds, setRecentIds] = useState<Set<string>>(new Set());
  const pricesRef = useRef<Map<string, number>>(new Map());
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Skip the first render to initialize prices
    if (!isInitializedRef.current) {
      allTokens.forEach((token) => {
        pricesRef.current.set(token.id, token.price);
      });
      isInitializedRef.current = true;
      return;
    }

    const newRecentIds = new Set<string>();
    const previousPrices = pricesRef.current;

    allTokens.forEach((token) => {
      const prevPrice = previousPrices.get(token.id);
      if (prevPrice !== undefined && prevPrice !== token.price) {
        newRecentIds.add(token.id);
      }
      previousPrices.set(token.id, token.price);
    });

    if (newRecentIds.size > 0) {
      // Schedule state update via setTimeout (async, React 19 compliant)
      const updateTimeout = setTimeout(() => {
        setRecentIds((prev) => new Set([...prev, ...newRecentIds]));
      }, 0);

      const clearTimeout2 = setTimeout(() => {
        setRecentIds((prev) => {
          const updated = new Set(prev);
          newRecentIds.forEach((id) => updated.delete(id));
          return updated;
        });
      }, windowMs);

      return () => {
        clearTimeout(updateTimeout);
        clearTimeout(clearTimeout2);
      };
    }
  }, [allTokens, windowMs]);

  return recentIds;
}
