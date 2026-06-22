import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { useStore } from '../store/StoreProvider.jsx'
import { periodRange, rangePeriod, periodPresets, periodKey } from '../lib/period.js'

// Dialog pro výběr období: předvolby + vlastní rozsah od–do.
export default function PeriodPicker({ open, period, onClose, onApply }) {
  const { t } = useStore()
  const init = periodRange(period)
  const [from, setFrom] = useState(init.from)
  const [to, setTo] = useState(init.to)

  useEffect(() => {
    if (open) {
      const r = periodRange(period)
      setFrom(r.from)
      setTo(r.to)
    }
  }, [open, period])

  const presets = periodPresets()
  const currentKey = periodKey(period)

  const applyCustom = () => {
    if (!from || !to) return
    onApply(rangePeriod(from, to))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('pp.title')}>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => {
          const active = periodKey(p.period) === currentKey
          return (
            <button
              key={p.id}
              onClick={() => {
                onApply(p.period)
                onClose()
              }}
              className={
                'h-11 rounded-xl text-sm font-semibold border transition-colors ' +
                (active ? 'bg-accent border-accent text-accent-ink' : 'bg-bg border-line text-ink-soft')
              }
            >
              {t(p.tKey)}
            </button>
          )
        })}
      </div>

      <div className="my-4 border-t border-line" />

      <p className="text-sm font-semibold text-ink mb-2">{t('pp.custom')}</p>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="flex-1 h-11 px-3 rounded-xl bg-bg border border-line outline-none text-ink"
        />
        <span className="text-ink-mute">–</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="flex-1 h-11 px-3 rounded-xl bg-bg border border-line outline-none text-ink"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={onClose} className="flex-1 h-12 rounded-2xl border border-line font-semibold text-ink-soft">
          {t('common.cancel')}
        </button>
        <button onClick={applyCustom} className="flex-1 h-12 rounded-2xl bg-accent text-accent-ink font-bold">
          {t('pp.applyRange')}
        </button>
      </div>
    </Modal>
  )
}
