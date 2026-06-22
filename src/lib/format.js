// Formátování částek a dat. Locale se přepíná podle jazyka (setLocale).

let LOCALE = 'cs-CZ'
let numFmt = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
let monthLongFmt = new Intl.DateTimeFormat(LOCALE, { month: 'long' })
let monthShortFmt = new Intl.DateTimeFormat(LOCALE, { month: 'short' })
let dateFmt = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'numeric', year: 'numeric' })

// Nastaví locale podle jazyka aplikace ('cs' | 'en').
export function setLocale(lang) {
  LOCALE = lang === 'en' ? 'en-GB' : 'cs-CZ'
  numFmt = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 })
  monthLongFmt = new Intl.DateTimeFormat(LOCALE, { month: 'long' })
  monthShortFmt = new Intl.DateTimeFormat(LOCALE, { month: 'short' })
  dateFmt = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'numeric', year: 'numeric' })
}

function isEn() {
  return LOCALE.startsWith('en')
}

// "32 500 CZK" / "32,500 CZK"
export function formatMoney(amount, currency = 'CZK') {
  return `${numFmt.format(Math.round(amount))} ${currency}`
}

export function formatSigned(type, amount, currency = 'CZK') {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}${formatMoney(Math.abs(amount), currency)}`
}

// Locale datum (cs: "10. 3. 2026", en: "10/03/2026")
export function formatDate(iso) {
  return dateFmt.format(parseISO(iso))
}

// ISO datum (YYYY-MM-DD) -> lokální Date (bez posunu časové zóny)
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// "Červen 2026" / "June 2026"
export function monthLabel(year, month) {
  return `${cap(monthLongFmt.format(new Date(year, month, 1)))} ${year}`
}

// Krátký název měsíce "Čer" / "Jun"
export function shortMonth(year, month) {
  const name = monthShortFmt.format(new Date(year, month, 1)).replace('.', '')
  return cap(name).slice(0, 3)
}

// Krátké datum bez roku pro popisky grafů
export function shortDate(date) {
  return isEn() ? `${date.getMonth() + 1}/${date.getDate()}` : `${date.getDate()}. ${date.getMonth() + 1}.`
}
