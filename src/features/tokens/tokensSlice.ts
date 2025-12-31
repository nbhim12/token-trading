import { createSlice, createEntityAdapter, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { Token, PriceUpdate, TokenStatus } from "@/lib/types";
import type { RootState } from "@/store";

// Entity adapter for normalized state
const tokensAdapter = createEntityAdapter<Token>();

interface TokensState {
  ids: string[];
  entities: Record<string, Token>;
  activeTab: TokenStatus | "all";
  isConnected: boolean;
  lastUpdate: number | null;
}

const initialState: TokensState = tokensAdapter.getInitialState({
  activeTab: "new" as TokenStatus,
  isConnected: false,
  lastUpdate: null,
});

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    // Set all tokens (from initial fetch)
    setTokens: (state, action: PayloadAction<Token[]>) => {
      tokensAdapter.setAll(state, action.payload);
      state.lastUpdate = Date.now();
    },

    // Add a new token
    addToken: (state, action: PayloadAction<Token>) => {
      tokensAdapter.addOne(state, action.payload);
    },

    // Update a token
    updateToken: (state, action: PayloadAction<Partial<Token> & { id: string }>) => {
      tokensAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },

    // Update price from WebSocket
    updatePrice: (state, action: PayloadAction<PriceUpdate>) => {
      const { tokenId, price, priceChange24h } = action.payload;
      const token = state.entities[tokenId];
      if (token) {
        token.price = price;
        token.priceChange24h = priceChange24h;
      }
      state.lastUpdate = Date.now();
    },

    // Batch update prices
    updatePrices: (state, action: PayloadAction<PriceUpdate[]>) => {
      action.payload.forEach(({ tokenId, price, priceChange24h }) => {
        const token = state.entities[tokenId];
        if (token) {
          token.price = price;
          token.priceChange24h = priceChange24h;
        }
      });
      state.lastUpdate = Date.now();
    },

    // Set active tab
    setActiveTab: (state, action: PayloadAction<TokenStatus | "all">) => {
      state.activeTab = action.payload;
    },

    // Set connection status
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    // Remove a token
    removeToken: (state, action: PayloadAction<string>) => {
      tokensAdapter.removeOne(state, action.payload);
    },
  },
});

// Export actions
export const {
  setTokens,
  addToken,
  updateToken,
  updatePrice,
  updatePrices,
  setActiveTab,
  setConnected,
  removeToken,
} = tokensSlice.actions;

// Export reducer
export const tokensReducer = tokensSlice.reducer;

// Selectors
export const {
  selectAll: selectAllTokens,
  selectById: selectTokenById,
  selectIds: selectTokenIds,
  selectTotal: selectTokenCount,
} = tokensAdapter.getSelectors<RootState>((state) => state.tokens);

// Custom selectors - memoized to prevent unnecessary re-renders
export const selectActiveTab = (state: RootState) => state.tokens.activeTab;
export const selectIsConnected = (state: RootState) => state.tokens.isConnected;
export const selectLastUpdate = (state: RootState) => state.tokens.lastUpdate;

// Memoized selectors for filtered tokens by status
export const selectNewTokens = createSelector(
  [selectAllTokens],
  (tokens) => tokens.filter((token) => token.status === "new")
);

export const selectFinalStretchTokens = createSelector(
  [selectAllTokens],
  (tokens) => tokens.filter((token) => token.status === "finalStretch")
);

export const selectMigratedTokens = createSelector(
  [selectAllTokens],
  (tokens) => tokens.filter((token) => token.status === "migrated")
);

// Generic memoized selector factory for status filtering
export const selectTokensByStatus = createSelector(
  [selectAllTokens, (_state: RootState, status: TokenStatus) => status],
  (tokens, status) => tokens.filter((token) => token.status === status)
);
