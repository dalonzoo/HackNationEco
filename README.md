# EcoSignal Enterprise

Demo hackathon in italiano per PMI italiane che vogliono trasformare dati ambientali sparsi in una sequenza operativa: intake dati, contesto territoriale, azioni AI e readiness CSRD.

L'app oggi usa un flusso "Mission Control" a 3 stadi:

1. startup minimale con upload dataset
2. deck di 4 viste che si sbloccano mentre il sistema lavora
3. navigazione focalizzata pagina-per-pagina con pulsanti previous/next

## Stato attuale

- UI interamente in italiano
- startup minimale con upload file, dataset demo e opzione manuale comprimibile
- orchestrazione visiva di 4 viste: `SCANNER`, `TERRA`, `ORBITA`, `COMPLIANCE`
- ogni vista diventa cliccabile appena i dati necessari sono pronti
- `SCANNER` mostra tracciabilita' sorgenti e output carbon live
- `TERRA` mostra note territoriali, feed open data live/demo e benchmark
- `ORBITA` mostra solo azioni AI e dettaglio operativo
- `COMPLIANCE` ospita timer CSRD, stato readiness, briefing audio AI e download report
- pipeline AI multi-agent attiva con supporto `multi-agent-llm` e `multi-agent-fallback`

## Cosa funziona oggi

### 1. Flusso Mission Control

L'esperienza principale non e' piu' una shell a pannelli statici sempre visibili. Oggi il prodotto segue questo percorso:

- startup page centrata per caricare un dataset aziendale
- click su `AVVIA FLUSSO MULTI-AGENTE`
- comparsa del deck con 4 card di stato
- apertura della singola pagina quando la card e' pronta
- navigazione tra le pagine con pulsanti `Previous` e `Next`

Le viste disponibili sono:

- `SCANNER`: sorgenti aziendali, tracciabilita', output carbon
- `TERRA`: contesto open data e segnali territoriali
- `ORBITA`: azioni AI con payoff e direct actions
- `COMPLIANCE`: readiness CSRD, briefing audio, report finale

File principali:

- [MissionControlHome.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/MissionControlHome.tsx)
- [TopBar.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/TopBar.tsx)
- [MissionPrepDeck.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/MissionPrepDeck.tsx)
- [PanelPager.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/PanelPager.tsx)
- [globals.css](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/globals.css)

### 2. Inserimento dati e tracciabilita'

La startup e' ottimizzata per far partire rapidamente la missione:

- upload di `CSV`, `JSON`, `TXT`, `PDF`, `XLSX`
- visibilita' del file collegato dopo l'upload
- pulsante per sostituire il file
- dataset demo ricaricabile
- campi manuali comprimibili, non aperti di default

Una volta entrati nella vista `SCANNER`, la colonna sinistra mostra la provenienza dati invece dei controlli di input estesi. La tracciabilita' espone:

- etichetta sorgente
- orario aggiornamento
- origine del dato
- nota sintetica di ingestione

Il parsing automatico utile al modello resta focalizzato su:

- `CSV`
- `JSON`
- `TXT`

I file `PDF` e `XLSX` possono essere caricati come sorgente/evidenza, ma non vengono ancora estratti in profondita'.

File principali:

- [PanelScanner.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/panels/PanelScanner.tsx)
- [document-ingestion.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/document-ingestion.ts)
- [mock-company-full.json](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/data/mock-company-full.json)

### 3. Open data territoriali

Gli open data non vivono piu' in una colonna laterale persistente. Oggi sono integrati dentro `TERRA`, sotto `NOTE DAL TERRITORIO`, tramite feed live/demo aggiornato periodicamente.

Il feed mostra ad esempio:

- PM2.5 territoriale
- trend temperatura
- CO2 atmosferica
- rischio territoriale
- quota energia rinnovabile

La vista `TERRA` unisce:

- note territoriali
- feed ambientale live/demo
- incentivi
- benchmark vs baseline aziendale

File principali:

- [PanelTerra.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/panels/PanelTerra.tsx)
- [LiveFeed.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/LiveFeed.tsx)
- [useLiveData.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/hooks/useLiveData.ts)
- [app/api/open-data/context/route.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/open-data/context/route.ts)

### 4. Motore AI multi-agent

L'endpoint AI usa una pipeline organizzata in 4 agenti:

