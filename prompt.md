# EcoSignal Enterprise — Hackathon Blueprint
> Challenge: EcoSignal — dai dati al gesto | Engineering
> Approccio: B2B SaaS · ESG Intelligence Platform

---

## 1. Vision & Positioning

### Il Problema (B2B)
- Il **74% delle PMI italiane** non ha un sistema strutturato per misurare l'impatto ambientale
- La direttiva **CSRD (Corporate Sustainability Reporting Directive)** obbliga migliaia di aziende europee a rendicontare la sostenibilità dal 2025-2026
- I dati esistono (fatture energetiche, flotte, logistica), ma sono **silos disgiunti e non interpretabili**
- I consulenti ESG costano €500-2.000/giorno — inaccessibili per le PMI

### La Soluzione
**EcoSignal Enterprise** è una piattaforma AI-powered che:
1. **Aggrega** automaticamente i dati ambientali aziendali da fonti open e proprietarie
2. **Traduce** i dati in un ESG score azionabile, con benchmark di settore
3. **Suggerisce** azioni concrete con ROI calcolato (risparmio € + riduzione CO₂)
4. **Genera** report di compliance automatici (CSRD, GRI, CDP)
5. **Motiva** con feedback loop trimestrali e obiettivi misurabili

### Differenziatori Chiave
| Feature | EcoSignal Enterprise | Competitor tradizionali |
|---|---|---|
| Setup | < 10 minuti | Mesi di consulenza |
| Costo | SaaS accessibile | €50k+ consulenza |
| AI-driven insights | ✅ Real-time | ❌ Report statici |
| Compliance CSRD auto | ✅ | ❌ Manuale |
| Open data integration | ✅ | ❌ |
| Lingua italiana | ✅ Nativamente | ❌ |

---

## 2. Target B2B

### Segmenti Primari
- **PMI italiane 50-500 dipendenti** soggette a CSRD (o nella supply chain di chi lo è)
- **Settori prioritari**: manifatturiero, logistica, retail, food & beverage, edilizia
- **Decision maker**: CFO, Sustainability Manager, CEO di PMI

### Pain Points Specifici
1. "Non so da dove iniziare con l'ESG"
2. "Ho i dati ma non so interpretarli"
3. "Il mio cliente enterprise mi chiede un report ESG entro 3 mesi"
4. "Non ho budget per un consulente"

---

## 3. Architettura Tecnica

### Stack Consigliato
```
Frontend:    Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:     Next.js API Routes / Node.js Express
AI/LLM:      Regolo.ai (modelli italiani) + ElevenLabs (audio briefing)
Database:    Supabase (PostgreSQL + Auth + Storage)
Charts:      Recharts / D3.js
Deploy:      Vercel (frontend) + Railway (backend se separato)
```

### Diagramma Architettura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│  Dashboard · Input Wizard · Report Generator · Alerts    │
└────────────────────────┬────────────────────────────────┘
                         │ API calls
┌────────────────────────▼────────────────────────────────┐
│                   BACKEND / API LAYER                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Data Ingestion│  │ AI Engine    │  │ Report Engine  │  │
│  │ Module      │  │ (Regolo.ai)  │  │ (CSRD/GRI)     │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                   │           │
│  ┌──────▼──────────────────────────────────▼──────────┐  │
│  │              Supabase (DB + Auth)                   │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  OPEN DATA SOURCES                       │
│                                                          │
│  • ISPRA (emissioni, qualità aria)                       │
│  • GSE (consumi energetici nazionali)                    │
│  • MISE / ENEA (benchmark energetici per settore)        │
│  • OpenMeteo API (temperature, eventi climatici)         │
│  • ISTAT (dati demografici/territoriali)                 │
│  • EEA (European Environment Agency)                     │
│  • Our World in Data (benchmark CO₂ per settore)         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Moduli Funzionali

### Modulo 1 — Onboarding Wizard (< 10 minuti)
**Obiettivo**: raccogliere i dati essenziali aziendali senza richiedere expertise tecnica.

**Step dell'onboarding**:
1. **Profilo azienda**: settore ATECO, numero dipendenti, sede(i), fatturato range
2. **Energia**: consumi elettrici mensili (kWh) — upload bolletta o inserimento manuale
3. **Mobilità**: flotta aziendale (n. veicoli, tipo), trasferte aeree/treno annue
4. **Supply chain**: paese di origine principali fornitori, % acquisti locali
5. **Rifiuti**: produzione rifiuti mensile stimata, % raccolta differenziata
6. **Acqua**: consumo idrico mensile (m³) se rilevante per il settore

