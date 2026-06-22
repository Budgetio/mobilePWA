// Registrace service workeru a řízení aktualizací (bez závislosti na PWA pluginu,
// aby se stejný zdroj přeložil i pro samostatný náhled bez SW).

let registration = null
let updateAvailable = false
const listeners = new Set()

function emit() {
  for (const cb of listeners) cb(updateAvailable)
}

function markAvailable() {
  updateAvailable = true
  emit()
}

// Komponenty se přihlásí k odběru stavu „je k dispozici nová verze".
export function subscribeUpdate(cb) {
  listeners.add(cb)
  cb(updateAvailable)
  return () => listeners.delete(cb)
}

export function isUpdateAvailable() {
  return updateAvailable
}

export function initPwa() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  // Po převzetí nové SW (po kliknutí na Aktualizovat) stránku načteme znovu.
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', async () => {
    try {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`
      registration = await navigator.serviceWorker.register(swUrl)

      // Už čeká nová verze?
      if (registration.waiting && navigator.serviceWorker.controller) markAvailable()

      // Detekce nově nalezené verze.
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing
        if (!installing) return
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            markAvailable()
          }
        })
      })

      // Občasná kontrola aktualizací (jednou za hodinu).
      setInterval(() => registration && registration.update().catch(() => {}), 60 * 60 * 1000)
    } catch {
      // file:// nebo prostředí bez SW – aktualizace nejsou dostupné.
    }
  })
}

// Ruční kontrola aktualizací (tlačítko v Profilu).
// Vrací: 'available' | 'uptodate' | 'unsupported'
export async function checkForUpdate() {
  if (!registration) return 'unsupported'
  try {
    await registration.update()
  } catch {
    return 'unsupported'
  }
  if (registration.waiting || updateAvailable) {
    markAvailable()
    return 'available'
  }
  return 'uptodate'
}

// Aplikuje čekající verzi: řekne SW, ať přeskočí čekání → controllerchange → reload.
export function applyUpdate() {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  } else {
    window.location.reload()
  }
}
