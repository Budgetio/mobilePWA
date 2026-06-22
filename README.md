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

## Co je hotové (Fáze 1)

- **Datová vrstva + localStorage** — rozpočty, hierarchické kategorie, štítky, transakce; data přežijí zavření appky.
- **Více rozpočtů** — Osobní / Rodinný / Firemní, přepínání v hlavičce.
- **Transakce** — souhrnné karty (příjmy/výdaje), vyhledávání, přepínač měsíce, seznam s ikonami; plánované (budoucí) položky zešednou.
- **Přidat / upravit transakci** — Výdaj/Příjem, částka, datum, kategorie, štítky, poznámka a **opakování** (měsíčně se začátkem/koncem). Mazání transakcí.
- **Přehled** — zůstatek/příjmy/výdaje, graf peněžního toku, plánované výdaje, týdenní změny a dva koláčové grafy (výdaje/příjmy dle kategorie).
- Demo data se generují relativně k dnešnímu dni, aby grafy i plánované položky dávaly smysl.

## Co přijde dál

- **Fáze 2** — obrazovka Statistiky a správa stromu Kategorií.
- **Fáze 3** — pokročilé Filtry, Profil (štítky), doladění PWA (offline, instalace na plochu, ikony).

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