**UX**: Progress bar gamificata, tooltip contestuali, nessun campo obbligatorio bloccante.

---

### Modulo 2 — ESG Intelligence Dashboard
**Obiettivo**: trasformare i dati in insight visivi e azionabili.

**Componenti Dashboard**:

```
┌──────────────────────────────────────────────────────┐
│  ESG SCORE GLOBALE          ● Benchmark Settore       │
│  ████████░░  72/100         ▲ +8 punti vs media       │
│                                                       │
│  E (Ambiente)  S (Sociale)  G (Governance)            │
│  68/100        78/100       70/100                    │
├──────────────────────────────────────────────────────┤
│  CARBON FOOTPRINT               TREND 12 MESI        │
│  142 tCO₂eq/anno               [grafico lineare]     │
│  Equivale a: 🌳 14.200 alberi                        │
├──────────────────────────────────────────────────────┤
│  TOP 3 AZIONI AD ALTO IMPATTO                        │
│  1. Passa a energia rinnovabile → -23 tCO₂ → -€4.200 │
│  2. Ottimizza flotta → -8 tCO₂ → -€1.800/anno        │
│  3. Fornitori locali → -12 tCO₂ → rischio supply -15%│
├──────────────────────────────────────────────────────┤
│  AI BRIEFING GIORNALIERO        [▶ Ascolta 2 min]    │
│  "Questa settimana la qualità dell'aria a Milano..."  │
└──────────────────────────────────────────────────────┘
```

---

### Modulo 3 — AI Action Engine (Regolo.ai)
**Obiettivo**: generare insight personalizzati, non generici.

**Prompt System (da inviare a Regolo.ai)**:

```
SYSTEM PROMPT:
Sei EcoSignal, un consulente ESG AI specializzato per PMI italiane.
Parli in italiano, usi un tono professionale ma accessibile.
Hai accesso ai dati ambientali dell'azienda e ai benchmark di settore.
Ogni suggerimento include:
- Impatto CO₂ stimato (tCO₂eq)
- Risparmio economico annuo stimato (€)
- Difficoltà di implementazione (1-5)
- Tempo di payback (mesi)
- Link a incentivi/agevolazioni italiani applicabili

Non essere generico. Usa sempre i dati specifici dell'azienda.
Confronta sempre con la media del settore ATECO dell'azienda.

USER CONTEXT (dynamic injection):
- Settore: {sector}
- Dipendenti: {employees}
- Carbon footprint attuale: {co2_total} tCO₂eq/anno
- Benchmark settore: {sector_benchmark} tCO₂eq/anno per dipendente
- Top fonte emissioni: {top_emission_source}
- Budget stimato per interventi: {budget_range}
```

**Funzionalità AI**:
1. **Weekly Digest**: analisi settimanale automatica con 3 insight prioritari
2. **What-if Simulator**: "Cosa succede se sostituisco 5 auto con EV?" → calcolo istantaneo
3. **Incentivi Finder**: incrocia profilo aziendale con database incentivi (Conto Termico, PNRR, ecc.)
4. **Supplier ESG Scorer**: valuta fornitori su base pubblica e suggerisce alternative

---

### Modulo 4 — Audio Briefing (ElevenLabs)
**Obiettivo**: accessibilità totale, anche per chi non ha tempo di leggere dashboard.

**Implementazione**:
```javascript
// Genera script briefing con Regolo.ai
const briefingScript = await regolo.generate({
  prompt: `Genera un briefing audio di 90 secondi per ${companyName}.
  Questa settimana: ${weeklyHighlights}.
  Tono: professionale, diretto, motivante. 
  Inizia con il dato più importante.`
});

// Converti in audio con ElevenLabs
const audio = await elevenlabs.textToSpeech({
  text: briefingScript,
  voice: "it-IT-professional-male", // voce italiana professionale
  model: "eleven_multilingual_v2"
});
```

**UX**: player audio nella dashboard, ascoltabile in 90 secondi, generato ogni lunedì mattina.

---

### Modulo 5 — Report CSRD Auto-Generator
**Obiettivo**: il modulo che sblocca il valore reale per le aziende (compliance).

