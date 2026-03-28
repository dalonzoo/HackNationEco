# EcoSignal Enterprise — Homepage Redesign Brief
> Per: agente implementatore (Cursor / v0 / Bolt / Claude Code)
> Stack: Next.js 14 + Tailwind CSS + Framer Motion
> Obiettivo: homepage B2B che converte, non informa

---

## 1. Concept direttore — "Mission Control"

L'homepage non è una landing page. È una **sala operativa**.
Il visitatore entra e sente subito di avere potere sui dati, non di leggere uno slideshow.

**Metafora visiva**: centro di controllo spaziale + terminale Bloomberg + cockpit aereo.
**Non è**: SaaS con hero + features + pricing + CTA.
**È**: un'interfaccia viva che dimostra il prodotto mentre lo vende.

**La regola d'oro**: ogni sezione deve sembrare che stia già lavorando per l'utente.

---

## 2. Estetica & Design System

### Palette — Dark industrial con verde segnale
```
bg-void:     #050807   (sfondo principale — quasi nero con sottotono verde)
bg-surface:  #0d1510   (superfici carte)
bg-elevated: #131f18   (hover states, elementi rialzati)
accent:      #00ff88   (verde segnale — accento primario, usato con parsimonia)
accent-dim:  #00c866   (verde meno saturo per elementi secondari)
text-primary:#e8f2eb   (testo principale)
text-muted:  #6b8a74   (testo secondario)
text-ghost:  #2d4a37   (placeholder, elementi dormienti)
amber:       #f0a030   (warning, CSRD alerts)
blue-data:   #4a9eff   (dati, grafici secondari)
red-alert:   #ff4a4a   (anomalie, emissioni critiche)
```

### Tipografia
```
Display:  "Bebas Neue" — titoli hero, numeri grandi, impatto massimo
          (maiuscolo nativo, tracking generoso, peso visivo brutale)
UI:       "JetBrains Mono" — label, dati, coordinate, numeri
          (monospace dà senso di precisione tecnica e autenticità)
Body:     "DM Sans" — descrizioni, copy, CTA
          (leggibile, umano, contrasta con il mono)
```

### Atmosfera
- Sfondo: campo di particelle/noise animato SVG — denso al centro, si dissolve ai bordi
- Scanlines sottilissime (opacity 2%) su tutto il viewport — effetto monitor vintage
- Cursore custom: crosshair verde `+` che traccia posizione su tutto il sito
- Border radius: 0 su tutto. Angoli vivi. Nessun arrotondamento.
- Bordi: `1px solid rgba(0,255,136,0.08)` — quasi invisibili, ma ci sono

---

## 3. Struttura — Viewport unico con pannelli laterali

**Niente scroll lineare classico.**
La homepage è un **unico viewport** (100vh, no overflow) con:
- Un pannello centrale dominante che cambia contenuto (navigato con tasti/click)
- Colonna sinistra fissa: coordinate azienda + nav verticale
- Colonna destra fissa: feed live dati ambientali open (aria, temperatura, CO₂ italia)
- Footer strip inferiore: indicatori di stato sistema

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR — logo · company · status indicators · CTA               │  ~48px
├──────────┬──────────────────────────────────────┬───────────────┤
│          │                                      │               │
│  NAV     │        PANNELLO CENTRALE             │  LIVE FEED    │
│  VERT.   │        (switchabile, animato)        │  DATI ENV.    │
│          │                                      │               │
│  ~140px  │         ~60% viewport width          │   ~220px      │
│          │                                      │               │
├──────────┴──────────────────────────────────────┴───────────────┤
│ STATUS BAR — sistema attivo · ultimo aggiornamento · versione   │  ~32px
└─────────────────────────────────────────────────────────────────┘
```

**Il pannello centrale ha 4 stati** (navigati con frecce laterali, keyboard arrows, o click sui nav items):

| # | Nome interno | Cosa mostra | Mood |
|---|---|---|---|
| 0 | `TERRA` | Hero — claim + animazione CO₂ counter | Impatto |
| 1 | `SCANNER` | Demo live carbon footprint (input → output istantaneo) | Interattivo |
| 2 | `ORBITA` | Mappa azioni AI come pianeti (già vista, ridimensionata) | Spaziale |
| 3 | `COMPLIANCE` | CSRD countdown timer + progress | Urgenza |

---

## 4. Pannello 0 — TERRA (Hero)

**Layout**: asimmetrico. Testo a sinistra (40%), visualizzazione a destra (60%).

**Testo**:
```
[label monospace piccolo]  ECOSIGNAL · ENTERPRISE · v2.5

