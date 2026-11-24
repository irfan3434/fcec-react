import { useMediaQuery } from './useMediaQuery'

/** Tracks the OS "reduce motion" setting, and keeps tracking it if it changes. */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
