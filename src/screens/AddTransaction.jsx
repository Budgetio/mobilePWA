import { useMemo, useState } from 'react'
import { ChevronLeft, Calendar, Coins, Tag, Grid3x3, RefreshCw, Trash2, Check } from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { toISO } from '../lib/format.js'
import Dropdown from '../components/Dropdown.jsx'
import { Segmented } from '../components/ui.jsx'

// Vrátí kategorie daného druhu s hloubkou pro odsazení.
function categoryOptions(categories, kind) {
  const byParent = {}
  for (const c of categories) {
    if (c.kind !== kind) continue
    ;(byParent[c.parentId || 'root'] ||= []).push(c)
  }
  const out = []
  const walk = (parent, depth) => {
    for (const c of byParent[parent] || []) {
      out.push({ value: c.id, label: `${'  '.repeat(depth)}${c.name}` })
      walk(c.id, depth + 1)
    }
  }
  walk('root', 0)
  return out
}

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-ink mb-1.5">{children}</label>
)

const field =
  'w-full h-12 px-4 rounded-2xl bg-card border border-line outline-none text-ink placeholder:text-ink-mute'

export default function AddTransaction({ editing, defaultBudgetId, onClose, onManageCategories }) {
  const { state, addTransaction, updateTransaction, deleteTransaction } = useStore()
  const base = editing || null

  const [type, setType] = useState(base?.type || 'expense')
  const [budgetId, setBudgetId] = useState(base?.budgetId || defaultBudgetId)
  const [name, setName] = useState(base?.name || '')
  const [amount, setAmount] = useState(base ? String(base.amount) : '')
  const [date, setDate] = useState(base?.date || toISO(new Date()))
  const [recurring, setRecurring] = useState(!!base?.recurrence)
  const [startDate, setStartDate] = useState(base?.recurrence?.startDate || base?.date || toISO(new Date()))
  const [endDate, setEndDate] = useState(base?.recurrence?.endDate || '')
  const [categoryId, setCategoryId] = useState(base?.categoryId || '')
  const [tagIds, setTagIds] = useState(base?.tagIds || [])
  const [note, setNote] = useState(base?.note || '')
  const [error, setError] = useState('')

  const catOptions = useMemo(
    () => categoryOptions(state.categories, type),
    [state.categories, type]
  )
  const budgetOptions = state.budgets.map((b) => ({ value: b.id, label: b.name }))

  const toggleTag = (id) =>
    setTagIds((ids) => (ids.includes(id) ? ids.filter((t) => t !== id) : [...ids, id]))

  const onTypeChange = (t) => {
    setType(t)
    setCategoryId('') // kategorie se liší dle typu
  }

  const save = () => {
    const value = Number(String(amount).replace(',', '.'))
    if (!name.trim()) return setError('Zadejte název.')
    if (!value || value <= 0) return setError('Zadejte platnou částku.')

    const payload = {
      type,
      budgetId,
      name: name.trim(),
      amount: value,
      currency: 'CZK',
      categoryId: categoryId || null,
      tagIds,
      note: note.trim(),
      date: recurring ? startDate : date,
      recurrence: recurring
        ? { freq: 'monthly', startDate, endDate: endDate || null }
        : null,
    }

    if (base) updateTransaction(base.id, payload)
    else addTransaction(payload)
    onClose()
  }

  const remove = () => {
    if (base) deleteTransaction(base.id)
    onClose()
  }

  return (
    <div className="absolute inset-0 z-40 bg-bg flex flex-col">
      {/* Hlavička */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <button onClick={onClose} className="w-9 h-9 -ml-1 flex items-center justify-center text-ink">
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-xl font-extrabold text-ink">
          {base ? 'Upravit transakci' : 'Přidat transakci'}
        </h1>
        {base && (
          <button
            onClick={remove}
            className="ml-auto w-9 h-9 flex items-center justify-center text-expense"
            aria-label="Smazat"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32 space-y-4">
        {/* Typ */}
        <div className="bg-card rounded-2xl p-1 flex">
          {[
            { v: 'expense', l: 'Výdaj' },
            { v: 'income', l: 'Příjem' },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => onTypeChange(o.v)}
              className={
                'flex-1 h-11 rounded-xl font-semibold transition-colors ' +
                (type === o.v ? 'bg-accent text-accent-ink' : 'text-ink-soft')
              }
            >
              {o.l}
            </button>
          ))}
        </div>

        <div>
          <Label>Rozpočet</Label>
          <Dropdown value={budgetId} options={budgetOptions} onChange={setBudgetId} />
        </div>

        <div>
          <Label>Název</Label>
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Název" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Částka</Label>
            <div className="relative">
              <Coins size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute" />
              <input
                className={field + ' pl-10'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <Label>Měna</Label>
            <Dropdown value="CZK" options={[{ value: 'CZK', label: 'CZK' }]} onChange={() => {}} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>{recurring ? 'První datum' : 'Datum'}</Label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none" />
              <input
                type="date"
                className={field + ' pl-10'}
                value={recurring ? startDate : date}
                onChange={(e) => (recurring ? setStartDate(e.target.value) : setDate(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label>Opakování</Label>
            <Dropdown
              value={recurring ? 'monthly' : 'none'}
              options={[
                { value: 'none', label: 'Jednorázově' },
                { value: 'monthly', label: 'Měsíčně' },
              ]}
              onChange={(v) => setRecurring(v === 'monthly')}
              leftIcon={<RefreshCw size={16} />}
            />
          </div>
        </div>

        {recurring && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Datum začátku</Label>
              <input type="date" className={field} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Datum konce</Label>
              <input
                type="date"
                className={field}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="neurčito"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Kategorie</Label>
            {onManageCategories && (
              <button type="button" onClick={onManageCategories} className="text-sm font-semibold text-accent-dark">
                Spravovat
              </button>
            )}
          </div>
          <Dropdown
            value={categoryId}
            options={catOptions}
            onChange={setCategoryId}
            placeholder="Vyberte kategorii"
            leftIcon={<Grid3x3 size={16} />}
          />
        </div>

        <div>
          <Label>Štítky</Label>
          <div className="flex flex-wrap gap-2">
            {state.tags.map((t) => {
              const active = tagIds.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={
                    'px-3 py-2 rounded-full text-sm font-medium border flex items-center gap-1.5 ' +
                    (active ? 'bg-accent border-accent text-accent-ink' : 'bg-card border-line text-ink-soft')
                  }
                >
                  {active ? <Check size={14} /> : <Tag size={14} />}
                  {t.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label>Poznámka</Label>
          <textarea
            className="w-full min-h-[80px] px-4 py-3 rounded-2xl bg-card border border-line outline-none text-ink placeholder:text-ink-mute resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Poznámka"
          />
        </div>

        {error && <p className="text-sm text-expense font-medium">{error}</p>}
      </div>

      {/* Akce */}
      <div className="absolute bottom-0 inset-x-0 bg-bg/95 backdrop-blur px-5 py-4 flex items-center justify-end gap-3 border-t border-line">
        <button onClick={onClose} className="px-5 py-3 rounded-2xl text-ink-soft font-semibold">
          Zrušit
        </button>
        <button onClick={save} className="px-7 py-3 rounded-2xl bg-accent text-accent-ink font-bold shadow-sm">
          Uložit
        </button>
      </div>
    </div>
  )
}
