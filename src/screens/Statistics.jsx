import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Settings, TrendingDown, TrendingUp } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { transactionsInRange, totals } from '../lib/recurrence.js'
import { periodRange } from '../lib/period.js'
import { bucketize, aggregateByBucket, tickInterval } from '../lib/analytics.js'
import { rootCategory } from '../lib/categories.js'
import { formatMoney } from '../lib/format.js'
import { Card, SectionTitle } from '../components/ui.jsx'
import PeriodNav from '../components/PeriodNav.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'

const compact = (n) => (Math.abs(n) >= 1000 ? `${Math.round(n / 1000)}k` : String(n))

export default function Statistics({ period, setPeriod, onOpenCategories }) {
  const { state, categoryMap, activeBudget } = useStore()

  const monthOcc = useMemo(() => {
    const { from, to } = periodRange(period)
    return transactionsInRange(state.transactions, activeBudget.id, from, to)
  }, [state.transactions, activeBudget.id, period])
  const sums = useMemo(() => totals(monthOcc), [monthOcc])

  // Výdaje dle kořenové kategorie (sestupně)
  const byCat = useMemo(() => {
    const acc = {}
    for (const o of monthOcc) {
      if (o.type !== 'expense') continue
      const root = rootCategory(categoryMap, o.categoryId)
      const key = root ? root.id : 'jine'
      if (!acc[key])
        acc[key] = { name: root?.name || 'Ostatní', icon: root?.icon, color: root?.color || '#94A3B8', value: 0 }
      acc[key].value += o.amount
    }
    return Object.values(acc).sort((a, b) => b.value - a.value)
  }, [monthOcc, categoryMap])
  const maxCat = byCat.length ? byCat[0].value : 0

  // Příjmy vs Výdaje napříč obdobím (koše dle délky období)
  const trend = useMemo(() => {
    const { from, to } = periodRange(period)
    return aggregateByBucket(monthOcc, bucketize(from, to, { coarse: true }))
  }, [monthOcc, period])

  const savings = sums.income - sums.expense
  const rate = sums.income > 0 ? (savings / sums.income) * 100 : 0

  return (
    <div className="px-5">
      <div className="flex items-center justify-between pt-2 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Statistiky</h1>
        <button
          onClick={onOpenCategories}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft"
          aria-label="Spravovat kategorie"
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="mb-4">
        <PeriodNav period={period} onChange={setPeriod} variant="boxed" />
      </div>

      {/* Souhrnné karty */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-ink-soft text-sm mb-1">
            <TrendingDown size={16} className="text-expense" /> Výdaje
          </div>
          <div className="text-2xl font-extrabold text-ink">{formatMoney(sums.expense)}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-ink-soft text-sm mb-1">
            <TrendingUp size={16} className="text-income" /> Příjmy
          </div>
          <div className="text-2xl font-extrabold text-ink">{formatMoney(sums.income)}</div>
        </Card>
      </div>

      {/* Výdaje dle kategorie */}
      <Card className="p-4 mb-4">
        <SectionTitle>Výdaje dle kategorie</SectionTitle>
        {byCat.length === 0 ? (
          <p className="text-sm text-ink-mute py-4 text-center">Žádné výdaje v tomto měsíci.</p>
        ) : (
          <div className="space-y-4">
            {byCat.map((c, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: c.color + '22', color: c.color }}
                  >
                    <CategoryIcon icon={c.icon} size={16} />
                  </span>
                  <span className="font-semibold text-ink flex-1">{c.name}</span>
                  <span className="font-bold text-ink">{formatMoney(c.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-line-soft overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${maxCat ? (c.value / maxCat) * 100 : 0}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Příjmy vs Výdaje */}
      <Card className="p-4 mb-4">
        <SectionTitle>Příjmy vs Výdaje</SectionTitle>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-income-light text-income text-sm font-semibold flex items-center gap-1">
            <TrendingUp size={14} /> Příjmy
          </span>
          <span className="px-3 py-1 rounded-full bg-expense-light text-expense text-sm font-semibold flex items-center gap-1">
            <TrendingDown size={14} /> Výdaje
          </span>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9AA0A8' }} tickLine={false} axisLine={false} interval={tickInterval(trend.length)} />
              <YAxis tick={{ fontSize: 11, fill: '#9AA0A8' }} tickFormatter={compact} tickLine={false} axisLine={false} width={42} />
              <Tooltip formatter={(v) => formatMoney(v)} cursor={{ fill: '#F4F4F7' }} />
              <Bar dataKey="Příjmy" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Výdaje" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Souhrn období */}
      <Card className="p-4 mb-2">
        <SectionTitle>Souhrn období</SectionTitle>
        <div className="divide-y divide-line">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-ink-soft">Celkové příjmy</span>
            <span className="font-bold text-income">{formatMoney(sums.income)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-ink-soft">Celkové výdaje</span>
            <span className="font-bold text-expense">{formatMoney(sums.expense)}</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="font-bold text-ink">Úspory</span>
            <span className={'font-extrabold ' + (savings >= 0 ? 'text-income' : 'text-expense')}>
              {savings >= 0 ? '+' : ''}
              {formatMoney(savings)}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-ink">Míra úspor</span>
            <span className="text-sm font-bold text-ink">{rate.toFixed(1)} %</span>
          </div>
          <div className="h-2.5 rounded-full bg-line-soft overflow-hidden">
            <div
              className="h-full rounded-full bg-income"
              style={{ width: `${Math.max(0, Math.min(100, rate))}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
