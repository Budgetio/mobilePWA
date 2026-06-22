import { useState } from 'react'
import AppShell from './components/AppShell.jsx'
import BottomNav from './components/BottomNav.jsx'
import Transactions from './screens/Transactions.jsx'
import Overview from './screens/Overview.jsx'
import Statistics from './screens/Statistics.jsx'
import Categories from './screens/Categories.jsx'
import Profile from './screens/Profile.jsx'
import AddTransaction from './screens/AddTransaction.jsx'
import { useStore } from './store/StoreProvider.jsx'
import { monthPeriod } from './lib/period.js'

export default function App() {
  const { activeBudget, state } = useStore()
  const now = new Date()
  const [tab, setTab] = useState('overview')
  const [period, setPeriod] = useState(() => monthPeriod(now.getFullYear(), now.getMonth()))
  const [add, setAdd] = useState(null) // null | { editing }
  const [catOpen, setCatOpen] = useState(false)

  // Při editaci instance dohledáme základní transakci (kvůli pravidlu opakování).
  const openEdit = (occ) => {
    const base = state.transactions.find((t) => t.id === occ.id) || occ
    setAdd({ editing: base })
  }
  const openAdd = () => setAdd({ editing: null })
  const closeAdd = () => setAdd(null)

  let screen
  if (tab === 'overview') screen = <Overview period={period} setPeriod={setPeriod} onEdit={openEdit} />
  else if (tab === 'transactions')
    screen = <Transactions period={period} setPeriod={setPeriod} onEdit={openEdit} />
  else if (tab === 'stats')
    screen = <Statistics period={period} setPeriod={setPeriod} onOpenCategories={() => setCatOpen(true)} />
  else screen = <Profile onOpenCategories={() => setCatOpen(true)} />

  return (
    <AppShell
      bottomNav={<BottomNav active={tab} onChange={setTab} onAdd={openAdd} />}
      overlay={
        <>
          {add && (
            <AddTransaction
              editing={add.editing}
              defaultBudgetId={activeBudget.id}
              onClose={closeAdd}
              onManageCategories={() => setCatOpen(true)}
            />
          )}
          {catOpen && <Categories onClose={() => setCatOpen(false)} />}
        </>
      }
    >
      {screen}
    </AppShell>
  )
}
