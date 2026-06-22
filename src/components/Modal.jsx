// Jednoduchý modální dialog (overlay + karta uprostřed).
export default function Modal({ open, onClose, title, description, children }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card rounded-2xl shadow-[0_12px_40px_rgba(16,24,40,0.25)] p-5">
        {title && <h3 className="text-lg font-extrabold text-ink">{title}</h3>}
        {description && <p className="text-sm text-ink-soft mt-1">{description}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