[display Bebas Neue, 80px+]
I TUOI DATI
AMBIENTALI.
FINALMENTE
AZIONABILI.

[body DM Sans, 16px]
La piattaforma AI che trasforma le emissioni aziendali
in decisioni, report CSRD e risparmio reale.
Setup in 10 minuti. Compliance in 30 giorni.

[CTA — no bottone standard]
→ INIZIA L'ANALISI GRATUITA
   [underline animata che cresce da sinistra]
```

**Visualizzazione destra**: grande contatore animato della CO₂ italiana in tempo reale (dato simulato ma credibile). Cifre che scorrono in stile Bloomberg ticker. Sotto: "tCO₂eq emesse in Italia — oggi".

**Dettaglio tecnico CTA**: non è un `<button>`. È una riga di testo con un arrow `→` che si sposta di 8px a destra su hover, e una linea verde che cresce sotto da 0 a 100% in 300ms.

---

## 5. Pannello 1 — SCANNER (Demo interattiva)

**Concept**: l'utente inserisce 3 dati della sua azienda e vede il carbon footprint calcolarsi in real-time. È una demo del prodotto, non una form di contatto.

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ [ INPUT AREA ]          [ OUTPUT — live ]           │
│                                                     │
│  Settore: [dropdown]    ████████░░░░  68 tCO₂/anno  │
│  Dipendenti: [slider]                               │
│  Elettricità: [input]   Scope 1:  12t  ████░░       │
│                         Scope 2:  38t  ████████░    │
│                         Scope 3:  18t  ████░░░      │
│                                                     │
│ "Sei nel 34% più inquinante del tuo settore"        │
│  → Scopri le 5 azioni che ti portano nel top 20%    │
└─────────────────────────────────────────────────────┘
```

**Regole UX**:
- I valori output cambiano mentre l'utente muove lo slider (no submit button)
- Le barre si animano con `transition: width 0.4s ease`
- Il messaggio finale ("sei nel 34%...") cambia in base ai valori
- Font monospace per tutti i numeri output

---

## 6. Pannello 2 — ORBITA (Azioni AI)

Il sistema planetario già sviluppato in precedenza, adattato al viewport homepage.

**Modifiche rispetto alla versione dashboard**:
- Centro dell'orbita: NON è il sole, è un esagono con "ESG 72" — il tuo score
- Le orbite non sono cerchi ma ellissi leggere (più dinamiche)
- Label dei pianeti: solo l'icona della categoria (⚡ energia, 🚗 flotta, 🌿 supply)
- Hover su pianeta: mostra impact score in sovrimpressione senza pannello laterale
- Sfondo: campo stellare più denso che nella dashboard

---

## 7. Pannello 3 — COMPLIANCE (Urgenza CSRD)

**Concept**: trasformare la scadenza normativa in un orologio che batte.

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   CSRD · OBBLIGATORIA PER LA TUA AZIENDA           │
│                                                     │
│   [COUNTDOWN CLOCK — stile terminale]               │
│   487 GIORNI · 14 ORE · 32 MIN · 18 SEC            │
│   cifre che cambiano, monospace, verde accento      │
│                                                     │
│   ████████████████░░░░░░  73% completato            │
│   Mancano: ESRS E1 · ESRS E2 · GRI 305             │
│                                                     │
│   Aziende nella tua situazione: 127.000             │
│   Che hanno già iniziato con EcoSignal: 3.400       │
│                                                     │
│   → COMPLETA IL TUO REPORT IN 30 GIORNI            │
└─────────────────────────────────────────────────────┘
```

**Dettaglio visivo**: il countdown ha un bordo che lampeggia lentissimamente (2s cycle, opacity 0.4→1). Sensazione di sistema attivo, non di alert fastidioso.

---

## 8. Colonna sinistra — Nav verticale

```
· TERRA       [punto verde — stato attivo]
  SCANNER
  ORBITA
  COMPLIANCE

———

