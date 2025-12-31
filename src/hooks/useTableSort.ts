"use client";

import { useMemo, useCallback, useState } from "react";
import type { Token, SortConfig } from "@/lib/types";

interface UseSortReturn<T> {
  sortedData: T[];
  sortConfig: SortConfig | null;
  setSortConfig: (config: SortConfig | null) => void;
  handleSort: (key: string) => void;
  resetSort: () => void;
}

/**
 * Hook for sorting table data
 * Supports ascending, descending, and reset to original order
 */
export function useTableSort<T>(
  data: T[],
  defaultSort?: SortConfig
): UseSortReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort ?? null
  );

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        const diff = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === "asc" ? diff : -diff;
      }

      // Handle numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Handle strings
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      const comparison = aStr.localeCompare(bStr);
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = useCallback((key: string) => {
    setSortConfig((current) => {
      if (current?.key !== key) {
        return { key, direction: "desc" };
      }
      if (current.direction === "desc") {
        return { key, direction: "asc" };
      }
      return null; // Reset to original order
    });
  }, []);

  const resetSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  return {
    sortedData,
    sortConfig,
    setSortConfig,
    handleSort,
    resetSort,
  };
}

/**
 * Hook for filtering tokens by various criteria
 */
export function useTokenFilter(tokens: Token[]) {
  const [filters, setFilters] = useState({
    minLiquidity: 0,
    minHolders: 0,
    search: "",
  });

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      if (filters.minLiquidity && token.liquidity < filters.minLiquidity) {
        return false;
      }
      if (filters.minHolders && token.holders < filters.minHolders) {
        return false;
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesName = token.name.toLowerCase().includes(search);
        const matchesSymbol = token.symbol.toLowerCase().includes(search);
        const matchesAddress = token.address.toLowerCase().includes(search);
        if (!matchesName && !matchesSymbol && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }, [tokens, filters]);

  const updateFilter = useCallback(
    <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ minLiquidity: 0, minHolders: 0, search: "" });
  }, []);

  return {
    filteredTokens,
    filters,
    updateFilter,
    resetFilters,
  };
}

/**
 * Combined hook for sorted and filtered token data
 */
export function useTokenData(
  tokens: Token[],
  defaultSort?: SortConfig
) {
  const { filteredTokens, filters, updateFilter, resetFilters } =
    useTokenFilter(tokens);
  
  const { sortedData, sortConfig, handleSort, resetSort } = useTableSort<Token>(
    filteredTokens,
    defaultSort
  );

  const reset = useCallback(() => {
    resetFilters();
    resetSort();
  }, [resetFilters, resetSort]);

  return {
    data: sortedData,
    sortConfig,
    handleSort,
    filters,
    updateFilter,
    reset,
  };
}
