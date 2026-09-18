import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect only on the client. React's server renderer warns on
 * useLayoutEffect (it has no DOM to run against) — the warning is dev-only
 * and stripped in production, but this keeps `next dev` clean too, for any
 * statically prerendered component that needs layout-effect timing (running
 * before paint, rather than useEffect's after-paint timing).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
