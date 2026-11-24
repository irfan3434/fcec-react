import { NavLink } from 'react-router-dom'

import { useLocale } from '../i18n/LocaleContext'

/**
 * Drop-in <NavLink> that keeps the visitor inside their locale. Use this for
 * every internal link so Arabic never silently falls back to English.
 */
export default function LocaleLink({ to, ...props }) {
  const { href } = useLocale()
  return <NavLink to={href(to)} end={to === '/'} {...props} />
}
