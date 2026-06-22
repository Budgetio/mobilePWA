import { useEffect, useState } from 'react'
import { RefreshCw, Sparkles } from 'lucide-react'
import { subscribeUpdate, applyUpdate } from '../lib/pwa.js'
import { useStore } from '../store/StoreProvider.jsx'

// Lišta nahoře, když je k dispozici nová verze aplikace.
export default function UpdateBanner() {
  const { t } = useStore()
  const [available, setAvailable] = useState(false)

  useEffect(() => subscribeUpdate(setAvailable), [])

  if (!available) return null

  return (
    <div className="absolute top-[env(safe-area-inset-top)] inset-x-0 z-[60] px-3 pt-3">
      <div className="bg-ink text-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
        <Sparkles size={20} className="text-accent flex-shrink-0" />
        <span className="flex-1 text-sm font-semibold">{t('update.available')}</span>
        <button
          onClick={applyUpdate}
          className="px-3 py-1.5 rounded-full bg-accent text-accent-ink text-sm font-bold flex items-center gap-1.5 active:scale-95 transition"
        >
          <RefreshCw size={15} /> {t('update.button')}
        </button>
      </div>
    </div>
  )
}
