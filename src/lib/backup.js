// Export / import dat (JSON záloha). Data jinak žijí jen v prohlížeči.

export function downloadJSON(state) {
  const stamp = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `budgeto-zaloha-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Načte a ověří soubor zálohy. Vrací Promise<state>.
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Soubor se nepodařilo přečíst.'))
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.categories) || !Array.isArray(data.budgets)) {
          throw new Error('Neplatná záloha (chybí očekávaná data).')
        }
        // doplníme chybějící části kvůli starším zálohám
        data.tags = Array.isArray(data.tags) ? data.tags : []
        data.settings = data.settings || { activeBudgetId: data.budgets[0]?.id, profile: {}, language: 'cs' }
        data.version = data.version || 1
        resolve(data)
      } catch (e) {
        reject(e instanceof Error ? e : new Error('Neplatný soubor.'))
      }
    }
    reader.readAsText(file)
  })
}
