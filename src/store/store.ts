import { configureStore } from "@reduxjs/toolkit";
import { tokensReducer } from "@/features/tokens/tokensSlice";
import { uiReducer } from "@/features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    tokens: tokensReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["tokens/updatePrice"],
        // Ignore these paths in state
        ignoredPaths: ["tokens.entities"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
