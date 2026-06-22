// Výchozí strom kategorií podle designu (obrazovka Kategorie).
// kind: 'expense' | 'income'  — určuje, kde se kategorie nabízí.
// icon: klíč do mapy ikon (viz components/CategoryIcon.jsx)
// color: barva ikony/odznaku (hex)

export const DEFAULT_CATEGORIES = [
  // ——— Výdajové ———
  { id: 'bydleni', name: 'Bydlení', parentId: null, kind: 'expense', icon: 'home', color: '#F97316' },
  { id: 'najem', name: 'Nájem', parentId: 'bydleni', kind: 'expense', icon: 'receipt', color: '#F97316' },
  { id: 'hypoteka', name: 'Hypotéka', parentId: 'bydleni', kind: 'expense', icon: 'landmark', color: '#F97316' },
  { id: 'energie', name: 'Energie', parentId: 'bydleni', kind: 'expense', icon: 'zap', color: '#22C55E' },
  { id: 'elektrina', name: 'Elektřina', parentId: 'energie', kind: 'expense', icon: 'zap', color: '#22C55E' },
  { id: 'plyn', name: 'Plyn', parentId: 'energie', kind: 'expense', icon: 'flame', color: '#22C55E' },
  { id: 'voda', name: 'Voda', parentId: 'energie', kind: 'expense', icon: 'droplet', color: '#22C55E' },
  { id: 'pojisteni', name: 'Pojištění', parentId: 'bydleni', kind: 'expense', icon: 'shield', color: '#F97316' },

  { id: 'strava', name: 'Strava', parentId: null, kind: 'expense', icon: 'utensils', color: '#3B82F6' },
  { id: 'potraviny', name: 'Potraviny', parentId: 'strava', kind: 'expense', icon: 'shopping-cart', color: '#3B82F6' },
  { id: 'restaurace', name: 'Restaurace', parentId: 'strava', kind: 'expense', icon: 'utensils', color: '#3B82F6' },
  { id: 'kavarna', name: 'Kavárna', parentId: 'strava', kind: 'expense', icon: 'coffee', color: '#3B82F6' },

  { id: 'doprava', name: 'Doprava', parentId: null, kind: 'expense', icon: 'car', color: '#8B5CF6' },
  { id: 'mhd', name: 'MHD', parentId: 'doprava', kind: 'expense', icon: 'bus', color: '#8B5CF6' },
  { id: 'taxi', name: 'Taxi', parentId: 'doprava', kind: 'expense', icon: 'car', color: '#8B5CF6' },

  { id: 'zabava', name: 'Zábava', parentId: null, kind: 'expense', icon: 'gamepad-2', color: '#F59E0B' },
  { id: 'streamovani', name: 'Streamovací služby', parentId: 'zabava', kind: 'expense', icon: 'tv', color: '#F59E0B' },
  { id: 'kultura', name: 'Kultura', parentId: 'zabava', kind: 'expense', icon: 'ticket', color: '#F59E0B' },

  { id: 'zdravi', name: 'Zdraví', parentId: null, kind: 'expense', icon: 'heart-pulse', color: '#EC4899' },
  { id: 'obleceni', name: 'Oblečení', parentId: null, kind: 'expense', icon: 'shirt', color: '#14B8A6' },
  { id: 'vzdelavani', name: 'Vzdělávání', parentId: null, kind: 'expense', icon: 'graduation-cap', color: '#6366F1' },
  { id: 'sluzby', name: 'Služby', parentId: null, kind: 'expense', icon: 'wifi', color: '#0EA5E9' },
  { id: 'finance', name: 'Finance', parentId: null, kind: 'expense', icon: 'shield', color: '#64748B' },
  { id: 'uspory', name: 'Úspory', parentId: null, kind: 'expense', icon: 'piggy-bank', color: '#10B981' },

  // ——— Příjmové ———
  { id: 'plat', name: 'Plat', parentId: null, kind: 'income', icon: 'wallet', color: '#16A34A' },
  { id: 'brigada', name: 'Brigáda', parentId: null, kind: 'income', icon: 'briefcase', color: '#16A34A' },
  { id: 'freelance', name: 'Freelance', parentId: null, kind: 'income', icon: 'laptop', color: '#16A34A' },
  { id: 'prijem-ostatni', name: 'Ostatní', parentId: null, kind: 'income', icon: 'coins', color: '#16A34A' },
]

// Vrátí mapu id -> kategorie
export function indexCategories(list) {
  const map = {}
  for (const c of list) map[c.id] = c
  return map
}

// Najde kořenovou kategorii (pro seskupení v grafech a štítku v seznamu)
export function rootCategory(map, id) {
  let c = map[id]
  if (!c) return null
  while (c.parentId && map[c.parentId]) c = map[c.parentId]
  return c
}

// Zobrazovaná kategorie transakce (přímo přiřazená kategorie)
export function categoryById(map, id) {
  return map[id] || null
}

// Množina id dané kategorie a všech jejích podkategorií (pro filtrování).
export function categoryWithDescendants(list, id) {
  const set = new Set([id])
  let grew = true
  while (grew) {
    grew = false
    for (const c of list) {
      if (c.parentId && set.has(c.parentId) && !set.has(c.id)) {
        set.add(c.id)
        grew = true
      }
    }
  }
  return set
}

// Ploché možnosti všech kategorií (oba druhy) s odsazením – pro select ve filtrech.
export function flatCategoryOptions(list) {
  const byParent = {}
  for (const c of list) (byParent[c.parentId || 'root'] ||= []).push(c)
  const out = []
  const walk = (parent, depth) => {
    for (const c of byParent[parent] || []) {
      out.push({ value: c.id, label: `${'  '.repeat(depth)}${c.name}` })
      walk(c.id, depth + 1)
    }
  }
  walk('root', 0)
  return out
}