- `planner`
- `benchmark`
- `compliance`
- `action`

Flusso logico:

1. si parte dal carbon model locale e dai dati aziendali
2. si carica il contesto open data territoriale
3. gira il `planner`
4. `benchmark`, `compliance` e `action` girano in parallelo
5. la route restituisce `source`, `orchestrationMode`, `agentTrace` e warning eventuali

Modalita' supportate:

- `multi-agent-llm` quando Regolo risponde correttamente
- `multi-agent-fallback` quando l'LLM non e' disponibile

File principali:

- [route.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/ai/insights/route.ts)
- [insights-orchestrator.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/ai/insights-orchestrator.ts)
- [insights-agents.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/ai/insights-agents.ts)

### 5. Azioni AI, briefing e report

`ORBITA` oggi e' dedicata solo alle azioni:

- sfera centrale con ESG score
- azioni selezionabili in orbita
- dettaglio payoff, impatto, difficulty, incentivi e direct actions

Il briefing audio non e' piu' in `ORBITA`. Ora si trova in `COMPLIANCE`, in alto a destra, insieme a:

- trigger briefing giornaliero
- player audio se disponibile
- transcript operativo
- warning fallback eventuali

Sempre in `COMPLIANCE` sono presenti:

- countdown readiness
- stato missione
- trace sintetica compliance
- CTA per generare il report PDF CSRD

File principali:

- [PanelOrbita.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/panels/PanelOrbita.tsx)
- [PanelCompliance.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/panels/PanelCompliance.tsx)
- [app/api/audio/briefing/route.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/audio/briefing/route.ts)
- [app/api/reports/csrd/route.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/reports/csrd/route.ts)

## Demo vs live

Il prodotto resta demo-first, ma con hook live reali dove disponibili.

- i dati aziendali partono da upload utente o mock
- il contesto territoriale prova a usare open data live, con fallback demo
- l'AI usa Regolo quando raggiungibile, altrimenti fallback locale multi-agent
- l'audio usa ElevenLabs quando disponibile, altrimenti transcript/demo
- Supabase non e' ancora esposto nel flusso UI finale

Questo rende l'app presentabile anche in ambienti di demo o sandbox con connettivita' parziale.

## Setup locale

1. Copia [.env.example](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/.env.example) in `.env.local` oppure configura direttamente il tuo `.env`
2. Installa le dipendenze con `cmd /c npm install`
3. Avvia in sviluppo con `cmd /c npm run dev`
4. Verifica build con `cmd /c npm run build`
5. Verifica produzione con `cmd /c npm run start`

Variabili rilevanti:

- `REGOLO_API_KEY`
- `REGOLO_API_URL`
- `REGOLO_MODEL` opzionale, default `gpt-oss-20b`
- `ELEVENLABS_API_KEY`
- `ELEVENLABS_VOICE_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Test eseguiti

Verifiche eseguite sull'ambiente attuale:

- `npm run build`: passato
- smoke test `POST /api/ai/insights`: passato
- verifica LLM reale: passata

Risultato piu' recente del test route AI:

- `agentCount: 4`
- `firstAgent: planner`
- `orchestrationMode: multi-agent-llm`
- `agentModes: llm,llm,llm,llm`
- `source: regolo-multi-agent`
- `warning: null`

Nota:

- Regolo e' raggiungibile e risponde correttamente via `chat/completions`
- la route AI usa payload OpenAI-compatible con `model` configurabile
- il briefing audio puo' usare ElevenLabs quando disponibile
- il mock demo effettivo e' letto da [mock-company-full.json](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/data/mock-company-full.json)

## Limiti attuali

- parsing automatico documenti ancora limitato a `CSV`, `JSON`, `TXT`
- `PDF` e `XLSX` non hanno ancora estrazione semantica completa
- `agentTrace` e' disponibile a livello dati ma non ancora mostrato come vista diagnostica dedicata
- Supabase non e' ancora collegato end-to-end al flusso prodotto

## Prossimi step consigliati

- aggiungere parsing reale di bollette e PDF
- esporre una vista diagnostica dell'`agentTrace`
- collegare persistenza aziende, upload e report su Supabase
- aggiungere badge piu' espliciti `LIVE`, `DEMO`, `DERIVATO`
- raffinare i micro-copy della tracciabilita' e della readiness per uso executive/demo
