import { useEffect, useRef, useState } from 'react'
import {
  Settings, Globe, Tag, Pencil, Trash2, Plus, Download, Upload, Database,
  Grid3x3, RotateCcw, Smartphone, Check,
} from 'lucide-react'
import { useStore } from '../store/StoreProvider.jsx'
import { Card } from '../components/ui.jsx'
import Modal from '../components/Modal.jsx'
import Dropdown from '../components/Dropdown.jsx'
import { downloadJSON, readBackupFile } from '../lib/backup.js'

function initials(name) {
  return (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function Profile({ onOpenCategories }) {
  const { state, updateProfile, addTag, renameTag, deleteTag, importState, resetAll } = useStore()
  const profile = state.settings.profile

  const [editProfile, setEditProfile] = useState(false)
  const [name, setName] = useState(profile.name || '')
  const [email, setEmail] = useState(profile.email || '')

  const [tagDialog, setTagDialog] = useState(null) // {mode:'add'|'rename', id, value}
  const [tagValue, setTagValue] = useState('')
  const [confirmTag, setConfirmTag] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [message, setMessage] = useState('')

  const fileRef = useRef(null)
  const [installEvt, setInstallEvt] = useState(null)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setInstallEvt(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const flash = (m) => {
    setMessage(m)
    setTimeout(() => setMessage(''), 2500)
  }

  const saveProfile = () => {
    updateProfile({ name: name.trim() || 'Uživatel', email: email.trim() })
    setEditProfile(false)
  }

  const submitTag = () => {
    const v = tagValue.trim()
    if (!v) return
    if (tagDialog.mode === 'add') addTag(v)
    else renameTag(tagDialog.id, v)
    setTagDialog(null)
  }

  const onImportFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = await readBackupFile(file)
      importState(data)
      flash('Záloha byla importována.')
    } catch (err) {
      flash(err.message || 'Import se nezdařil.')
    }
  }

  const install = async () => {
    if (!installEvt) return
    installEvt.prompt()
    await installEvt.userChoice
    setInstallEvt(null)
  }

  const SettingsRow = ({ icon, label, onClick, danger }) => (
    <button
      onClick={onClick}
      className={
        'w-full flex items-center gap-3 px-4 py-3.5 ' + (danger ? 'text-expense' : 'text-ink')
      }
    >
      <span className={danger ? 'text-expense' : 'text-ink-soft'}>{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  )

  return (
    <div className="px-5">
      <div className="flex items-center justify-between pt-2 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Profil</h1>
        <button onClick={onOpenCategories} className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-soft" aria-label="Nastavení">
          <Settings size={22} />
        </button>
      </div>

      {/* Hlavička profilu */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-accent-light text-accent-dark flex items-center justify-center text-3xl font-extrabold mb-3">
          {initials(profile.name)}
        </div>
        <h2 className="text-xl font-extrabold text-ink">{profile.name}</h2>
        <p className="text-ink-mute">{profile.email}</p>
        <button
          onClick={() => {
            setName(profile.name || '')
            setEmail(profile.email || '')
            setEditProfile(true)
          }}
          className="mt-2 text-sm font-semibold text-accent-dark flex items-center gap-1"
        >
          <Pencil size={14} /> Upravit
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl bg-income-light text-income px-4 py-3 text-sm font-medium flex items-center gap-2">
          <Check size={16} /> {message}
        </div>
      )}

      {/* Jazyk */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={18} className="text-ink-soft" />
          <h3 className="font-bold text-ink">Jazyk</h3>
        </div>
        <p className="text-sm text-ink-mute mb-3">Jazyk aplikace</p>
        <Dropdown value="cs" options={[{ value: 'cs', label: 'Čeština' }]} onChange={() => {}} />
      </Card>

      {/* Záloha dat */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Database size={18} className="text-ink-soft" />
          <h3 className="font-bold text-ink">Záloha dat</h3>
        </div>
        <p className="text-sm text-ink-mute mb-3">
          Data jsou uložena jen v tomto prohlížeči. Zálohu si stáhněte do souboru, nebo ji obnovte.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => downloadJSON(state)}
            className="flex-1 h-11 rounded-2xl bg-accent text-accent-ink font-semibold flex items-center justify-center gap-2"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 h-11 rounded-2xl border border-line font-semibold text-ink flex items-center justify-center gap-2"
          >
            <Upload size={18} /> Import
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onImportFile} />
        </div>
      </Card>

      {/* Nastavení */}
      <Card className="mb-4 overflow-hidden divide-y divide-line">
        <SettingsRow icon={<Grid3x3 size={20} />} label="Spravovat kategorie" onClick={onOpenCategories} />
        {installEvt && <SettingsRow icon={<Smartphone size={20} />} label="Instalovat aplikaci" onClick={install} />}
      </Card>

      {/* Správa štítků */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Tag size={18} className="text-ink-soft" />
          <h3 className="font-bold text-ink">Správa štítků</h3>
        </div>
        <p className="text-sm text-ink-mute mb-3">Přidejte, upravte nebo odstraňte štítky pro transakce.</p>
        <div className="space-y-2">
          {state.tags.map((t) => (
            <div key={t.id} className="flex items-center gap-2 bg-bg rounded-xl px-3 py-2.5">
              <Tag size={16} className="text-ink-mute" />
              <span className="flex-1 font-medium text-ink">{t.name}</span>
              <button
                onClick={() => {
                  setTagValue(t.name)
                  setTagDialog({ mode: 'rename', id: t.id })
                }}
                className="w-8 h-8 flex items-center justify-center text-ink-soft"
                aria-label="Upravit štítek"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setConfirmTag(t)}
                className="w-8 h-8 flex items-center justify-center text-expense/80"
                aria-label="Smazat štítek"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {state.tags.length === 0 && <p className="text-sm text-ink-mute">Zatím žádné štítky.</p>}
        </div>
        <button
          onClick={() => {
            setTagValue('')
            setTagDialog({ mode: 'add' })
          }}
          className="w-full mt-3 h-11 rounded-2xl border-2 border-accent text-accent-dark font-semibold flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Přidat štítek
        </button>
      </Card>

      {/* Reset dat */}
      <button
        onClick={() => setConfirmReset(true)}
        className="w-full h-12 rounded-2xl bg-expense text-white font-bold flex items-center justify-center gap-2 mb-2"
      >
        <RotateCcw size={18} /> Resetovat data
      </button>

      {/* Dialog úpravy profilu */}
      <Modal open={editProfile} onClose={() => setEditProfile(false)} title="Upravit profil">
        <label className="block text-sm font-semibold text-ink mb-1.5">Jméno</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-bg border border-line outline-none text-ink mb-3"
        />
        <label className="block text-sm font-semibold text-ink mb-1.5">E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-4 rounded-2xl bg-bg border border-line outline-none text-ink"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={() => setEditProfile(false)} className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft">
            Zrušit
          </button>
          <button onClick={saveProfile} className="flex-1 h-12 rounded-2xl bg-accent text-accent-ink font-bold">
            Uložit
          </button>
        </div>
      </Modal>

      {/* Dialog přidání/přejmenování štítku */}
      <Modal
        open={!!tagDialog}
        onClose={() => setTagDialog(null)}
        title={tagDialog?.mode === 'rename' ? 'Přejmenovat štítek' : 'Nový štítek'}
      >
        <input
          autoFocus
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitTag()}
          placeholder="Název štítku..."
          className="w-full h-12 px-4 rounded-2xl bg-bg border-2 border-accent outline-none text-ink"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={() => setTagDialog(null)} className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft">
            Zrušit
          </button>
          <button onClick={submitTag} className="flex-1 h-12 rounded-2xl bg-accent text-accent-ink font-bold">
            {tagDialog?.mode === 'rename' ? 'Uložit' : 'Přidat'}
          </button>
        </div>
      </Modal>

      {/* Potvrzení smazání štítku */}
      <Modal
        open={!!confirmTag}
        onClose={() => setConfirmTag(null)}
        title="Smazat štítek?"
        description={`Štítek "${confirmTag?.name}" bude odebrán ze všech transakcí.`}
      >
        <div className="flex gap-3">
          <button onClick={() => setConfirmTag(null)} className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft">
            Zrušit
          </button>
          <button
            onClick={() => {
              deleteTag(confirmTag.id)
              setConfirmTag(null)
            }}
            className="flex-1 h-12 rounded-2xl bg-expense text-white font-bold"
          >
            Smazat
          </button>
        </div>
      </Modal>

      {/* Potvrzení resetu */}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Resetovat data?"
        description="Všechny transakce, kategorie a štítky budou nahrazeny výchozími ukázkovými daty. Tuto akci nelze vrátit – nejdřív si případně stáhněte zálohu."
      >
        <div className="flex gap-3">
          <button onClick={() => setConfirmReset(false)} className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft">
            Zrušit
          </button>
          <button
            onClick={() => {
              resetAll()
              setConfirmReset(false)
              flash('Data byla obnovena na výchozí.')
            }}
            className="flex-1 h-12 rounded-2xl bg-expense text-white font-bold"
          >
            Resetovat
          </button>
        </div>
      </Modal>
    </div>
  )
}
