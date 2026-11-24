import LocaleLink from '../LocaleLink'
import styles from './Button.module.css'

/*
 * The theme declared `.btn-primary` as a global class inside
 * aboutus.css.liquid, so one section's stylesheet set the button style for
 * the whole site and every later section quietly depended on it. It is a
 * component now.
 *
 * `to` is an internal route and keeps the visitor's locale; `href` is an
 * external link; neither means a real <button>.
 */
export default function Button({ to, href, variant = 'primary', className, children, ...props }) {
  const cls = [styles.btn, styles[variant], className].filter(Boolean).join(' ')

  if (to) {
    return (
      <LocaleLink to={to} className={cls} {...props}>
        {children}
      </LocaleLink>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
