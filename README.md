# EcoSignal Enterprise

Piattaforma AI per trasformare dati ambientali complessi in decisioni operative per PMI italiane: da input aziendale e open data a azioni concrete, misurabili e rendicontabili.

Challenge di riferimento: **EcoSignal: dai dati al gesto** (Engineering).

---

## Pitch in 30 secondi

Le PMI hanno dati ambientali frammentati, poco interpretabili e poco utili per prendere decisioni rapide. EcoSignal Enterprise riduce questo gap in meno di 10 minuti con un flusso end-to-end:

1. acquisizione dati aziendali (upload o input guidato)
2. calcolo baseline emissioni Scope 1/2/3 e score ESG
3. integrazione contesto territoriale da open data
4. azioni AI prioritarie con impatto CO2 ed economico
5. output compliance-ready (briefing + report CSRD)

Il risultato e' un passaggio concreto dal dato al gesto: non solo awareness, ma decisioni eseguibili.

---

## Coerenza con i criteri di valutazione

### 1) Coerenza con la challenge scelta

Requisito challenge | Come risponde EcoSignal
--- | ---
Integrare dati ambientali da fonti aperte | Endpoint open data territoriale con fallback deterministico robusto.
Tradurre dati in insight chiari | Dashboard Mission Control con viste progressive e KPI leggibili anche a non esperti.
Suggerire comportamenti/scelte con impatto misurabile | Azioni AI con stima riduzione CO2, risparmio economico, difficolta', payback.
Creare feedback loop nel tempo | Flusso missione + briefing + readiness compliance + roadmap 30 giorni.
Essere accessibile | UI in italiano, percorso guidato, onboarding rapido, narrativa operativa.

### 2) Impatto sociale e benefici

- democratizza strumenti ESG per PMI che non hanno budget consulenziale elevato
- accelera decisioni a impatto reale su emissioni, mobilita', energia e supply chain
- migliora la qualita' delle decisioni locali grazie al contesto territoriale (aria, trend meteo, rischio climatico)
- abilita filiere piu' trasparenti: PMI piu' pronte alla compliance diventano partner piu' affidabili per grandi aziende

### 3) Chiarezza e completezza del prototipo

- percorso demo completo da input a output finale
- 4 pannelli funzionali con ruoli distinti: `SCANNER`, `TERRA`, `ORBITA`, `COMPLIANCE`
- API dedicate per insight AI, open data, audio briefing e report CSRD
- fallback gestiti per garantire continuita' demo anche con connettivita'/API parziali

### 4) Qualita' dell'implementazione tecnica

- stack moderno (Next.js + TypeScript + API routes)
- orchestrazione multi-agent con modalita' LLM reale e fallback locale
- tipi dati espliciti per contratti applicativi e tracciabilita'
- pipeline strutturata: ingestion -> carbon/esg -> AI insights -> compliance artifacts

### 5) Privacy, bias, trasparenza

- input parsing con allowlist campi e normalizzazione controllata
- data lineage visibile per sorgenti e timestamp
- output con breakdown esplicito Scope 1/2/3 e score ESG E/S/G
- limiti dichiarati con roadmap di mitigazione (bias audit, governance dati, retention)

---

## Cosa fa il prototipo

### Mission Control a 4 pannelli

- `SCANNER`: sorgenti dati, tracciabilita', baseline carbon
- `TERRA`: segnali territoriali e benchmark contestuali
- `ORBITA`: raccomandazioni AI con ROI ambientale/economico
- `COMPLIANCE`: readiness CSRD, briefing audio, export report

### Modalita' dati

- input da file o manuale
- dataset demo pronto per prova immediata
- parsing operativo su CSV/JSON/TXT
- supporto upload PDF/XLSX come evidenza (estrazione semantica avanzata in roadmap)

### Modalita' AI

- `multi-agent-llm` quando provider LLM disponibile
- `multi-agent-fallback` quando non disponibile

---

## Demo journey (3-5 minuti)

1. **Avvio e ingestion**
Carica un dataset aziendale (o usa demo) e avvia il flusso multi-agente.

2. **SCANNER: baseline e tracciabilita'**
Mostra sorgenti dati e baseline emissioni per Scope 1/2/3.

3. **TERRA: contesto open data**
Visualizza rischio climatico territoriale e segnali ambientali live/demo.

