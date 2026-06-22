// Čisté pomocné funkce pro filtrování transakcí (bez UI).

export function defaultFilters(budgets) {
  return {
    categoryId: 'all',
    budgetIds: budgets.map((b) => b.id),
    type: 'all',
    recurrence: 'all',
    min: '',
    max: '',
  }
}

// Počet aktivních (nevýchozích) filtrů – pro odznak na tlačítku Filtry.
export function activeFilterCount(f, budgets) {
  let n = 0
  if (f.categoryId && f.categoryId !== 'all') n++
  if (f.budgetIds.length !== budgets.length) n++
  if (f.type !== 'all') n++
  if (f.recurrence !== 'all') n++
  if (f.min) n++
  if (f.max) n++
  return n
}