SYS STATUS
● ONLINE
v2.5.1
```

I nav items sono etichette monospace. Quello attivo ha il punto verde animato (`·`) e una linea verticale verde a sinistra (`border-left: 2px solid accent`). Click → transizione pannello centrale con slide + fade.

**Aggiunta**: sotto i nav items, piccolo "coordinate" che cambiano in base al pannello:
```
43.77°N  11.25°E
FIRENZE · IT
```
(coordinate simulate ma coerenti con la città dell'utente)

---

## 9. Colonna destra — Live data feed

Feed verticale di 5-6 indicatori ambientali open-source, aggiornati ogni 30s (simulati in demo):

```
FEED AMBIENTALE · IT

PM2.5 MILANO
42 μg/m³  ↑ +8%
▓▓▓▓▓▓▓░░░

TEMP MEDIA IT
+1.4°C anomalia
rispetto 1990-2020

CO₂ ATMOSF.
424.3 ppm
▓▓▓▓▓▓▓▓▓░

SICCITÀ NORD IT
ALLERTA ARANCIONE

ENERGIA RINNOVAB.
38% del mix oggi
```

Ogni voce: label monospace piccola + valore grande + microbar o indicatore. Si aggiornano con una transizione numerica (count-up breve).

**Importante**: questo feed non è decorativo. Dimostra che EcoSignal conosce i dati ambientali live — e li userà per le analisi.

---

## 10. Topbar

```
[● ECOSIGNAL]   [ENTERPRISE]   ··· ···         [ANALISI GRATUITA →]
```

- Logo: punto pulsante verde + "ECOSIGNAL" in Bebas Neue
- "ENTERPRISE" in monospace piccolo, come una badge
- Centro: 3-4 indicatori di sistema stile HUD: `SISTEMA ATTIVO · DATI AGG. 2MIN FA · 3.400 AZIENDE`
- CTA destra: non è un bottone. È testo con arrow, bordo 1px verde, padding minimo.

---

## 11. Status bar inferiore

Striscia di 32px in fondo al viewport (sempre visibile):

```
● ECOSIGNAL AI ONLINE   |   ULTIMO AGGIORNAMENTO: 14:32:07   |   DATI: ISPRA · GSE · OPENMETEO   |   GDPR COMPLIANT   |   © 2025
```

Tutto monospace, 10px, testo ghost. Scorre da destra a sinistra lentamente (marquee CSS, non JS). Dà la sensazione di un sistema sempre attivo.

---

## 12. Transizioni tra pannelli

**Non usare**: slide standard, fade semplice, nessuna animazione.

**Usare**:
1. Il pannello uscente si "pixelizza" (scale + blur filter in 200ms)
2. Breve flash verde (1px border full-viewport, opacity 1→0 in 100ms)
3. Il pannello entrante si "assembla" da 20 righe orizzontali che cadono in staggered (come un display a segmenti che si accende)

In Framer Motion:
```js
// Exit: pixelate out
exit: { filter: "blur(4px)", scale: 0.98, opacity: 0, transition: { duration: 0.2 } }

// Enter: assemble from strips
// Divide il pannello in 20 strip orizzontali con animation-delay incrementale
// Ogni strip: y: -10 → 0, opacity: 0 → 1, delay: i * 0.025s
```

---

## 13. Cursore custom

```css
* { cursor: none; }

.cursor {
  position: fixed;
  width: 20px; height: 20px;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}

