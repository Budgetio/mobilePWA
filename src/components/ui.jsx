// Drobné sdílené UI prvky.

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`bg-card rounded-xl2 shadow-card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {action}
    </div>
  )
}

export function ScreenHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between px-5 pt-2 pb-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
      {right}
    </div>
  )
}

// Kulatý "pill" přepínač (segment)
export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={
              'px-4 py-2 rounded-full text-sm font-semibold border transition-colors ' +
              (active
                ? 'bg-accent border-accent text-accent-ink'
                : 'bg-card border-line text-ink-soft')
            }
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-12 h-12 rounded-full bg-line-soft flex items-center justify-center text-ink-mute mb-3">
        {icon}
      </div>
      <p className="font-semibold text-ink">{title}</p>
      {subtitle && <p className="text-sm text-ink-mute mt-1">{subtitle}</p>}
    </div>
  )
}
