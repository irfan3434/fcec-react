import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Full-bleed background media. A video plays itself; an image, or anyone who
 * has asked for reduced motion, gets the still instead — an autoplaying loop
 * is exactly what that setting exists to stop.
 *
 * `sources` is ordered: the browser takes the first type it supports, so a
 * WebM listed before the MP4 is served to everything except Safari, at
 * roughly half the bytes.
 *
 * `poster` is the only still. A slide of `type: 'image'` puts its file there
 * too — a video file can never stand in for one, which is why there is no
 * fallback to `sources[0]`.
 *
 * Decorative by definition: the text sits in the DOM beside it, so there is
 * nothing here for a screen reader to announce.
 */
export default function BackgroundMedia({ type, sources = [], poster, className, priority = false }) {
  const reduced = usePrefersReducedMotion()

  if (type !== 'video' || reduced || !sources.length) {
    // Without a still there is nothing to paint: let the section's own
    // background show rather than request a broken image.
    if (!poster) return <div className={className} aria-hidden="true" />

    return (
      <img
        className={className}
        src={poster}
        alt=""
        aria-hidden="true"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    )
  }

  return (
    <video
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      // The poster covers the gap, so there is no reason to race the video
      // against everything else the page needs first.
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      {sources.map(({ src, type: mime }) => (
        <source key={src} src={src} type={mime} />
      ))}
    </video>
  )
}
