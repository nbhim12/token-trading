import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed version of useDispatch hook
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed version of useSelector hook
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Typed version of useStore hook
 */
export const useAppStore = useStore.withTypes<typeof import("./store").store>();