/* Forma: crosshair — 4 segmenti che non si toccano al centro */
/* Gap centrale di 4px, segmenti di 6px, colore accent */
/* Su hover su elementi interattivi: cursor scala a 32px, colore pieno */
```

---

## 14. Animazione di caricamento (prima visita)

Durata: 1.8 secondi. Non skippabile (troppo breve per infastidire).

```
1. Schermo nero (0-200ms)
2. Appare il logo "ECOSIGNAL" lettera per lettera, Bebas Neue, verde (200-600ms)
3. Sotto: "INIZIALIZZAZIONE SISTEMA..." con cursore lampeggiante (600-1000ms)
4. Barra di progresso green che riempie (1000-1600ms)
5. Split: lo schermo si divide in due metà che scivolano fuori dai lati (1600-1800ms)
6. Homepage appare da sotto (fade in, 1800ms+)
```

---

## 15. Micro-interazioni obbligatorie

| Elemento | Interazione |
|---|---|
| Nav items | Punto `·` si anima, linea verde cresce da 0 a 100% altezza |
| CTA principale | Arrow si sposta +8px destra, underline cresce sinistra→destra |
| Numeri nel feed | Cambio valore: count-up in 400ms |
| Pannello SCANNER | Barre CO₂ si aggiornano in tempo reale mentre si interagisce |
| Hover su qualunque elemento interattivo | Cursore custom si ingrandisce |
| Transizione pannello | Strip-assemble (vedi §12) |

---

## 16. Accessibilità & Performance

- Tutte le animazioni: `prefers-reduced-motion` media query — se attivo, usa solo fade semplice
- Font: preload `Bebas Neue` e `JetBrains Mono` nel `<head>`
- Colori: contrasto minimo 4.5:1 su tutti i testi primari
- Keyboard nav: frecce ← → navigano i pannelli, Tab naviga elementi interattivi
- `aria-live="polite"` sul pannello centrale per screen reader
- Immagini: nessuna (tutto CSS/SVG/Canvas) → performance ottimale

---

## 17. Implementazione — Ordine di priorità

```
STEP 1 — Fondamenta (2h)
├── Layout shell: topbar + 3 colonne + status bar
├── CSS variables + font imports
├── Cursore custom
└── Campo particelle/scanlines sfondo

STEP 2 — Navigazione (1h)
├── Nav verticale con stato attivo
├── Sistema pannelli (array di componenti)
└── Transizione strip-assemble

STEP 3 — Pannello TERRA (1h)
├── Headline Bebas Neue + animazione entry
├── CO₂ counter animato (destra)
└── CTA con underline animata

STEP 4 — Pannello SCANNER (2h)
├── Input: dropdown settore + slider dipendenti + input kWh
├── Calcolo real-time carbon footprint
└── Barre output animate

STEP 5 — Pannello ORBITA (1h)
├── Adatta componente esistente al nuovo viewport
└── Rimuovi pannello dettaglio laterale, usa tooltip hover

STEP 6 — Pannello COMPLIANCE (1h)
├── Countdown clock live
├── Progress bar CSRD
└── Social proof counter

STEP 7 — Colonna destra feed (1h)
├── 6 indicatori ambientali simulati
└── Auto-refresh con count-up animation

STEP 8 — Polish (1h)
├── Loading screen
├── Tutte le micro-interazioni
└── prefers-reduced-motion
```

---

## 18. File da creare

```
app/
├── page.tsx                    — Shell + pannello switcher
├── components/
│   ├── TopBar.tsx
│   ├── NavVertical.tsx
│   ├── LiveFeed.tsx
│   ├── StatusBar.tsx
│   ├── Cursor.tsx
│   ├── LoadingScreen.tsx
│   ├── panels/
│   │   ├── PanelTerra.tsx
│   │   ├── PanelScanner.tsx
│   │   ├── PanelOrbita.tsx    — adatta OrbitMap esistente
│   │   └── PanelCompliance.tsx
│   └── ParticleField.tsx
├── hooks/
│   ├── usePanelNav.ts          — keyboard + click navigation
│   └── useLiveData.ts          — simulated env data refresh
└── lib/
    └── carbon.ts               — calcolo footprint (già nel blueprint)
```

---

## 19. Cosa NON fare (anti-pattern espliciti)

| ❌ Vietato | ✅ Invece |
|---|---|
| Hero con immagine stock | Visualizzazione dati generativa |
| Sezione "Features" con icone | Demo interattiva che mostra le feature |
| Bottoni con border-radius | CTA testuali con arrow e underline |
| Scroll infinito | Pannelli switchabili in viewport fisso |
| Colori pastello / gradiente viola | Verde segnale su nero profondo |
| Font Inter/Roboto/System | Bebas Neue + JetBrains Mono |
| Animazioni di ingresso generiche | Strip-assemble + cursore crosshair |
| "Unisciti a 10.000 aziende" generico | Counter live che cambia in tempo reale |
| Background bianco / grigio chiaro | Dark industrial con texture scanlines |

---

*EcoSignal Enterprise — Homepage Redesign v1.0*
*Design system: Mission Control · Dark Industrial · Data-Art*
