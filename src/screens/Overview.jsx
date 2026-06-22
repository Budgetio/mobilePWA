import { useMemo } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Bell, Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { transactionsInRange, totals } from '../lib/recurrence.js'
import { periodRange } from '../lib/period.js'
import { bucketize, aggregateByBucket, cumulative, tickInterval } from '../lib/analytics.js'
import { rootCategory, categoryById } from '../lib/categories.js'
import { formatMoney, formatSigned, formatDate } from '../lib/format.js'
import { Card, SectionTitle } from '../components/ui.jsx'
import PeriodNav from '../components/PeriodNav.jsx'
import Dropdown from '../components/Dropdown.jsx'

const compact = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1000) return `${Math.round(n / 1000)}k`
  return String(n)
}

function groupByRoot(occ, map) {
  const acc = {}
  for (const o of occ) {
    const root = rootCategory(map, o.categoryId)
    const key = root ? root.id : 'jine'
    if (!acc[key])
      acc[key] = { name: root ? root.name : 'Ostatní', color: root ? root.color : '#94A3B8', value: 0 }
    acc[key].value += o.amount
  }
  return Object.values(acc).sort((a, b) => b.value - a.value)
}

function Donut({ title, data }) {
  const { t } = useStore()
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <Card className="p-4 flex-1">
      <h3 className="font-bold text-ink mb-2">{title}</h3>
      {total === 0 ? (
        <p className="text-sm text-ink-mute py-8 text-center">{t('common.noData')}</p>
      ) : (
        <>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={34} outerRadius={56} paddingAngle={2} stroke="none">
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {data.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-ink-soft truncate flex-1">{d.name}</span>
                <span className="text-ink-mute">{Math.round((d.value / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}

export default function Overview({ period, setPeriod, onEdit }) {
  const { state, categoryMap, activeBudget, setActiveBudget, t } = useStore()

  const monthOcc = useMemo(() => {
    const { from, to } = periodRange(period)
    return transactionsInRange(state.transactions, activeBudget.id, from, to)
  }, [state.transactions, activeBudget.id, period])
  const sums = useMemo(() => totals(monthOcc), [monthOcc])

  // Peněžní tok – kumulativní příjmy a výdaje (jemné koše)
  const cashflow = useMemo(() => {
    const { from, to } = periodRange(period)
    return cumulative(aggregateByBucket(monthOcc, bucketize(from, to)))
  }, [monthOcc, period])

  // Změny – po koších (hrubší dělení)
  const weekly = useMemo(() => {
    const { from, to } = periodRange(period)
    return aggregateByBucket(monthOcc, bucketize(from, to, { coarse: true }))
  }, [monthOcc, period])

  const planned = useMemo(
    () => monthOcc.filter((o) => o.planned && o.type === 'expense').sort((a, b) => (a.date < b.date ? -1 : 1)),
    [monthOcc]
  )

  const expenseByCat = useMemo(
    () => groupByRoot(monthOcc.filter((o) => o.type === 'expense'), categoryMap),
    [monthOcc, categoryMap]
  )
  const incomeByCat = useMemo(
    () => groupByRoot(monthOcc.filter((o) => o.type === 'income'), categoryMap),
    [monthOcc, categoryMap]
  )

  const budgetOptions = state.budgets.map((b) => ({ value: b.id, label: b.name }))

  return (
    <div className="px-5">
      <div className="flex items-center justify-between px-0 pt-2 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{t('ov.title')}</h1>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft" aria-label={t('ov.title')}>
          <Bell size={22} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <PeriodNav period={period} onChange={setPeriod} variant="boxed" />
        </div>
        <div className="w-32">
          <Dropdown value={activeBudget.id} options={budgetOptions} onChange={setActiveBudget} />
        </div>
      </div>

      {/* Souhrnné karty */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <Card className="p-3">
          <div className="flex items-center gap-1 text-ink-soft text-xs mb-1">
            <Wallet size={14} /> {t('ov.balance')}
          </div>
          <div className={'text-base font-extrabold ' + (sums.balance < 0 ? 'text-expense' : 'text-ink')}>
            {formatMoney(sums.balance)}
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1 text-income text-xs mb-1">
            <TrendingUp size={14} /> {t('common.income')}
          </div>
          <div className="text-base font-extrabold text-income">{formatMoney(sums.income)}</div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1 text-expense text-xs mb-1">
            <TrendingDown size={14} /> {t('common.expense')}
          </div>
          <div className="text-base font-extrabold text-expense">{formatMoney(sums.expense)}</div>
        </Card>
      </div>

      {/* Peněžní tok */}
      <Card className="p-4 mb-4">
        <SectionTitle>{t('ov.cashflow')}</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cashflow} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9AA0A8' }} interval={tickInterval(cashflow.length)} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9AA0A8' }} tickFormatter={compact} tickLine={false} axisLine={false} width={42} />
              <Tooltip formatter={(v) => formatMoney(v)} />
              <Line type="monotone" dataKey="Příjmy" stroke="#16A34A" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Výdaje" stroke="#DC2626" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-income" /> {t('common.income')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-expense" /> {t('common.expense')}</span>
        </div>
      </Card>

      {/* Plánované výdaje */}
      <div className="mb-4">
        <SectionTitle>{t('ov.planned')}</SectionTitle>
        {planned.length === 0 ? (
          <Card className="p-4 text-sm text-ink-mute text-center">{t('ov.noPlanned')}</Card>
        ) : (
          <div className="space-y-2.5">
            {planned.slice(0, 5).map((o) => {
              const cat = categoryById(categoryMap, o.categoryId)
              return (
                <button
                  key={o.occId}
                  onClick={() => onEdit && onEdit(o)}
                  className="w-full text-left bg-card rounded-2xl shadow-card px-3 py-3 flex items-center gap-3 opacity-90"
                >
                  <div className="w-11 h-11 rounded-xl bg-line-soft flex items-center justify-center text-ink-mute flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink truncate">{o.name}</div>
                    <div className="text-sm text-ink-mute">{formatDate(o.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-ink-soft">{formatSigned('expense', o.amount)}</div>
                    <div className="text-sm text-ink-mute">{cat?.name || '—'}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Změny */}
      <Card className="p-4 mb-4">
        <SectionTitle>{t('ov.changes')}</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} margin={{ top: 5, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F2" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9AA0A8' }} tickLine={false} axisLine={false} interval={tickInterval(weekly.length, 7)} />
              <YAxis tick={{ fontSize: 11, fill: '#9AA0A8' }} tickFormatter={compact} tickLine={false} axisLine={false} width={42} />
              <Tooltip formatter={(v) => formatMoney(v)} cursor={{ fill: '#F4F4F7' }} />
              <Bar dataKey="Příjmy" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Výdaje" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Donuty */}
      <div className="flex gap-3 mb-2">
        <Donut title={t('common.expense')} data={expenseByCat} />
        <Donut title={t('common.income')} data={incomeByCat} />
      </div>
    </div>
  )
}
