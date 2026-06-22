import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadState, saveState, resetState } from '../lib/storage.js'
import { indexCategories } from '../lib/categories.js'
import { uid } from '../lib/id.js'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => loadState())

  // Každá změna stavu se ukládá do localStorage.
  useEffect(() => {
    saveState(state)
  }, [state])

  const actions = useMemo(() => {
    const update = (fn) => setState((s) => ({ ...s, ...fn(s) }))

    return {
      setActiveBudget(budgetId) {
        update((s) => ({ settings: { ...s.settings, activeBudgetId: budgetId } }))
      },

      addTransaction(data) {
        const tx = {
          id: uid('tx'),
          currency: 'CZK',
          tagIds: [],
          note: '',
          recurrence: null,
          ...data,
        }
        update((s) => ({ transactions: [...s.transactions, tx] }))
        return tx
      },

      updateTransaction(id, patch) {
        update((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        }))
      },

      deleteTransaction(id) {
        update((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
      },

      addTag(name) {
        const tag = { id: uid('tag'), name }
        update((s) => ({ tags: [...s.tags, tag] }))
        return tag
      },

      updateProfile(patch) {
        update((s) => ({ settings: { ...s.settings, profile: { ...s.settings.profile, ...patch } } }))
      },

      resetAll() {
        setState(resetState())
      },
    }
  }, [])

  const value = useMemo(() => {
    const categoryMap = indexCategories(state.categories)
    const tagMap = Object.fromEntries(state.tags.map((t) => [t.id, t]))
    const activeBudget =
      state.budgets.find((b) => b.id === state.settings.activeBudgetId) || state.budgets[0]
    return { state, ...actions, categoryMap, tagMap, activeBudget }
  }, [state, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore musí být uvnitř <StoreProvider>')
  return ctx
}
