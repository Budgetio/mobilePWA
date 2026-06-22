// Formátování částek a dat v českém prostředí.

const czk = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })

// "32 500 CZK" (s pevnými mezerami)
export function formatMoney(amount, currency = 'CZK') {
  return `${czk.format(Math.round(amount))} ${currency}`
}

// "+32 500 CZK" / "-1 250 CZK" podle typu transakce
export function formatSigned(type, amount, currency = 'CZK') {
  const sign = type === 'income' ? '+' : '-'
  return `${sign}${formatMoney(Math.abs(amount), currency)}`
}

// "10. 3. 2026"
export function formatDate(iso) {
  const d = parseISO(iso)
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
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

const monthFmt = new Intl.DateTimeFormat('cs-CZ', { month: 'long' })

// "Červen 2026"
export function monthLabel(year, month) {
  const name = monthFmt.format(new Date(year, month, 1))
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`
}

// Krátký název měsíce, "Čer"
export function shortMonth(year, month) {
  const name = new Intl.DateTimeFormat('cs-CZ', { month: 'short' }).format(
    new Date(year, month, 1)
  )
  const clean = name.replace('.', '')
  return clean.charAt(0).toUpperCase() + clean.slice(1, 3)
}

// "7. 3." krátké datum bez roku
export function shortDate(date) {
  return `${date.getDate()}. ${date.getMonth() + 1}.`
}
