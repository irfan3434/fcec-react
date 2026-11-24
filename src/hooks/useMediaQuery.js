import { useEffect, useState } from 'react'

/**
 * Reads a media query from JavaScript and keeps reading it as the viewport
 * or the OS setting changes. For anything that CSS alone cannot express —
 * here, whether a carousel should advance by itself at all.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia?.(query).matches ?? false)

  useEffect(() => {
    const mql = window.matchMedia?.(query)
    if (!mql) return undefined
    const read = (event) => setMatches(event.matches)
    mql.addEventListener('change', read)
    return () => mql.removeEventListener('change', read)
  }, [query])

  return matches
}
