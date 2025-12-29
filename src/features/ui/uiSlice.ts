import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SortConfig, TableFilters } from "@/lib/types";
import type { RootState } from "@/store";

interface UiState {
  // Modal states
  tokenModalId: string | null;
  isFilterPopoverOpen: boolean;

  // Table state
  sort: SortConfig | null;
  filters: TableFilters;

  // Loading states
  isInitialLoading: boolean;
  isRefreshing: boolean;

  // Error state
  globalError: string | null;

  // Theme
  isDarkMode: boolean;
}

const initialState: UiState = {
  tokenModalId: null,
  isFilterPopoverOpen: false,
  sort: { key: "createdAt", direction: "desc" },
  filters: {},
  isInitialLoading: true,
  isRefreshing: false,
  globalError: null,
  isDarkMode: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Modal actions
    openTokenModal: (state, action: PayloadAction<string>) => {
      state.tokenModalId = action.payload;
    },
    closeTokenModal: (state) => {
      state.tokenModalId = null;
    },

    // Filter popover
    toggleFilterPopover: (state) => {
      state.isFilterPopoverOpen = !state.isFilterPopoverOpen;
    },
    closeFilterPopover: (state) => {
      state.isFilterPopoverOpen = false;
    },

    // Sorting
    setSort: (state, action: PayloadAction<SortConfig | null>) => {
      state.sort = action.payload;
    },
    toggleSortDirection: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      if (state.sort?.key === key) {
        if (state.sort.direction === "asc") {
          state.sort.direction = "desc";
        } else if (state.sort.direction === "desc") {
          state.sort = null;
        }
      } else {
        state.sort = { key, direction: "asc" };
      }
    },

    // Filters
    setFilters: (state, action: PayloadAction<TableFilters>) => {
      state.filters = action.payload;
    },
    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof TableFilters; value: number | undefined }>
    ) => {
      const { key, value } = action.payload;
      if (value === undefined) {
        delete state.filters[key];
      } else {
        state.filters[key] = value;
      }
    },
    clearFilters: (state) => {
      state.filters = {};
    },

    // Loading states
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },

    // Error handling
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },

    // Theme
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

// Export actions
export const {
  openTokenModal,
  closeTokenModal,
  toggleFilterPopover,
  closeFilterPopover,
  setSort,
  toggleSortDirection,
  setFilters,
  updateFilter,
  clearFilters,
  setInitialLoading,
  setRefreshing,
  setGlobalError,
  toggleDarkMode,
} = uiSlice.actions;

// Export reducer
export const uiReducer = uiSlice.reducer;

// Selectors
export const selectTokenModalId = (state: RootState) => state.ui.tokenModalId;
export const selectIsFilterPopoverOpen = (state: RootState) =>
  state.ui.isFilterPopoverOpen;
export const selectSort = (state: RootState) => state.ui.sort;
export const selectFilters = (state: RootState) => state.ui.filters;
export const selectIsInitialLoading = (state: RootState) =>
  state.ui.isInitialLoading;
export const selectIsRefreshing = (state: RootState) => state.ui.isRefreshing;
export const selectGlobalError = (state: RootState) => state.ui.globalError;
export const selectIsDarkMode = (state: RootState) => state.ui.isDarkMode;
