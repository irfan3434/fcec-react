import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useLocale } from '../../i18n/LocaleContext'
import { mediaUrl } from '../../lib/media'
import styles from './Lightbox.module.css'

/**
 * A full-screen image viewer built on <dialog>.
 *
 * `showModal()` brings the focus trap, the inert background, the backdrop
 * and Escape-to-close with it, and it returns focus to whatever opened the
 * dialog. The theme's version was hand-rolled: it stashed `lastFocus`
 * itself, set `overflow: hidden` on <html>, and had nothing holding focus
 * inside, so tabbing walked straight out of the open lightbox and into the
 * page behind it.
 *
 * `index` is the open image, or null when closed. The parent owns it.
 */
export default function Lightbox({ images, index, onClose, onStep, label }) {
  const { t } = useTranslation()
  const { isRTL } = useLocale()
  const dialogRef = useRef(null)
  const open = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    return undefined
  }, [open])

  // <dialog> makes the page inert but does not stop it scrolling behind.
  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  const image = open ? images[index] : null
  const many = images.length > 1
  // The arrow points the way it travels, which is the other way in Arabic.
  const backIcon = isRTL ? 'fa-chevron-right' : 'fa-chevron-left'
  const nextIcon = isRTL ? 'fa-chevron-left' : 'fa-chevron-right'

  const onKeyDown = (event) => {
    if (!many) return
    // Left means "back" in English and "forward" in Arabic.
    if (event.key === 'ArrowLeft') onStep(isRTL ? 1 : -1)
    else if (event.key === 'ArrowRight') onStep(isRTL ? -1 : 1)
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={label}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      {image && (
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t('gallery.close')}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          {many && (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                onClick={() => onStep(-1)}
                aria-label={t('gallery.previous')}
              >
                <i className={`fa-solid ${backIcon}`} aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                onClick={() => onStep(1)}
                aria-label={t('gallery.next')}
              >
                <i className={`fa-solid ${nextIcon}`} aria-hidden="true" />
              </button>
            </>
          )}

          <figure className={styles.figure}>
            <img
              className={styles.image}
              src={mediaUrl(image.src)}
              alt=""
              width={image.width}
              height={image.height}
            />
            {many && (
              <figcaption className={styles.caption}>
                {t('gallery.position', { index: index + 1, total: images.length })}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </dialog>
  )
}