4. **ORBITA: azioni prioritarie**
Seleziona una raccomandazione e mostra KPI: CO2 evitata, risparmio, effort, payback.

5. **COMPLIANCE: output finale**
Genera briefing audio e report CSRD PDF con roadmap operativa.

Messaggio finale da presentare alla giuria: EcoSignal rende operativa la sostenibilita' per PMI, collegando dati e comportamenti con evidenze misurabili.

---

## Architettura tecnica

### Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind
- Backend: Next.js API routes
- AI: provider LLM (Regolo/Gemini con fallback), orchestrazione agenti
- Audio: ElevenLabs
- Report: jsPDF
- Data layer: Supabase schema disponibile
- Deploy: Docker + Railway

### Flusso applicativo

```text
Input aziendale -> Document ingestion -> Carbon/ESG engine
-> Open data context -> AI orchestration
-> Action recommendations -> CSRD report + audio briefing
```

---

## Evidenze nel codice

- Ingestion e validazione: `lib/document-ingestion.ts`
- Carbon footprint Scope 1/2/3: `lib/carbon.ts`
- ESG scoring: `lib/esg.ts`
- Open data + fallback: `lib/open-data.ts`
- Tipi condivisi e contratti: `lib/types.ts`
- Orchestrazione insight AI: `lib/ai/insights-orchestrator.ts`
- API insight: `app/api/ai/insights/route.ts`
- API contesto territoriale: `app/api/open-data/context/route.ts`
- API briefing audio: `app/api/audio/briefing/route.ts`
- API report CSRD: `app/api/reports/csrd/route.ts`
- UI Mission Control: `components/mission-control/`

---

## Open data: stato integrazione

Attuale in prototipo:

- integrazione contesto meteo/climatico con fonte live quando disponibile
- fallback deterministico per demo resiliente
- distinzione esplicita tra sorgente live e demo

Roadmap post-hackathon:

