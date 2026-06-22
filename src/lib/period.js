// Model "období" pro výběr rozsahu dat.
//   { mode: 'month', year, month }            – jeden měsíc (šipky listují po měsících)
//   { mode: 'range', from, to }               – libovolný rozsah (ISO data)
import { parseISO, toISO, monthLabel, formatDate } from './format.js'

export function monthPeriod(year, month) {
  return { mode: 'month', year, month }
}

export function rangePeriod(from, to) {
  // bezpečně seřadit
  if (from > to) [from, to] = [to, from]
  return { mode: 'range', from, to }
}

// Vrátí konkrétní {from, to} (ISO) pro jakékoliv období.
export function periodRange(p) {
  if (p.mode === 'month') {
    const from = new Date(p.year, p.month, 1)
    const to = new Date(p.year, p.month + 1, 0)
    return { from: toISO(from), to: toISO(to) }
  }
  return { from: p.from, to: p.to }
}

// Počet dní v období.
export function periodDays(p) {
  const { from, to } = periodRange(p)
  return Math.round((parseISO(to) - parseISO(from)) / 86400000) + 1
}

export function periodLabel(p) {
  const { from, to } = periodRange(p)
  const f = parseISO(from)
  const t = parseISO(to)

  // celý měsíc
  const lastDay = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()
  const isFullMonth =
    f.getFullYear() === t.getFullYear() &&
    f.getMonth() === t.getMonth() &&
    f.getDate() === 1 &&
    t.getDate() === lastDay
  if (isFullMonth) return monthLabel(f.getFullYear(), f.getMonth())

  // celý rok
  const isFullYear =
    f.getFullYear() === t.getFullYear() &&
    f.getMonth() === 0 && f.getDate() === 1 &&
    t.getMonth() === 11 && t.getDate() === 31
  if (isFullYear) return `Rok ${f.getFullYear()}`

  return `${formatDate(from)} – ${formatDate(to)}`
}

// Posun období šipkou. Měsíc → o měsíc; rozsah → o vlastní délku.
export function shiftPeriod(p, dir) {
  if (p.mode === 'month') {
    const d = new Date(p.year, p.month + dir, 1)
    return monthPeriod(d.getFullYear(), d.getMonth())
  }
  const span = periodDays(p)
  const f = parseISO(p.from)
  const t = parseISO(p.to)
  f.setDate(f.getDate() + dir * span)
  t.setDate(t.getDate() + dir * span)
  return { mode: 'range', from: toISO(f), to: toISO(t) }
}

// Rychlé předvolby.
export function periodPresets(today = new Date()) {
  const y = today.getFullYear()
  const m = today.getMonth()
  const prevMonth = new Date(y, m - 1, 1)
  const lastN = (n) => {
    const to = new Date(today)
    const from = new Date(today)
    from.setDate(from.getDate() - (n - 1))
    return rangePeriod(toISO(from), toISO(to))
  }
  return [
    { id: 'thisMonth', label: 'Tento měsíc', period: monthPeriod(y, m) },
    { id: 'lastMonth', label: 'Minulý měsíc', period: monthPeriod(prevMonth.getFullYear(), prevMonth.getMonth()) },
    { id: 'last30', label: 'Posledních 30 dní', period: lastN(30) },
    { id: 'last90', label: 'Posledních 90 dní', period: lastN(90) },
    { id: 'thisYear', label: 'Tento rok', period: rangePeriod(toISO(new Date(y, 0, 1)), toISO(new Date(y, 11, 31))) },
    { id: 'lastYear', label: 'Minulý rok', period: rangePeriod(toISO(new Date(y - 1, 0, 1)), toISO(new Date(y - 1, 11, 31))) },
  ]
}
