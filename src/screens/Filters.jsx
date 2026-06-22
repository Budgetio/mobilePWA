import { useState } from 'react'
import { ChevronLeft, X, ArrowDownToLine, ArrowUpToLine, RotateCcw, Check, Tag } from 'lucide-react'
import Dropdown from '../components/Dropdown.jsx'
import { Segmented } from '../components/ui.jsx'
import { flatCategoryOptions } from '../lib/categories.js'
import { defaultFilters } from '../lib/filters.js'

export default function Filters({ filters, budgets, categories, onApply, onClose }) {
  const [draft, setDraft] = useState(filters)
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const catOptions = [{ value: 'all', label: 'Všechny kategorie' }, ...flatCategoryOptions(categories)]

  const toggleBudget = (id) =>
    set({
      budgetIds: draft.budgetIds.includes(id)
        ? draft.budgetIds.filter((x) => x !== id)
        : [...draft.budgetIds, id],
    })

  const allSelected = draft.budgetIds.length === budgets.length

  const Section = ({ title, right, children }) => (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  )

  return (
    <div className="absolute inset-0 z-40 bg-bg flex flex-col">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <button onClick={onClose} className="w-9 h-9 -ml-1 flex items-center justify-center text-ink">
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-xl font-extrabold text-ink">Filtry</h1>
        <button onClick={onClose} className="ml-auto w-9 h-9 flex items-center justify-center text-ink-soft">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-32">
        <Section title="Kategorie">
          <Dropdown
            value={draft.categoryId}
            options={catOptions}
            onChange={(v) => set({ categoryId: v })}
            leftIcon={<Tag size={16} />}
          />
        </Section>

        <Section
          title="Rozpočet"
          right={
            <button
              onClick={() => set({ budgetIds: allSelected ? [] : budgets.map((b) => b.id) })}
              className="text-sm font-semibold text-accent-dark"
            >
              {allSelected ? 'Zrušit vše' : 'Vybrat vše'}
            </button>
          }
        >
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => {
              const active = draft.budgetIds.includes(b.id)
              return (
                <button
                  key={b.id}
                  onClick={() => toggleBudget(b.id)}
                  className={
                    'px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-1.5 ' +
                    (active ? 'bg-accent border-accent text-accent-ink' : 'bg-card border-line text-ink-soft')
                  }
                >
                  {active && <Check size={14} />}
                  {b.name}
                </button>
              )
            })}
          </div>
        </Section>

        <Section title="Typ transakce">
          <Segmented
            value={draft.type}
            onChange={(v) => set({ type: v })}
            options={[
              { value: 'all', label: 'Vše' },
              { value: 'income', label: 'Příjmy' },
              { value: 'expense', label: 'Výdaje' },
            ]}
          />
        </Section>

        <Section title="Opakování">
          <Segmented
            value={draft.recurrence}
            onChange={(v) => set({ recurrence: v })}
            options={[
              { value: 'all', label: 'Vše' },
              { value: 'recurring', label: 'Opakované' },
              { value: 'oneoff', label: 'Jednorázové' },
            ]}
          />
        </Section>

        <Section title="Rozsah částky">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-12 rounded-2xl bg-card border border-line flex items-center px-3 gap-2">
              <ArrowDownToLine size={16} className="text-ink-mute" />
              <input
                value={draft.min}
                onChange={(e) => set({ min: e.target.value })}
                inputMode="decimal"
                placeholder="Min"
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-mute w-full"
              />
            </div>
            <span className="text-ink-mute">–</span>
            <div className="flex-1 h-12 rounded-2xl bg-card border border-line flex items-center px-3 gap-2">
              <ArrowUpToLine size={16} className="text-ink-mute" />
              <input
                value={draft.max}
                onChange={(e) => set({ max: e.target.value })}
                inputMode="decimal"
                placeholder="Max"
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-mute w-full"
              />
            </div>
          </div>
        </Section>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-bg/95 backdrop-blur px-5 py-4 flex items-center gap-3 border-t border-line">
        <button
          onClick={() => setDraft(defaultFilters(budgets))}
          className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} /> Resetovat
        </button>
        <button
          onClick={() => {
            onApply(draft)
            onClose()
          }}
          className="flex-1 h-12 rounded-2xl bg-accent text-accent-ink font-bold flex items-center justify-center gap-2"
        >
          <Check size={18} /> Použít filtry
        </button>
      </div>
    </div>
  )
}
