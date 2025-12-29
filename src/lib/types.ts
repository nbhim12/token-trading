/**
 * Core type definitions for the Token Trading application
 */

// ============================================
// Token Types
// ============================================

export interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  image: string | null;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  createdAt: Date;
  bondingProgress: number; // 0-100 percentage
  status: TokenStatus;
  chain: Chain;
  social?: TokenSocial;
}

export type TokenStatus = "new" | "finalStretch" | "migrated";

export type Chain = "sol" | "eth" | "base";

export interface TokenSocial {
  twitter?: string;
  telegram?: string;
  website?: string;
}

// ============================================
// Table Types
// ============================================

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  renderCell?: (row: T) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
}

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export type SortDirection = "asc" | "desc" | null;

export interface TableState {
  activeTab: TokenStatus | "all";
  sort: SortConfig | null;
  filters: TableFilters;
}

export interface TableFilters {
  minLiquidity?: number;
  maxAge?: number; // in hours
  minHolders?: number;
  minVolume?: number;
}

// ============================================
// UI State Types
// ============================================

export interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error: Error | null;
}

export type SkeletonVariant = "line" | "circle" | "rect";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "default";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

// ============================================
// WebSocket Types
// ============================================

export interface PriceUpdate {
  tokenId: string;
  price: number;
  priceChange24h: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: "price_update" | "new_token" | "status_change";
  payload: PriceUpdate | Token | TokenStatusChange;
}

export interface TokenStatusChange {
  tokenId: string;
  oldStatus: TokenStatus;
  newStatus: TokenStatus;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface TokenQueryParams {
  status?: TokenStatus;
  chain?: Chain;
  sortBy?: string;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WithLoadingProps {
  isLoading?: boolean;
  loadingFallback?: React.ReactNode;
}

export interface WithErrorProps {
  error?: Error | null;
  errorFallback?: React.ReactNode;
}