**Output prodotti**:
1. **Report CSRD precompilato** (ESRS E1 - Climate Change, E2 - Pollution)
2. **GRI Standards summary** (GRI 302 Energy, GRI 305 Emissions)
3. **Carbon Disclosure Project (CDP)** questionnaire draft
4. **Export**: PDF, Excel, JSON per integrazione con ERP

**Struttura report CSRD auto-generato**:
```
1. Governance della sostenibilità
2. Strategia e modello di business
3. Gestione dei rischi e opportunità
4. Indicatori e obiettivi (KPI con dati reali dell'azienda)
5. Piano di transizione
```

---

### Modulo 6 — Feedback Loop & Gamification (B2B)
**Obiettivo**: mantenere l'engagement nel tempo senza essere childish.

**Meccaniche B2B-appropriate**:
- **ESG Score Progress**: visualizzazione trimestrale del miglioramento
- **Industry Ranking**: posizione anonimizzata rispetto ai competitor del settore
- **Obiettivi con milestone**: "Riduci del 10% entro Q3 → 3 azioni suggerite"
- **Certificate di Achievement**: badge scaricabili per LinkedIn/sito aziendale
- **Team Challenges**: coinvolgi i dipendenti con micro-sfide aziendali

---

## 5. Integrazione Open Data

### API e Dataset da Integrare

```javascript
// 1. Qualità dell'aria — ISPRA / OpenAQ
const airQuality = await fetch(
  `https://api.openaq.org/v2/latest?city=${city}&parameter=pm25`
);

// 2. Temperature e eventi meteo — Open-Meteo (free, no key)
const weather = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max`
);

// 3. Fattori di emissione energia elettrica — Our World in Data / AIB
// Dataset statico aggiornato annualmente
const emissionFactor = getEmissionFactor('IT', year); // gCO₂/kWh

// 4. Benchmark settoriali — ENEA / Eurostat
const sectorBenchmark = await getSectorBenchmark(atecoCode);

// 5. Incentivi — API OpenPOME (Ministero MASE)
const incentives = await fetch(
  `https://www.gse.it/api/incentivi?settore=${sector}`
);
```

### Calcolo Carbon Footprint (metodologia GHG Protocol)

```javascript
function calculateCarbonFootprint(inputs) {
  const scope1 = {
    // Emissioni dirette
    fleet: inputs.fleet.diesel_km * 0.171 + inputs.fleet.petrol_km * 0.192, // kgCO₂/km
    naturalGas: inputs.gas_m3 * 2.034, // kgCO₂/m³
  };

  const scope2 = {
    // Energia acquistata
    electricity: inputs.electricity_kwh * 0.233, // fattore emissione IT 2024 (kgCO₂/kWh)
  };

  const scope3 = {
    // Catena del valore
    businessTravel: inputs.flights_km * 0.255 + inputs.train_km * 0.006,
    supply_chain: estimateScope3(inputs.sector, inputs.revenue),
    waste: inputs.waste_kg * 0.467,
  };

  return {
    scope1: sumObject(scope1),
    scope2: sumObject(scope2),
    scope3: sumObject(scope3),
    total: sumObject(scope1) + sumObject(scope2) + sumObject(scope3),
    unit: 'tCO₂eq/anno'
  };
}
```

---

## 6. Roadmap di Sviluppo (Hackathon)

### Timeline Consigliata (24-48h)

```
FASE 1 — Foundation (0-6h)
├── Setup Next.js + Supabase + Tailwind
├── Auth (login/signup azienda)
├── Schema DB (companies, emissions_data, actions, reports)
└── Integrazione base Regolo.ai

FASE 2 — Core Features (6-18h)
├── Onboarding Wizard (5 step)
├── Calcolo carbon footprint (GHG Protocol)
├── Dashboard ESG con grafici
├── AI Action Engine (top 3 azioni)
└── Open data integration (OpenAQ + Open-Meteo)

FASE 3 — Differenziatori (18-30h)
├── Audio Briefing con ElevenLabs
├── What-if Simulator
├── Report CSRD generator (PDF)
└── Benchmark settoriale

FASE 4 — Polish & Demo (30-48h)
├── UI/UX refinement
├── Demo con dati realistici (azienda manifatturiera italiana fittizia)
├── Onboarding tour interattivo
└── Preparazione pitch (slide + demo flow)
```

---

## 7. Schema Database (Supabase)

```sql
-- Aziende
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ateco_code TEXT,
  sector TEXT,
  employees_range TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dati emissioni (snapshot annuale/mensile)
