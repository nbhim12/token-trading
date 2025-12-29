/**
 * Application-wide constants
 */

// ============================================
// API Configuration
// ============================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://api.axiom.trade/ws";

// ============================================
// Query Keys for React Query
// ============================================

export const QUERY_KEYS = {
  tokens: "tokens",
  tokenDetail: "tokenDetail",
  priceHistory: "priceHistory",
} as const;

// ============================================
// Table Configuration
// ============================================

export const DEFAULT_PAGE_SIZE = 50;

export const TABLE_TABS = [
  { key: "new", label: "New Pairs" },
  { key: "finalStretch", label: "Final Stretch" },
  { key: "migrated", label: "Migrated" },
] as const;

export const SORT_OPTIONS = [
  { key: "createdAt", label: "Age" },
  { key: "marketCap", label: "Market Cap" },
  { key: "volume24h", label: "Volume" },
  { key: "holders", label: "Holders" },
  { key: "liquidity", label: "Liquidity" },
  { key: "priceChange24h", label: "Price Change" },
] as const;

// ============================================
// Animation Durations (ms)
// ============================================

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  priceFlash: 1000,
} as const;

// ============================================
// Breakpoints (matching Tailwind)
// ============================================

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ============================================
// Token Status Colors
// ============================================

export const STATUS_COLORS = {
  new: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  finalStretch: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  migrated: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
  },
} as const;

// ============================================
// Price Change Colors
// ============================================

export const PRICE_COLORS = {
  positive: "text-green-400",
  negative: "text-red-400",
  neutral: "text-gray-400",
  positiveBg: "bg-green-400/10",
  negativeBg: "bg-red-400/10",
} as const;

// ============================================
// WebSocket Configuration
// ============================================

export const WS_CONFIG = {
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  pingInterval: 30000,
  mockUpdateInterval: 1500, // For mock WebSocket
} as const;

// ============================================
// Lighthouse Performance Budgets
// ============================================

export const PERFORMANCE_BUDGETS = {
  maxInteractionTime: 100, // ms
  maxLayoutShift: 0.1,
  maxFirstContentfulPaint: 1800, // ms
  maxLargestContentfulPaint: 2500, // ms
} as const;