- estensione dataset pubblici nazionali (es. indicatori ambientali territoriali piu' granulari)
- benchmarking settoriale piu' approfondito per categoria ATECO

---

## Privacy, bias, trasparenza (trust-by-design)

Tema | Stato attuale | Mitigazione roadmap
--- | --- | ---
Privacy by default | Gestione via variabili ambiente, no secret hardcoded | policy retention/cancellazione dati esplicita
Trasparenza dati | Tracciabilita' sorgenti e timestamp | audit trail completo su decisioni e override
Trasparenza modello | Output con breakdown e motivazioni operative | spiegazioni strutturate per ogni raccomandazione
Bias settoriale | Benchmark semplificati per settore | bias audit periodico e mapping settoriale piu' robusto
Robustezza demo | fallback deterministico multi-livello | monitoraggio qualita' predizioni in produzione

Nota per giuria: il progetto preferisce trasparenza sui limiti rispetto a claim non verificabili.

---

## Impatto misurabile (KPI di progetto)

KPI target in validazione pilota:

- tempo medio da onboarding a prima azione: < 10 minuti
- numero azioni implementate per azienda in 30 giorni
- riduzione stimata CO2 aggregata per portfolio PMI
- risparmio economico stimato per azienda
- incremento readiness compliance (baseline vs dopo 30 giorni)

---

## Setup locale

### Requisiti

- Node.js 20+
- npm

### Avvio rapido

1. Installa dipendenze:

```bash
npm install
```

2. Configura variabili ambiente copiando `.env.example` in `.env.local`.

3. Avvia in sviluppo:

```bash
npm run dev
```

4. Verifica build:

```bash
npm run build
```

5. Avvia build produzione:

```bash
npm run start
```

### Variabili ambiente principali

- `REGOLO_API_KEY`
- `REGOLO_API_URL`
- `REGOLO_MODEL` (opzionale)
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Endpoint principali

- `POST /api/ai/insights` -> genera insight multi-agent e azioni
- `GET /api/open-data/context` -> recupera contesto ambientale territoriale
- `POST /api/audio/briefing` -> genera briefing audio operativo
- `POST /api/reports/csrd` -> genera report CSRD in PDF

---

## Jury technical deep dive

Questa sezione e' pensata per valutatori tecnici: mostra contratti API, logica computazionale e comportamento in fallback.

### 1) Contratti API (request/response)

#### POST /api/ai/insights

Request (sintesi):

```json
{
	"data": {
		"companyName": "LogiTrans Srl",
		"sector": "Logistica",
		"atecoCode": "52.29",
		"city": "Milano",
		"employeesRange": "50-99",
		"revenueRange": "10-25M",
		"budgetRange": "100k-250k",
		"facilities": 2,
		"electricityKwh": 420000,
		"gasM3": 58000,
		"waterM3": 12000,
		"dieselKm": 860000,
		"petrolKm": 110000,
		"electricKm": 90000,
		"flightsKm": 65000,
		"trainKm": 42000,
		"localSuppliersPct": 48,
		"wasteKg": 92000,
		"recyclingPct": 62,
		"travelPlanning": {
			"annualTrips": 380,
			"employeeTravelers": 42,
			"shortHaulFlightSharePct": 46,
			"railEligibleTripSharePct": 44,
			"advanceBookingDays": 11,
			"virtualMeetingSharePct": 28,
			"hotelPolicyCoveragePct": 52,
			"approvalWorkflowCoveragePct": 47,
			"lastMinuteBookingSharePct": 31,
			"weekendExtensionRiskPct": 18,
			"hotelNightsAnnual": 510,
			"preferredRailCorridors": ["MI-RO", "MI-BO"],
			"topTripReasons": ["clienti", "fornitori"]
		}
	},
	"openData": {
		"source": "live",
		"city": "Milano",
		"sector": "Logistica",
		"airQualityIndex": 54,
		"airQualityLabel": "Moderata",
		"weeklyTemperatureDelta": 2.3,
		"climateRiskLabel": "Stress idrico",
		"notes": ["..."],
		"incentives": ["..."]
	}
}
```

Response (chiavi principali):

```json
{
	"carbon": {
		"scope1": 0,
		"scope2": 0,
		"scope3": 0,
		"total": 0,
		"benchmarkTotal": 0
	},
	"score": {
		"total": 0,
		"environment": 0,
		"social": 0,
		"governance": 0
	},
	"actions": [
		{
			"id": "renewable-energy",
			"title": "...",
			"priority": 1,
			"difficulty": 2,
			"reductionTco2": 12,
			"annualSavingEur": 3200,
			"paybackMonths": 7,
			"incentive": "..."
		}
	],
	"summary": ["..."],
	"complianceSummary": {
		"headline": "...",
		"detail": "...",
		"focus": "...",
		"missingItems": ["..."],
		"readinessPct": 68
	},
	"orchestrationMode": "multi-agent-llm",
	"agentTrace": [
		{ "agent": "planner", "mode": "llm", "title": "planner completed", "content": "..." }
	],
	"source": "regolo-multi-agent",
	"warning": "...",
	"systemPrompt": "..."
}
```

Note operative:

- provider LLM tentati in sequenza: Gemini, poi Regolo
- in caso errore provider, fallback deterministico locale con `orchestrationMode: multi-agent-fallback`

#### GET /api/open-data/context?city=Milano&sector=Manifattura

Response:

```json
{
	"source": "live",
	"city": "Milano",
	"sector": "Manifattura",
	"airQualityIndex": 49,
	"airQualityLabel": "Moderata",
	"weeklyTemperatureDelta": 1.8,
	"climateRiskLabel": "Transizione monitorata",
	"notes": ["..."],
	"incentives": ["..."]
}
```

#### POST /api/audio/briefing

Request (sintesi):

```json
{
	"companyName": "LogiTrans Srl",
	"summary": ["..."],
	"actions": [{ "id": "renewable-energy", "title": "..." }],
	"openData": {
		"source": "live",
		"city": "Milano",
		"sector": "Logistica",
		"airQualityIndex": 54,
		"airQualityLabel": "Moderata",
		"weeklyTemperatureDelta": 2.3,
		"climateRiskLabel": "Stress idrico",
		"notes": ["..."],
		"incentives": ["..."]
	},
	"complianceSummary": {
		"headline": "...",
		"detail": "...",
		"focus": "...",
		"missingItems": ["..."],
		"readinessPct": 68
	}
}
```

Response:

```json
{
	"source": "elevenlabs",
	"transcript": "...",
	"audioUrl": "data:audio/mpeg;base64,...",
	"voiceId": "...",
	"voiceName": "...",
	"generatedAt": "2026-03-29T12:00:00.000Z",
	"warning": "..."
}
```

Note operative:

- se `ELEVENLABS_VOICE_ID` non valido, tenta una voce alternativa disponibile
- se ElevenLabs non disponibile, ritorna transcript demo con `warning`

#### POST /api/reports/csrd

Input: `data`, `carbon`, `score`, `actions`, opzionali `openData`, `complianceSummary`.

Output:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="ecosignal-csrd-<company>.pdf"`

### 2) Orchestrazione multi-agent

Pipeline implementata:

1. calcolo baseline (`calculateCarbonFootprint`) e score ESG (`calculateEsgScore`)
2. costruzione summary e compliance summary
3. esecuzione agente `planner`
4. esecuzione in parallelo agenti `benchmark`, `compliance`, `action`
5. risposta con `agentTrace` completo

Se il runner LLM fallisce in qualunque fase, il risultato resta completo ma in modalita' fallback deterministica.

### 3) Logica numerica principale

Carbon model:

- Scope 1 = gas + diesel + petrol
- Scope 2 = elettricita'
- Scope 3 = voli + treno + rifiuti + penalita' filiera non locale

Benchmark settoriale (fattore sul totale):

- logistica: 1.08
- servizi: 0.82
- default: 0.94

ESG score:

- `Environment = 0.55 * emissionScore + 0.45 * recyclingScore`
- `Social = 0.60 * supplierScore + 0.40 * (100 - weekendExtensionRiskPct)`
- `Governance = travelGovernance`
- `Total = 0.50 * Environment + 0.25 * Social + 0.25 * Governance`

### 4) Data validation e ingestion

- parsing supportato: JSON, CSV, TXT
- allowlist stretta su campi top-level (`allowedTopLevelKeys`)
- normalizzazione numerica con gestione separatori IT (`1.234,56` -> `1234.56`)
- `applyMode`:
	- `replace` su payload JSON completo
	- `merge` su patch parziale

### 5) Affidabilita' e fallback

- Open data:
	- prova sorgente live Open-Meteo
	- fallback demo deterministico hash-based per output coerenti tra run
- AI insight:
	- catena provider LLM + fallback locale multi-agent
- Audio:
	- tenta voce configurata, poi voce alternativa, poi transcript demo

Impatto tecnico: demo stabile anche in condizioni di rete/API non ideali.

### 6) Note per valutazione tecnica

- il prototipo privilegia robustezza e trasparenza dello stato (`source`, `warning`, `orchestrationMode`)
- i contratti TypeScript sono espliciti per ridurre ambiguita' tra frontend e backend
- i limiti attuali sono dichiarati e mappati a roadmap (bias audit, granularita' fattori emissivi, governance dati)

---

## Deploy su Railway (Docker)

Il repository include:

- `Dockerfile` multi-stage con output standalone
- `railway.json` per build/deploy

Passi:

1. collega repository a Railway
2. configura variabili ambiente
3. deploy automatico via Dockerfile

Test locale container (opzionale):

```bash
docker build -t ecosignal-railway .
docker run --rm -p 3000:3000 --env-file .env.local ecosignal-railway
```

---

## Struttura repository (sintesi)

```text
app/
	api/
components/
	mission-control/
lib/
	ai/
hooks/
data/
supabase/
```

---

## Limiti attuali

- parsing documentale avanzato PDF/XLSX non ancora completo
- persistenza Supabase non ancora esposta end-to-end nella UI finale
- agent trace disponibile nei dati ma non ancora con pannello diagnostico dedicato

---

## Roadmap post-hackathon

1. Estensione open data nazionali e territoriali ad alta granularita'
2. Miglioramento modelli emissivi con fattori piu' specifici per settore/processo
3. Bias audit framework e policy di governance dati
4. Integrazione completa persistenza (aziende, azioni, report) su Supabase
5. Export compliance multi-standard oltre CSRD

---

## Perche' questa soluzione e' coerente con "dai dati al gesto"

EcoSignal non si ferma alla visualizzazione del problema ambientale: trasforma dati in un piano di azione con priorita', impatto stimato e strumenti operativi per esecuzione e rendicontazione. Questo e' il ponte mancante tra intenzione e comportamento reale.
