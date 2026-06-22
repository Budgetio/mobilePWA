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

## Instalace na telefon / plochu (PWA)

Produkční build (`dist/`) je plnohodnotná PWA – funguje offline a jde nainstalovat:

1. `npm run build` a obsah `dist/` nahraj na libovolný statický hosting (přes **HTTPS**), nebo lokálně spusť `npm run preview`.
2. V prohlížeči otevři adresu → v menu zvol „Instalovat aplikaci" / na iOSu Safari → Sdílet → „Přidat na plochu". (Tlačítko „Instalovat aplikaci" je i v Profilu, když je dostupné.)

> Service worker a instalace fungují jen přes http(s), ne přes `file://`. Pro rychlý náhled bez serveru slouží `BUDGETO-nahled.html`.

## Co je hotové (Fáze 1–3)

- **Datová vrstva + localStorage** — rozpočty, hierarchické kategorie, štítky, transakce; data přežijí zavření appky.
- **Více rozpočtů** — Osobní / Rodinný / Firemní, přepínání v hlavičce.
- **Výběr období** — kliknutím na název období (v Přehledu, Transakcích i Statistikách) lze zvolit rychlou předvolbu (tento/minulý měsíc, tento/minulý rok, posledních 30/90 dní) nebo **vlastní rozsah od–do** (např. celý loňský rok nebo od 15. do 15.). Šipky listují po měsících, u vlastního rozsahu o jeho délku. Grafy se přizpůsobí délce období (dny/týdny/měsíce).
- **Transakce** — souhrnné karty (příjmy/výdaje), vyhledávání, výběr období, seznam s ikonami; plánované (budoucí) položky zešednou.
- **Přidat / upravit transakci** — Výdaj/Příjem, částka, datum, kategorie, štítky, poznámka a **opakování** (měsíčně se začátkem/koncem). Mazání transakcí.
- **Přehled** — zůstatek/příjmy/výdaje, graf peněžního toku, plánované výdaje, týdenní změny a dva koláčové grafy (výdaje/příjmy dle kategorie).
- **Statistiky** — výdaje dle kategorie (proužky), Příjmy vs Výdaje za 6 měsíců, měsíční přehled s úsporami a mírou úspor.
- **Kategorie** — správa stromu: rozbalování, vyhledávání, přidání kategorie i **podkategorie** (dialog), přejmenování a mazání (včetně podstromu). Dostupné přes ozubené kolo ve Statistikách/Profilu nebo „Spravovat" u kategorie v Přidat transakci.
- **Filtry** — kategorie (vč. podkategorií), výběr rozpočtů (Vybrat vše), typ, opakování, rozsah částky; počet aktivních filtrů se ukazuje na tlačítku.
- **Profil** — úprava jména/e-mailu, **přepínání jazyka (čeština / angličtina)**, **záloha dat (export/import JSON)**, správa štítků (přidat/přejmenovat/smazat), reset dat na výchozí, instalace aplikace.
- **Jazyky** — celé rozhraní v češtině i angličtině; přepíná se v Profilu. Mění se i formát čísel, dat a názvy měsíců. (Názvy vlastních kategorií a štítků zůstávají tak, jak je zadáte.)
- **PWA** — offline provoz (service worker), instalace na plochu, ikony a manifest.
- Demo data se generují relativně k dnešnímu dni, aby grafy i plánované položky dávaly smysl.

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
