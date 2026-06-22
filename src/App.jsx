import { useState } from 'react'
import AppShell from './components/AppShell.jsx'
import BottomNav from './components/BottomNav.jsx'
import Transactions from './screens/Transactions.jsx'
import Overview from './screens/Overview.jsx'
import AddTransaction from './screens/AddTransaction.jsx'
import Placeholder from './screens/Placeholder.jsx'
import { useStore } from './store/StoreProvider.jsx'

export default function App() {
  const { activeBudget, state } = useStore()
  const now = new Date()
  const [tab, setTab] = useState('overview')
  const [ym, setYm] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [add, setAdd] = useState(null) // null | { editing }

  const setMonth = (year, month) => setYm({ year, month })

  // Při editaci instance dohledáme základní transakci (kvůli pravidlu opakování).
  const openEdit = (occ) => {
    const base = state.transactions.find((t) => t.id === occ.id) || occ
    setAdd({ editing: base })
  }
  const openAdd = () => setAdd({ editing: null })
  const closeAdd = () => setAdd(null)

  let screen
  if (tab === 'overview') screen = <Overview {...ym} setMonth={setMonth} onEdit={openEdit} />
  else if (tab === 'transactions') screen = <Transactions {...ym} setMonth={setMonth} onEdit={openEdit} />
  else if (tab === 'stats')
    screen = <Placeholder title="Statistiky" note="Statistiky a kategorie přijdou ve fázi 2." />
  else screen = <Placeholder title="Profil" note="Profil a štítky přijdou ve fázi 3." />

  return (
    <AppShell
      bottomNav={<BottomNav active={tab} onChange={setTab} onAdd={openAdd} />}
      overlay={
        add && (
          <AddTransaction
            editing={add.editing}
            defaultBudgetId={activeBudget.id}
            onClose={closeAdd}
          />
        )
      }
    >
      {screen}
    </AppShell>
  )
}
