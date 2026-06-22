import { Signal, Wifi, BatteryFull } from 'lucide-react'

// Kosmetická mobilní stavová lišta (jako v designu).
export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-ink select-none">
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={16} />
        <Wifi size={16} />
        <BatteryFull size={20} />
      </div>
    </div>
  )
}
