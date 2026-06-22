import { useMemo, useState } from 'react'
import {
  ChevronLeft, ChevronDown, ChevronRight, Plus, Search, Check, Trash2, Pencil,
} from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import CategoryIcon from '../components/CategoryIcon.jsx'
import Modal from '../components/Modal.jsx'
import { Segmented } from '../components/ui.jsx'

export default function Categories({ onClose, selectedId, onPick }) {
  const { state, addCategory, renameCategory, deleteCategory, t } = useStore()
  const [kind, setKind] = useState('expense')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(() => new Set())
  // dialog: { mode: 'add'|'sub'|'rename', parentId, targetId, parentName }
  const [dialog, setDialog] = useState(null)
  const [value, setValue] = useState('')
  const [confirmDel, setConfirmDel] = useState(null) // kategorie ke smazání

  const childrenByParent = useMemo(() => {
    const map = {}
    for (const c of state.categories) {
      if (c.kind !== kind) continue
      ;(map[c.parentId || 'root'] ||= []).push(c)
    }
    return map
  }, [state.categories, kind])

  const toggle = (id) =>
    setExpanded((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const openAdd = () => {
    setValue('')
    setDialog({ mode: 'add', parentId: null })
  }
  const openSub = (parent) => {
    setValue('')
    setDialog({ mode: 'sub', parentId: parent.id, parentName: parent.name })
  }
  const openRename = (cat) => {
    setValue(cat.name)
    setDialog({ mode: 'rename', targetId: cat.id })
  }

  const submit = () => {
    const name = value.trim()
    if (!name) return
    if (dialog.mode === 'rename') renameCategory(dialog.targetId, name)
    else {
      const created = addCategory({ name, parentId: dialog.parentId, kind })
      if (dialog.parentId) setExpanded((s) => new Set(s).add(dialog.parentId))
      void created
    }
    setDialog(null)
  }

  // Vyhledávání: plochý seznam shod v aktuálním druhu
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return state.categories.filter((c) => c.kind === kind && c.name.toLowerCase().includes(q))
  }, [query, state.categories, kind])

  const Row = ({ cat, depth }) => {
    const kids = childrenByParent[cat.id] || []
    const hasKids = kids.length > 0
    const isOpen = expanded.has(cat.id)
    const isSelected = selectedId === cat.id
    return (
      <>
        <div
          className={
            'flex items-center rounded-xl px-2 py-2.5 ' +
            (isSelected ? 'bg-accent-light' : '')
          }
          style={{ paddingLeft: 8 + depth * 18 }}
        >
          <button
            onClick={() => (hasKids ? toggle(cat.id) : onPick ? onPick(cat) : openRename(cat))}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            {hasKids ? (
              isOpen ? (
                <ChevronDown size={18} className="text-ink-soft flex-shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-ink-soft flex-shrink-0" />
              )
            ) : (
              <span className="w-[18px] flex-shrink-0" />
            )}
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: (cat.color || '#94A3B8') + '22', color: cat.color || '#64748B' }}
            >
              <CategoryIcon icon={cat.icon} size={15} />
            </span>
            <span className={'truncate ' + (depth === 0 ? 'font-bold text-ink' : 'text-ink-soft')}>
              {cat.name}
            </span>
            {isSelected && <Check size={18} className="ml-1 text-accent-dark flex-shrink-0" />}
          </button>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => openRename(cat)}
              className="w-8 h-8 flex items-center justify-center text-ink-mute"
              aria-label="Přejmenovat"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setConfirmDel(cat)}
              className="w-8 h-8 flex items-center justify-center text-expense/80"
              aria-label="Smazat"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={() => openSub(cat)}
              className="w-8 h-8 flex items-center justify-center text-ink-soft"
              aria-label="Přidat podkategorii"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        {hasKids && isOpen && kids.map((k) => <Row key={k.id} cat={k} depth={depth + 1} />)}
      </>
    )
  }

  const roots = childrenByParent['root'] || []

  return (
    <div className="absolute inset-0 z-40 bg-bg flex flex-col pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <button onClick={onClose} className="w-9 h-9 -ml-1 flex items-center justify-center text-ink">
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-xl font-extrabold text-ink">{t('cat.title')}</h1>
      </div>

      <div className="px-5 pb-3">
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'expense', label: t('common.expense') },
            { value: 'income', label: t('common.income') },
          ]}
        />
      </div>

      <div className="px-5 flex items-center gap-2 pb-2">
        <div className="flex-1 h-12 rounded-2xl bg-card border border-line flex items-center px-3 gap-2">
          <Search size={18} className="text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search')}
            className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-mute"
          />
        </div>
        <button
          onClick={openAdd}
          className="w-12 h-12 rounded-2xl bg-accent text-accent-ink flex items-center justify-center shadow-sm flex-shrink-0"
          aria-label="Přidat kategorii"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-8">
        {searchResults ? (
          searchResults.length === 0 ? (
            <p className="text-center text-ink-mute py-10">{t('cat.notFound')}</p>
          ) : (
            searchResults.map((c) => <Row key={c.id} cat={c} depth={0} />)
          )
        ) : (
          roots.map((c) => <Row key={c.id} cat={c} depth={0} />)
        )}
      </div>

      {/* Dialog přidání / přejmenování */}
      <Modal
        open={!!dialog}
        onClose={() => setDialog(null)}
        title={
          dialog?.mode === 'rename'
            ? t('cat.rename')
            : dialog?.mode === 'sub'
            ? t('cat.newSub')
            : t('cat.new')
        }
        description={
          dialog?.mode === 'sub'
            ? t('cat.subDesc', { parent: dialog?.parentName })
            : dialog?.mode === 'add'
            ? t(kind === 'expense' ? 'cat.newDescExpense' : 'cat.newDescIncome')
            : undefined
        }
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t('cat.namePlaceholder')}
          className="w-full h-12 px-4 rounded-2xl bg-bg border-2 border-accent outline-none text-ink placeholder:text-ink-mute"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setDialog(null)}
            className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft"
          >
            {t('common.cancel')}
          </button>
          <button onClick={submit} className="flex-1 h-12 rounded-2xl bg-accent text-accent-ink font-bold">
            {dialog?.mode === 'rename' ? t('common.save') : t('common.add')}
          </button>
        </div>
      </Modal>

      {/* Potvrzení smazání */}
      <Modal
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title={t('cat.deleteTitle')}
        description={t('cat.deleteDesc', { name: confirmDel?.name })}
      >
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDel(null)}
            className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={() => {
              deleteCategory(confirmDel.id)
              setConfirmDel(null)
            }}
            className="flex-1 h-12 rounded-2xl bg-expense text-white font-bold"
          >
            {t('common.delete')}
          </button>
        </div>
      </Modal>
    </div>
  )
}
