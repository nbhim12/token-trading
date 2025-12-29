"use client";

import { ReduxProvider } from "./ReduxProvider";
import { QueryProvider } from "./QueryProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Combines all application providers in the correct order
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}
