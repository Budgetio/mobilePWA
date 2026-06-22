// Práce s opakovanými transakcemi a "plánovanými" (budoucími) položkami.
import { parseISO, toISO } from './format.js'

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Je dané ISO datum v budoucnosti vůči "dnešku"?
export function isPlanned(iso, today = new Date()) {
  return startOfDay(parseISO(iso)).getTime() > startOfDay(today).getTime()
}

// Vytvoří jednu konkrétní instanci (occurrence) transakce k danému datu.
function makeOccurrence(tx, iso, today) {
  return {
    ...tx,
    occId: `${tx.id}@${iso}`,
    date: iso,
    planned: isPlanned(iso, today),
    isRecurringInstance: !!tx.recurrence,
  }
}

// Vrátí instance dané transakce spadající do měsíce (year, month 0–11).
export function occurrencesInMonth(tx, year, month, today = new Date()) {
  const mStart = new Date(year, month, 1)
  const mEnd = new Date(year, month, daysInMonth(year, month))

  if (!tx.recurrence) {
    const d = parseISO(tx.date)
    if (d >= mStart && d <= mEnd) return [makeOccurrence(tx, tx.date, today)]
    return []
  }

  // Měsíční opakování: kotví se na den v měsíci podle startDate.
  const start = parseISO(tx.recurrence.startDate || tx.date)
  const end = tx.recurrence.endDate ? parseISO(tx.recurrence.endDate) : null

  // mimo rozsah pravidla?
  if (mEnd < startOfDay(start)) return []
  if (end && mStart > startOfDay(end)) return []

  const anchorDay = start.getDate()
  const day = Math.min(anchorDay, daysInMonth(year, month))
  const occDate = new Date(year, month, day)

  if (occDate < startOfDay(start)) return []
  if (end && occDate > startOfDay(end)) return []

  return [makeOccurrence(tx, toISO(occDate), today)]
}

// Všechny instance transakcí daného rozpočtu v měsíci, seřazené od nejnovější.
export function transactionsForMonth(transactions, budgetId, year, month, today = new Date()) {
  const out = []
  for (const tx of transactions) {
    if (tx.budgetId !== budgetId) continue
    for (const occ of occurrencesInMonth(tx, year, month, today)) out.push(occ)
  }
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return out
}

// Všechny instance transakcí daného rozpočtu v libovolném rozsahu dat (ISO),
// včetně rozbalení měsíčního opakování přes všechny dotčené měsíce.
export function transactionsInRange(transactions, budgetId, fromISO, toISO_, today = new Date()) {
  const from = parseISO(fromISO)
  const to = parseISO(toISO_)
  const out = []

  // seznam měsíců pokrývajících rozsah
  const months = []
  let cur = new Date(from.getFullYear(), from.getMonth(), 1)
  const lastM = new Date(to.getFullYear(), to.getMonth(), 1)
  while (cur <= lastM) {
    months.push([cur.getFullYear(), cur.getMonth()])
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }

  for (const tx of transactions) {
    if (tx.budgetId !== budgetId) continue
    if (!tx.recurrence) {
      const d = parseISO(tx.date)
      if (d >= from && d <= to) out.push(makeOccurrence(tx, tx.date, today))
    } else {
      for (const [yy, mm] of months) {
        for (const occ of occurrencesInMonth(tx, yy, mm, today)) {
          const d = parseISO(occ.date)
          if (d >= from && d <= to) out.push(occ)
        }
      }
    }
  }
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  return out
}

// Součty příjmů/výdajů z instancí.
export function totals(occurrences) {
  let income = 0
  let expense = 0
  for (const o of occurrences) {
    if (o.type === 'income') income += o.amount
    else expense += o.amount
  }
  return { income, expense, balance: income - expense }
}
