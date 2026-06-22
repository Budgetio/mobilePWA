import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Inbox } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { transactionsForMonth, totals } from '../lib/recurrence.js'
import { categoryById } from '../lib/categories.js'
import { formatMoney } from '../lib/format.js'
import { ScreenHeader, Segmented, EmptyState } from '../components/ui.jsx'
import MonthNav from '../components/MonthNav.jsx'
import TransactionRow from '../components/TransactionRow.jsx'
import Dropdown from '../components/Dropdown.jsx'

export default function Transactions({ year, month, setMonth, onEdit }) {
  const { state, categoryMap, activeBudget, setActiveBudget } = useStore()
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')

  const monthOcc = useMemo(
    () => transactionsForMonth(state.transactions, activeBudget.id, year, month),
    [state.transactions, activeBudget.id, year, month]
  )

  const sums = useMemo(() => totals(monthOcc), [monthOcc])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return monthOcc.filter((o) => {
      if (typeFilter !== 'all' && o.type !== typeFilter) return false
      if (!q) return true
      const cat = categoryById(categoryMap, o.categoryId)
      return (
        o.name.toLowerCase().includes(q) ||
        (cat && cat.name.toLowerCase().includes(q))
      )
    })
  }, [monthOcc, query, typeFilter, categoryMap])

  const budgetOptions = state.budgets.map((b) => ({ value: b.id, label: b.name }))

  return (
    <div className="px-5">
      <ScreenHeader
        title="Transakce"
        right={
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={
              'w-10 h-10 rounded-xl flex items-center justify-center ' +
              (showFilters ? 'bg-accent text-accent-ink' : 'text-ink-soft')
            }
            aria-label="Filtry"
          >
            <SlidersHorizontal size={22} />
          </button>
        }
      />

      {/* Přepínač rozpočtu */}
      <div className="mb-3">
        <Dropdown
          value={activeBudget.id}
          options={budgetOptions}
          onChange={setActiveBudget}
        />
      </div>

      {/* Souhrnné karty */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl bg-income-light px-4 py-3">
          <div className="text-sm font-medium text-income/80">Příjmy</div>
          <div className="text-xl font-extrabold text-income">+{formatMoney(sums.income)}</div>
        </div>
        <div className="rounded-2xl bg-expense-light px-4 py-3">
          <div className="text-sm font-medium text-expense/80">Výdaje</div>
          <div className="text-xl font-extrabold text-expense">-{formatMoney(sums.expense)}</div>
        </div>
      </div>

      {/* Hledání + filtr */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-12 rounded-2xl bg-card border border-line flex items-center px-3 gap-2">
          <Search size={18} className="text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat..."
            className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-mute"
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="h-12 px-4 rounded-2xl bg-accent text-accent-ink font-semibold flex items-center gap-2"
        >
          <SlidersHorizontal size={18} /> Filtry
        </button>
      </div>

      {showFilters && (
        <div className="mb-3">
          <Segmented
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: 'all', label: 'Vše' },
              { value: 'income', label: 'Příjmy' },
              { value: 'expense', label: 'Výdaje' },
            ]}
          />
          <p className="text-xs text-ink-mute mt-2">Pokročilé filtry přibudou ve fázi 3.</p>
        </div>
      )}

      {/* Měsíc */}
      <div className="mb-2">
        <MonthNav year={year} month={month} onChange={setMonth} variant="arrowsOutside" />
      </div>
      <div className="text-right text-sm text-ink-mute mb-3">
        {filtered.length}{' '}
        {filtered.length === 1 ? 'transakce' : filtered.length >= 2 && filtered.length <= 4 ? 'transakce' : 'transakcí'}
      </div>

      {/* Seznam */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox size={22} />}
          title="Žádné transakce"
          subtitle="Přidejte první transakci tlačítkem +"
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((occ) => (
            <TransactionRow
              key={occ.occId}
              occ={occ}
              category={categoryById(categoryMap, occ.categoryId)}
              onClick={() => onEdit && onEdit(occ)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
