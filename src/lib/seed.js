// Výchozí (demo) data. Generují se relativně k dnešnímu datu,
// aby aplikace hned po prvním spuštění ukazovala smysluplné grafy
// i "plánované" (budoucí) položky v aktuálním měsíci.
import { DEFAULT_CATEGORIES } from './categories.js'
import { toISO } from './format.js'

const BUDGETS = [
  { id: 'b-osobni', name: 'Osobní', type: 'personal' },
  { id: 'b-rodinny', name: 'Rodinný', type: 'family' },
  { id: 'b-firemni', name: 'Firemní', type: 'business' },
]

const TAGS = [
  { id: 't-jidlo', name: 'Jídlo' },
  { id: 't-doprava', name: 'Doprava' },
  { id: 't-bydleni', name: 'Bydlení' },
  { id: 't-zabava', name: 'Zábava' },
]

function iso(year, month, day) {
  const last = new Date(year, month + 1, 0).getDate()
  return toISO(new Date(year, month, Math.min(day, last)))
}

function buildTransactions(today) {
  const y = today.getFullYear()
  const m = today.getMonth()
  const tx = []
  const bid = 'b-osobni'

  // ——— Opakované (měsíční) položky — definované jednou, rozbalí se přes měsíce ———
  const recurStart = iso(y, m - 6, 1) // pravidla platí posledního půl roku
  tx.push(
    {
      id: 'r-vyplata', budgetId: bid, type: 'income', name: 'Výplata',
      amount: 32500, currency: 'CZK', categoryId: 'plat', tagIds: [], note: '',
      date: iso(y, m - 6, 10),
      recurrence: { freq: 'monthly', startDate: iso(y, m - 6, 10), endDate: null },
    },
    {
      id: 'r-najem', budgetId: bid, type: 'expense', name: 'Nájem',
      amount: 12000, currency: 'CZK', categoryId: 'najem', tagIds: ['t-bydleni'], note: '',
      date: iso(y, m - 6, 5),
      recurrence: { freq: 'monthly', startDate: iso(y, m - 6, 5), endDate: null },
    },
    {
      id: 'r-elektrina', budgetId: bid, type: 'expense', name: 'Elektřina',
      amount: 2800, currency: 'CZK', categoryId: 'elektrina', tagIds: ['t-bydleni'], note: '',
      date: iso(y, m - 6, 24),
      recurrence: { freq: 'monthly', startDate: iso(y, m - 6, 24), endDate: null },
    },
    {
      id: 'r-pojisteni', budgetId: bid, type: 'expense', name: 'Pojištění',
      amount: 3500, currency: 'CZK', categoryId: 'finance', tagIds: [], note: '',
      date: iso(y, m - 6, 26),
      recurrence: { freq: 'monthly', startDate: iso(y, m - 6, 26), endDate: null },
    },
    {
      id: 'r-internet', budgetId: bid, type: 'expense', name: 'Internet',
      amount: 699, currency: 'CZK', categoryId: 'sluzby', tagIds: [], note: '',
      date: iso(y, m - 6, 28),
      recurrence: { freq: 'monthly', startDate: iso(y, m - 6, 28), endDate: null },
    },
  )

  // ——— Jednorázové položky pro posledních 6 měsíců (kvůli grafům) ———
  for (let k = 5; k >= 0; k--) {
    const yy = new Date(y, m - k, 1).getFullYear()
    const mm = new Date(y, m - k, 1).getMonth()
    const v = 5 - k // 0..5, drobná variace mezi měsíci

    tx.push({
      id: `o-potraviny-${k}`, budgetId: bid, type: 'expense', name: 'Nákup potravin',
      amount: 1100 + v * 120, currency: 'CZK', categoryId: 'potraviny', tagIds: ['t-jidlo'],
      note: '', date: iso(yy, mm, 11), recurrence: null,
    })
    tx.push({
      id: `o-potraviny2-${k}`, budgetId: bid, type: 'expense', name: 'Potraviny – Lidl',
      amount: 740 + v * 60, currency: 'CZK', categoryId: 'potraviny', tagIds: ['t-jidlo'],
      note: '', date: iso(yy, mm, 18), recurrence: null,
    })
    tx.push({
      id: `o-kavarna-${k}`, budgetId: bid, type: 'expense', name: 'Kavárna',
      amount: 150 + v * 10, currency: 'CZK', categoryId: 'kavarna', tagIds: ['t-jidlo'],
      note: '', date: iso(yy, mm, 8), recurrence: null,
    })
    tx.push({
      id: `o-netflix-${k}`, budgetId: bid, type: 'expense', name: 'Netflix',
      amount: 299, currency: 'CZK', categoryId: 'streamovani', tagIds: ['t-zabava'],
      note: '', date: iso(yy, mm, 9), recurrence: null,
    })
    tx.push({
      id: `o-uber-${k}`, budgetId: bid, type: 'expense', name: 'Uber',
      amount: 240 + v * 30, currency: 'CZK', categoryId: 'taxi', tagIds: ['t-doprava'],
      note: '', date: iso(yy, mm, 7), recurrence: null,
    })
    // Freelance příjem každý druhý měsíc
    if (k % 2 === 0) {
      tx.push({
        id: `o-freelance-${k}`, budgetId: bid, type: 'income', name: 'Freelance projekt',
        amount: 7500 + v * 250, currency: 'CZK', categoryId: 'freelance', tagIds: [],
        note: 'Webový projekt', date: iso(yy, mm, 5), recurrence: null,
      })
    }
  }

  return tx
}

export function buildSeed(today = new Date()) {
  return {
    version: 1,
    budgets: BUDGETS,
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    tags: TAGS,
    transactions: buildTransactions(today),
    settings: {
      activeBudgetId: 'b-osobni',
      profile: { name: 'Jan Novák', email: 'jan.novak@email.cz' },
      language: 'cs',
    },
  }
}
