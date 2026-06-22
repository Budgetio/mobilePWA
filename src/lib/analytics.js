// Rozdělení rozsahu dat do "košů" (dny/týdny/měsíce) pro grafy,
// které mají vypadat dobře jak pro týden, tak pro celý rok.
import { parseISO, shortMonth, shortDate } from './format.js'

function autoGranularity(spanDays, coarse) {
  if (coarse) {
    if (spanDays <= 14) return 'day'
    if (spanDays <= 92) return 'week'
    return 'month'
  }
  if (spanDays <= 62) return 'day'
  if (spanDays <= 180) return 'week'
  return 'month'
}

// coarse=true → hrubší dělení (vhodné pro sloupce); false → jemnější (spojnice).
export function bucketize(fromISO, toISO_, { coarse = false } = {}) {
  const from = parseISO(fromISO)
  const to = parseISO(toISO_)
  const span = Math.round((to - from) / 86400000) + 1
  const gran = autoGranularity(span, coarse)
  const buckets = []

  if (gran === 'day') {
    const d = new Date(from)
    while (d <= to) {
      const day = new Date(d)
      buckets.push({ start: day, end: day, label: shortDate(day) })
      d.setDate(d.getDate() + 1)
    }
  } else if (gran === 'week') {
    const d = new Date(from)
    while (d <= to) {
      const start = new Date(d)
      const end = new Date(d)
      end.setDate(end.getDate() + 6)
      buckets.push({ start, end: end > to ? new Date(to) : end, label: shortDate(start) })
      d.setDate(d.getDate() + 7)
    }
  } else {
    const d = new Date(from.getFullYear(), from.getMonth(), 1)
    const lastM = new Date(to.getFullYear(), to.getMonth(), 1)
    while (d <= lastM) {
      buckets.push({
        start: new Date(d),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0),
        label: shortMonth(d.getFullYear(), d.getMonth()),
      })
      d.setMonth(d.getMonth() + 1)
    }
  }
  return buckets
}

// Součet příjmů/výdajů do košů.
export function aggregateByBucket(occurrences, buckets) {
  const rows = buckets.map((b) => ({
    label: b.label,
    Příjmy: 0,
    Výdaje: 0,
    _s: b.start.getTime(),
    _e: new Date(b.end.getFullYear(), b.end.getMonth(), b.end.getDate(), 23, 59, 59).getTime(),
  }))
  for (const o of occurrences) {
    const t = parseISO(o.date).getTime()
    for (const r of rows) {
      if (t >= r._s && t <= r._e) {
        if (o.type === 'income') r.Příjmy += o.amount
        else r.Výdaje += o.amount
        break
      }
    }
  }
  return rows.map(({ label, Příjmy, Výdaje }) => ({ label, Příjmy, Výdaje }))
}

// Kumulativní součet (pro spojnici peněžního toku).
export function cumulative(rows) {
  let ci = 0
  let ce = 0
  return rows.map((r) => {
    ci += r.Příjmy
    ce += r.Výdaje
    return { label: r.label, Příjmy: ci, Výdaje: ce }
  })
}

// Doporučený interval popisků osy X, aby se nepřekrývaly.
export function tickInterval(count, target = 6) {
  return Math.max(0, Math.ceil(count / target) - 1)
}
