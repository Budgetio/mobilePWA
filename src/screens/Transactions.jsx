import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, Inbox } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { transactionsInRange, totals } from '../lib/recurrence.js'
import { periodRange } from '../lib/period.js'
import { categoryById, categoryWithDescendants } from '../lib/categories.js'
import { formatMoney } from '../lib/format.js'
import { ScreenHeader, EmptyState } from '../components/ui.jsx'
import PeriodNav from '../components/PeriodNav.jsx'
import TransactionRow from '../components/TransactionRow.jsx'
import Filters from './Filters.jsx'
import { defaultFilters, activeFilterCount } from '../lib/filters.js'

function pluralTx(n) {
  if (n === 1) return 'transakce'
  if (n >= 2 && n <= 4) return 'transakce'
  return 'transakcí'
}

export default function Transactions({ period, setPeriod, onEdit }) {
  const { state, categoryMap } = useStore()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(() => defaultFilters(state.budgets))
  const [filtersOpen, setFiltersOpen] = useState(false)

  const rangeOcc = useMemo(() => {
    const { from, to } = periodRange(period)
    return transactionsInRange(state.transactions, filters.budgetIds, from, to)
  }, [state.transactions, filters.budgetIds, period])

  // shoda kategorie (vč. podkategorií)
  const catSet = useMemo(
    () => (filters.categoryId !== 'all' ? categoryWithDescendants(state.categories, filters.categoryId) : null),
    [filters.categoryId, state.categories]
  )

  // filtry mimo "typ" – pro souhrnné karty
  const scopeOcc = useMemo(() => {
    const q = query.trim().toLowerCase()
    const min = filters.min ? Number(String(filters.min).replace(',', '.')) : null
    const max = filters.max ? Number(String(filters.max).replace(',', '.')) : null
    return rangeOcc.filter((o) => {
      if (catSet && !catSet.has(o.categoryId)) return false
      if (filters.recurrence === 'recurring' && !o.isRecurringInstance) return false
      if (filters.recurrence === 'oneoff' && o.isRecurringInstance) return false
      if (min != null && o.amount < min) return false
      if (max != null && o.amount > max) return false
      if (q) {
        const cat = categoryById(categoryMap, o.categoryId)
        if (!o.name.toLowerCase().includes(q) && !(cat && cat.name.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [rangeOcc, query, filters, catSet, categoryMap])

  const filtered = useMemo(
    () => scopeOcc.filter((o) => filters.type === 'all' || o.type === filters.type),
    [scopeOcc, filters.type]
  )

  const sums = useMemo(() => totals(scopeOcc), [scopeOcc])
  const fCount = activeFilterCount(filters, state.budgets)

  return (
    <div className="px-5">
      <ScreenHeader
        title="Transakce"
        right={
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft relative"
            aria-label="Filtry"
          >
            <SlidersHorizontal size={22} />
            {fCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-ink text-[10px] font-bold flex items-center justify-center">
                {fCount}
              </span>
            )}
          </button>
        }
      />

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
          onClick={() => setFiltersOpen(true)}
          className="h-12 px-4 rounded-2xl bg-accent text-accent-ink font-semibold flex items-center gap-2 relative"
        >
          <SlidersHorizontal size={18} /> Filtry
          {fCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent-ink text-accent text-[11px] font-bold flex items-center justify-center">
              {fCount}
            </span>
          )}
        </button>
      </div>

      {/* Období */}
      <div className="mb-2">
        <PeriodNav period={period} onChange={setPeriod} variant="arrowsOutside" />
      </div>
      <div className="text-right text-sm text-ink-mute mb-3">
        {filtered.length} {pluralTx(filtered.length)}
      </div>

      {/* Seznam */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox size={22} />}
          title="Žádné transakce"
          subtitle="Zkuste upravit filtry nebo přidat transakci tlačítkem +"
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

      {filtersOpen && (
        <Filters
          filters={filters}
          budgets={state.budgets}
          categories={state.categories}
          onApply={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  )
}
