import { LayoutGrid, ArrowLeftRight, Plus, BarChart3, User } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'

const TABS = [
  { id: 'overview', tKey: 'nav.overview', icon: LayoutGrid },
  { id: 'transactions', tKey: 'nav.transactions', icon: ArrowLeftRight },
  { id: 'stats', tKey: 'nav.stats', icon: BarChart3 },
  { id: 'profile', tKey: 'nav.profile', icon: User },
]

export default function BottomNav({ active, onChange, onAdd }) {
  const { t } = useStore()
  const left = TABS.slice(0, 2)
  const right = TABS.slice(2)

  const Item = ({ tab }) => {
    const isActive = active === tab.id
    const Icon = tab.icon
    return (
      <button
        onClick={() => onChange(tab.id)}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-1"
      >
        <span
          className={
            'flex items-center justify-center px-3 py-1 rounded-full transition-colors ' +
            (isActive ? 'bg-accent text-accent-ink' : 'text-ink-mute')
          }
        >
          <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
        </span>
        <span
          className={
            'text-[10px] font-semibold tracking-wide ' + (isActive ? 'text-ink' : 'text-ink-mute')
          }
        >
          {t(tab.tKey)}
        </span>
      </button>
    )
  }

  return (
    <div className="absolute bottom-0 inset-x-0 z-30">
      <div className="mx-3 mb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-card rounded-full shadow-[0_4px_24px_rgba(16,24,40,0.12)] flex items-center px-2 py-1.5 relative">
        {left.map((tab) => (
          <Item key={tab.id} tab={tab} />
        ))}

        <div className="flex-shrink-0 px-1">
          <button
            onClick={onAdd}
            className="w-14 h-14 rounded-full bg-accent text-accent-ink flex items-center justify-center shadow-fab active:scale-95 transition -mt-6"
            aria-label={t('nav.add')}
          >
            <Plus size={28} strokeWidth={2.6} />
          </button>
        </div>

        {right.map((tab) => (
          <Item key={tab.id} tab={tab} />
        ))}
      </div>
    </div>
  )
}
