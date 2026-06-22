# BUDGETO

Mobilní PWA pro sledování rozpočtu. Veškerá data se ukládají lokálně v prohlížeči (localStorage) — **žádný backend**.

Postaveno na React + Vite + Tailwind, grafy přes Recharts.

## Rychlý náhled (bez instalace)

Otevři soubor **`BUDGETO-nahled.html`** dvojklikem v prohlížeči. Je to kompletní aplikace v jednom souboru — funguje offline a hned ukazuje demo data.

## Vývoj

```bash
npm install
npm run dev          # vývojový server (http://localhost:5173)
npm run build        # produkční build do dist/
npm run build:standalone  # jednosouborový build do dist-standalone/
npm run preview      # náhled produkčního buildu
```

> Produkční `dist/` se musí servírovat přes HTTP (ne otevírat přes `file://`).
> Pro rychlé otevření bez serveru použij `BUDGETO-nahled.html`.

## Co je hotové (Fáze 1 + 2)

- **Datová vrstva + localStorage** — rozpočty, hierarchické kategorie, štítky, transakce; data přežijí zavření appky.
- **Více rozpočtů** — Osobní / Rodinný / Firemní, přepínání v hlavičce.
- **Výběr období** — kliknutím na název období (v Přehledu, Transakcích i Statistikách) lze zvolit rychlou předvolbu (tento/minulý měsíc, tento/minulý rok, posledních 30/90 dní) nebo **vlastní rozsah od–do** (např. celý loňský rok nebo od 15. do 15.). Šipky listují po měsících, u vlastního rozsahu o jeho délku. Grafy se přizpůsobí délce období (dny/týdny/měsíce).
- **Transakce** — souhrnné karty (příjmy/výdaje), vyhledávání, výběr období, seznam s ikonami; plánované (budoucí) položky zešednou.
- **Přidat / upravit transakci** — Výdaj/Příjem, částka, datum, kategorie, štítky, poznámka a **opakování** (měsíčně se začátkem/koncem). Mazání transakcí.
- **Přehled** — zůstatek/příjmy/výdaje, graf peněžního toku, plánované výdaje, týdenní změny a dva koláčové grafy (výdaje/příjmy dle kategorie).
- **Statistiky** — výdaje dle kategorie (proužky), Příjmy vs Výdaje za 6 měsíců, měsíční přehled s úsporami a mírou úspor.
- **Kategorie** — správa stromu: rozbalování, vyhledávání, přidání kategorie i **podkategorie** (dialog), přejmenování a mazání (včetně podstromu). Dostupné přes ozubené kolo ve Statistikách nebo „Spravovat" u kategorie v Přidat transakci.
- Demo data se generují relativně k dnešnímu dni, aby grafy i plánované položky dávaly smysl.

## Co přijde dál

- **Fáze 3** — pokročilé Filtry, Profil (štítky, reset dat), doladění PWA (offline, instalace na plochu, ikony) a doporučený JSON export/import zálohy.

## Struktura

```
src/
  lib/        datový model, localStorage, formátování (cs-CZ), opakování, seed
  store/      React context + akce (perzistence)
  components/ sdílené UI (rám, navigace, řádek transakce, grafy…)
  screens/    Transakce, Přidat transakci, Přehled, zástupné taby
```

## Záloha dat

Data žijí jen v prohlížeči. Export/import zálohy (JSON) zatím není ve verzi 1 — doporučeno doplnit ve fázi 3.