CREATE TABLE emissions_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  period TEXT, -- es. '2024-Q1'
  electricity_kwh NUMERIC,
  gas_m3 NUMERIC,
  fleet_km NUMERIC,
  fleet_type TEXT, -- 'diesel','petrol','electric','mixed'
  flights_km NUMERIC,
  waste_kg NUMERIC,
  water_m3 NUMERIC,
  scope1_tco2 NUMERIC,
  scope2_tco2 NUMERIC,
  scope3_tco2 NUMERIC,
  total_tco2 NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Azioni suggerite dall'AI
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  title TEXT,
  description TEXT,
  co2_reduction_tco2 NUMERIC,
  cost_saving_eur NUMERIC,
  difficulty_score INTEGER, -- 1-5
  payback_months INTEGER,
  status TEXT DEFAULT 'suggested', -- suggested, in_progress, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report generati
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  report_type TEXT, -- 'csrd', 'gri', 'cdp', 'summary'
  content JSONB,
  pdf_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ESG Score storico
CREATE TABLE esg_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  period TEXT,
  environmental_score INTEGER,
  social_score INTEGER,
  governance_score INTEGER,
  total_score INTEGER,
  sector_benchmark INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Pitch Deck Structure (5 minuti)

```
SLIDE 1 — Hook (30s)
"Il 74% delle aziende italiane non sa misurare il proprio impatto ambientale.
La CSRD li obbliga a farlo entro il 2026. EcoSignal è la soluzione."

SLIDE 2 — Il Problema (45s)
• Dati dispersi e silos
• Consulenti ESG inaccessibili per le PMI
• Compliance CSRD obbligatoria ma complessa

SLIDE 3 — La Soluzione (60s)
Live demo del wizard onboarding → dashboard → AI insights → report

SLIDE 4 — Come Funziona (45s)
Architettura semplificata: dati in → AI → insights + report out

SLIDE 5 — Business Model (30s)
• Freemium: ESG score base gratuito
• Pro €99/mese: report CSRD + AI illimitata + benchmark
• Enterprise: custom, API, white-label

SLIDE 6 — Traction & Market (30s)
• TAM: 200.000 PMI italiane soggette a CSRD
• Pilot: 3 aziende test disponibili
• Revenue potential: €20M ARR a 5% penetrazione

SLIDE 7 — Team & Ask (30s)
Chi siete, cosa vi serve, prossimi step
```

---

## 9. Variabili d'Ambiente Necessarie

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

REGOLO_API_KEY=your_regolo_api_key
REGOLO_API_URL=https://api.regolo.ai/v1

ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_italian_voice_id

OPENAQ_API_KEY=your_openaq_key  # gratuita
# Open-Meteo: no key required
```

---

## 10. Prompt per l'Agente Implementatore

Usa questo documento come specifiche complete. Implementa nella seguente sequenza:

1. **Prima**: setup progetto Next.js + Supabase + schema DB
2. **Seconda**: Onboarding Wizard (5 step con validazione)
3. **Terza**: logica calcolo carbon footprint (file `lib/carbon.ts`)
4. **Quarta**: Dashboard ESG con Recharts (grafici: donut scope 1/2/3, line trend, bar benchmark)
5. **Quinta**: integrazione Regolo.ai per AI insights (API route `/api/ai/insights`)
6. **Sesta**: integrazione ElevenLabs per audio briefing (API route `/api/audio/briefing`)
7. **Settima**: Report generator CSRD (template + export PDF con `jspdf`)
8. **Ottava**: UI polish — design system, animazioni, responsive

**Requisiti UI**:
- Dark theme professionale con accent verde (#00C896)
- Font: Syne (display) + DM Sans (body)
- Animazioni: fade-in staggered su caricamento dashboard
- Mobile-first, accessibile (WCAG AA)
- Loading states su tutte le chiamate AI
- Empty states informativi (non bianchi)

**Requisiti Funzionali Non Negoziabili**:
- Il wizard deve completarsi in < 3 click per step
- Il carbon footprint deve calcolarsi in real-time mentre l'utente digita
- Le AI insights devono caricarsi in < 5 secondi (con skeleton loader)
- Il report PDF deve generarsi in < 10 secondi
- L'audio briefing deve essere < 90 secondi
```

---

*EcoSignal Enterprise — Blueprint v1.0 | Hackathon Engineering 2025*