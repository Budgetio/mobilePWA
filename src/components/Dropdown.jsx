import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

// Jednoduchý rozbalovací select s ikonou vlevo.
// options: [{ value, label }]
export default function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Vyberte',
  leftIcon = null,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-4 rounded-2xl bg-card border border-line flex items-center gap-2 text-left"
      >
        {leftIcon && <span className="text-ink-mute">{leftIcon}</span>}
        <span className={selected ? 'text-ink font-medium' : 'text-ink-mute'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className="ml-auto text-ink-mute" />
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full max-h-64 overflow-auto no-scrollbar bg-card rounded-2xl shadow-[0_8px_28px_rgba(16,24,40,0.16)] border border-line py-1">
          {options.map((o) => {
            const active = o.value === value
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={
                  'w-full px-4 py-2.5 flex items-center gap-2 text-left text-sm ' +
                  (active ? 'bg-accent-light text-ink font-semibold' : 'text-ink-soft')
                }
              >
                {o.label}
                {active && <Check size={16} className="ml-auto text-accent-dark" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
