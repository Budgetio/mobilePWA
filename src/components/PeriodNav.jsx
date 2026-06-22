import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { periodLabel, shiftPeriod } from '../lib/period.js'
import { useStore } from '../store/StoreProvider.jsx'
import PeriodPicker from './PeriodPicker.jsx'

// Přepínač období: šipky listují, kliknutím na střed se otevře výběr rozsahu.
export default function PeriodNav({ period, onChange, variant = 'boxed' }) {
  const { lang } = useStore()
  const [pickerOpen, setPickerOpen] = useState(false)
  const go = (dir) => onChange(shiftPeriod(period, dir))
  const label = periodLabel(period, lang)

  const Picker = (
    <PeriodPicker
      open={pickerOpen}
      period={period}
      onClose={() => setPickerOpen(false)}
      onApply={onChange}
    />
  )

  if (variant === 'arrowsOutside') {
    return (
      <>
        <div className="flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            className="w-11 h-11 rounded-2xl bg-accent text-accent-ink flex items-center justify-center shadow-sm active:scale-95 transition flex-shrink-0"
            aria-label="Předchozí období"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setPickerOpen(true)}
            className="flex-1 h-11 rounded-2xl bg-card shadow-card flex items-center justify-center gap-2 font-semibold text-ink px-2"
          >
            <Calendar size={18} className="text-ink-soft flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
          <button
            onClick={() => go(1)}
            className="w-11 h-11 rounded-2xl bg-accent text-accent-ink flex items-center justify-center shadow-sm active:scale-95 transition flex-shrink-0"
            aria-label="Další období"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        {Picker}
      </>
    )
  }

  return (
    <>
      <div className="h-12 rounded-2xl bg-card shadow-card flex items-center justify-between px-2">
        <button
          onClick={() => go(-1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft active:bg-line-soft flex-shrink-0"
          aria-label="Předchozí období"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 font-semibold text-ink min-w-0 px-1"
        >
          <Calendar size={18} className="text-ink-soft flex-shrink-0" />
          <span className="truncate">{label}</span>
        </button>
        <button
          onClick={() => go(1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-soft active:bg-line-soft flex-shrink-0"
          aria-label="Další období"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      {Picker}
    </>
  )
}
