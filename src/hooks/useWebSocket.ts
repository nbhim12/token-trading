"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch } from "@/store";
import { updatePrices, setConnected } from "@/features/tokens";
import type { Token, PriceUpdate } from "@/lib/types";
import { simulatePriceUpdate } from "@/services/mockData";
import { WS_CONFIG } from "@/lib/constants";

interface UseWebSocketMockOptions {
  /** Tokens to simulate updates for */
  tokens: Token[];
  /** Enable/disable updates */
  enabled?: boolean;
  /** Update interval in ms */
  interval?: number;
  /** Callback when price updates */
  onPriceUpdate?: (updates: PriceUpdate[]) => void;
}

/**
 * Mock WebSocket hook that simulates real-time price updates
 * Used for development and demo purposes
 */
export function useWebSocketMock({
  tokens,
  enabled = true,
  interval = WS_CONFIG.mockUpdateInterval,
  onPriceUpdate,
}: UseWebSocketMockOptions) {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(enabled);
  const tokensRef = useRef(tokens);

  // Keep tokens ref up to date
  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  // Simulate connection
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Simulate connection delay
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      dispatch(setConnected(true));
    }, 500);

    return () => {
      clearTimeout(connectTimeout);
    };
  }, [enabled, dispatch]);

  // Simulate price updates
  useEffect(() => {
    if (!enabled || !isConnected) return;

    const updateInterval = setInterval(() => {
      const currentTokens = tokensRef.current;
      if (currentTokens.length === 0) return;

      // Update random subset of tokens (10-30%)
      const updateCount = Math.max(
        1,
        Math.floor(currentTokens.length * (0.1 + Math.random() * 0.2))
      );

      const shuffled = [...currentTokens].sort(() => Math.random() - 0.5);
      const tokensToUpdate = shuffled.slice(0, updateCount);

      const updates: PriceUpdate[] = tokensToUpdate.map((token) => {
        const updated = simulatePriceUpdate(token);
        return {
          tokenId: token.id,
          price: updated.price,
          priceChange24h: updated.priceChange24h,
          timestamp: Date.now(),
        };
      });

      // Dispatch to Redux
      dispatch(updatePrices(updates));

      // Call callback
      onPriceUpdate?.(updates);
    }, interval);

    return () => clearInterval(updateInterval);
  }, [enabled, isConnected, interval, dispatch, onPriceUpdate]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    dispatch(setConnected(false));
  }, [dispatch]);

  const reconnect = useCallback(() => {
    setIsConnected(false);
    dispatch(setConnected(false));
    
    setTimeout(() => {
      setIsConnected(true);
      dispatch(setConnected(true));
    }, 500);
  }, [dispatch]);

  return {
    isConnected,
    disconnect,
    reconnect,
  };
}

/**
 * Standalone hook for single token price updates
 */
export function useTokenPriceUpdates(
  token: Token | null,
  enabled = true,
  interval = 2000
) {
  const initialPrice = token?.price ?? 0;
  const initialChange = token?.priceChange24h ?? 0;
  
  const [price, setPrice] = useState(initialPrice);
  const [priceChange, setPriceChange] = useState(initialChange);
  const [prevPrice, setPrevPrice] = useState(initialPrice);
  const tokenRef = useRef(token);

  // Keep token ref updated
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    if (!token || !enabled) return;

    const updateInterval = setInterval(() => {
      const currentToken = tokenRef.current;
      if (!currentToken) return;
      
      const updated = simulatePriceUpdate(currentToken);
      setPrevPrice((prev) => prev);
      setPrice(updated.price);
      setPriceChange(updated.priceChange24h);
    }, interval);

    return () => clearInterval(updateInterval);
  }, [token, enabled, interval]);

  return {
    price,
    priceChange,
    prevPrice,
    direction: price > prevPrice ? "up" : price < prevPrice ? "down" : "stable",
  };
}
