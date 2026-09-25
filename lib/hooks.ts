"use client";
import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query: the server render and hydration pass use `false`,
 * then React re-renders with the real value on the client.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** prefers-reduced-motion, hydration-safe. */
export const useReduced = () => useMediaQuery("(prefers-reduced-motion: reduce)");
