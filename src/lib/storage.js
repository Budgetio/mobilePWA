// Trvalé úložiště v prohlížeči (localStorage) — žádný backend.
import { buildSeed } from './seed.js'

const KEY = 'budgeto.state.v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const seeded = buildSeed()
      saveState(seeded)
      return seeded
    }
    const parsed = JSON.parse(raw)
    return migrate(parsed)
  } catch (e) {
    console.error('Načtení stavu selhalo, používám výchozí data.', e)
    return buildSeed()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Uložení stavu selhalo.', e)
  }
}

export function resetState() {
  const seeded = buildSeed()
  saveState(seeded)
  return seeded
}

// Místo pro budoucí migrace schématu.
function migrate(state) {
  if (!state.version) state.version = 1
  return state
}
