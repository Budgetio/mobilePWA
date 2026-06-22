import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { monthLabel } from '../lib/format.js'

// Přepínač měsíce: < Červen 2026 >
export default function MonthNav({ year, month, onChange, variant = 'boxed' }) {
  const go = (delta) => {
    const d = new Date(year, month + delta, 1)
    onChange(d.getFullYear(), d.getMonth())
  }

  if (variant === 'arrowsOutside') {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => go(-1)}
          className="w-11 h-11 rounded-2xl bg-accent text-accent-ink flex items-center justify-center shadow-sm active:scale-95 transition"
          aria-label="Předchozí měsíc"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1 h-11 rounded-2xl bg-card shadow-card flex items-center justify-center gap-2 font-semibold text-ink">
          <Calendar size={18} className="text-ink-soft" />
          {monthLabel(year, month)}
        </div>
        <button
          onClick={() => go(1)}
          className="w-11 h-11 rounded-2xl bg-accent text-accent-ink flex items-center justify-center shadow-sm active:scale-95 transition"
          aria-label="Další měsíc"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    )
  }

  // boxed: vše v jednom rámečku
  return (
    <div className="h-12 rounded-2xl bg-card shadow-card flex items-center justify-between px-2">
      <button
        onClick={() => go(-1)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft active:bg-line-soft"
        aria-label="Předchozí měsíc"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-2 font-semibold text-ink">
        <Calendar size={18} className="text-ink-soft" />
        {monthLabel(year, month)}
      </div>
      <button
        onClick={() => go(1)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft active:bg-line-soft"
        aria-label="Další měsíc"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
