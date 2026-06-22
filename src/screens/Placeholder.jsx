import { Hammer } from 'lucide-react'
import { ScreenHeader } from '../components/ui.jsx'

// Dočasná obrazovka pro taby, které přijdou v dalších fázích.
export default function Placeholder({ title, note }) {
  return (
    <div className="px-5">
      <ScreenHeader title={title} />
      <div className="flex flex-col items-center justify-center text-center py-24 px-6">
        <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-accent-dark mb-4">
          <Hammer size={26} />
        </div>
        <p className="font-bold text-ink text-lg">Připravujeme</p>
        <p className="text-sm text-ink-mute mt-1 max-w-[260px]">{note}</p>
      </div>
    </div>
  )
}
