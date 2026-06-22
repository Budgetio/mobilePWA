// Mobilní "rám". Na širší obrazovce vypadá jako telefon, na mobilu vyplní celou plochu.
// Respektuje bezpečné zóny (notch nahoře, home indikátor dole) v režimu PWA.
export default function AppShell({ children, bottomNav, overlay }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-stretch sm:items-center justify-center sm:py-6">
      <div className="relative w-full sm:max-w-[412px] sm:rounded-[2.5rem] sm:shadow-2xl sm:border-[10px] sm:border-black bg-bg overflow-hidden flex flex-col h-[100dvh] sm:h-[860px]">
        <div className="flex-1 overflow-y-auto no-scrollbar pt-[env(safe-area-inset-top)] pb-[calc(7rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        {bottomNav}
        {overlay}
      </div>
    </div>
  )
}
