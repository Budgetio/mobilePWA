import StatusBar from './StatusBar.jsx'

// Mobilní "rám". Na širší obrazovce vypadá jako telefon, na mobilu vyplní celou plochu.
export default function AppShell({ children, bottomNav, overlay }) {
  return (
    <div className="min-h-screen w-full flex items-stretch sm:items-center justify-center sm:py-6">
      <div className="relative w-full sm:max-w-[412px] sm:rounded-[2.5rem] sm:shadow-2xl sm:border-[10px] sm:border-black bg-bg overflow-hidden flex flex-col h-screen sm:h-[860px]">
        <StatusBar />
        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">{children}</div>
        {bottomNav}
        {overlay}
      </div>
    </div>
  )
}
