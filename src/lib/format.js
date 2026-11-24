/**
 * Saudi mobile numbers, grouped for reading. Anything else is left as it is
 * rather than guessed at.
 *
 * Lived in Footer.jsx until the Contact page needed the same thing.
 */
export const formatPhone = (number) => {
  const saudi = number.match(/^\+966(\d{2})(\d{3})(\d{4})$/)
  return saudi ? `+966 ${saudi[1]} ${saudi[2]} ${saudi[3]}` : number
}
