import { Clock } from 'lucide-react'
import CategoryIcon from './CategoryIcon.jsx'
import { formatSigned, formatDate } from '../lib/format.js'
import { useStore } from '../store/StoreProvider.jsx'

// Řádek transakce v seznamu.
// occ: instance transakce (z recurrence.transactionsForMonth)
export default function TransactionRow({ occ, category, onClick }) {
  const { t } = useStore()
  const planned = occ.planned
  const income = occ.type === 'income'

  return (
    <button
      onClick={onClick}
      className={
        'w-full text-left bg-card rounded-2xl shadow-card px-3 py-3 flex items-center gap-3 ' +
        (planned ? 'opacity-60' : '')
      }
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: planned ? '#EEF0F2' : (category?.color || '#94A3B8') + '22',
          color: planned ? '#9AA0A8' : category?.color || '#64748B',
        }}
      >
        {planned ? <Clock size={20} /> : <CategoryIcon icon={category?.icon} size={20} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-ink truncate flex items-center gap-1.5">
          {occ.name}
          {occ.isRecurringInstance && (
            <span className="text-[10px] font-medium text-ink-mute border border-line rounded px-1 py-0.5">
              {t('common.recurring')}
            </span>
          )}
        </div>
        <div className="text-sm text-ink-mute">{formatDate(occ.date)}</div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className={'font-bold ' + (income ? 'text-income' : 'text-expense')}>
          {formatSigned(occ.type, occ.amount, occ.currency)}
        </div>
        <div className="text-sm text-ink-mute">{category?.name || '—'}</div>
      </div>
    </button>
  )
}
