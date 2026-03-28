# EcoSignal Enterprise

Demo hackathon in italiano per PMI italiane che vogliono trasformare dati ambientali sparsi in una dashboard operativa, insight ESG, azioni prioritarie e reportistica CSRD.

L'interfaccia principale segue il redesign "Mission Control": top bar, navigazione verticale, feed ambientale laterale, pannello scanner con drag and drop documenti e viste dedicate per azioni AI e compliance.

## Stato attuale

- Homepage redesign completata in stile Mission Control
- UI tutta in italiano
- Inserimento dati supportato via dataset demo, input manuale e drag and drop documenti
- Dataset demo principale allineato a `Metalmeccanica Aurora S.p.A.` con blocco dedicato al travel planning aziendale
- Tracciabilita` delle sorgenti visibile nello scanner
- Carbon footprint, benchmark e azioni ESG generati in tempo reale
- Pipeline AI organizzata come orchestrazione multi-agent
- `ORBITA` mostra azioni d'impatto e consente di generare il briefing giornaliero audio
- Report CSRD PDF generabile dal pannello compliance

## Cosa funziona oggi

### 1. Experience Mission Control

- Shell full-screen con pannelli `TERRA`, `SCANNER`, `ORBITA`, `COMPLIANCE`
- Feed ambientale laterale con refresh periodico
- Layout corretto per evitare lo scroll della pagina desktop
- Cursore custom rimosso, si usa il cursore nativo del browser

File principali:

- [MissionControlHome.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/MissionControlHome.tsx)
- [TopBar.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/TopBar.tsx)
- [StatusBar.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/StatusBar.tsx)
- [LiveFeed.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/LiveFeed.tsx)
- [globals.css](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/globals.css)

### 2. Inserimento e provenienza dati

Lo `SCANNER` supporta:

- dataset demo precaricato
- input manuale di settore, dipendenti, elettricita`
- upload drag and drop di `CSV`, `JSON`, `TXT`
- upload di `PDF` e `XLSX` come evidenza, senza parsing profondo

Il dataset demo di default contiene anche segnali operativi per le trasferte:

- numero trasferte annuali
- quota voli brevi convertibili su treno
- giorni medi di anticipo prenotazione
- copertura workflow approvativo
- quota meeting virtuali
- notti hotel annuali e corridoi rail prioritari

Ogni sorgente mostrata in UI espone:

- origine del dato
- orario ultimo aggiornamento
- campi aggiornati
- nota di ingestione

File principali:

- [PanelScanner.tsx](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/components/mission-control/panels/PanelScanner.tsx)
- [document-ingestion.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/document-ingestion.ts)
- [mock-company-full.json](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/data/mock-company-full.json)

### 3. Motore AI multi-agent

L'endpoint AI non e` piu` un singolo blocco monolitico. Ora usa una pipeline organizzata con 4 agenti:

- `planner`
- `benchmark`
- `compliance`
- `action`

Flusso:

1. si parte dal carbon model locale e dal contesto open data
2. si costruisce un context condiviso dell'azienda
3. il planner gira per primo
4. benchmark, compliance e action girano in parallelo
5. la route restituisce `orchestrationMode`, `source`, `agentTrace` e warning eventuali

Modalita` supportate:

- `multi-agent-llm` se Regolo risponde correttamente
- `multi-agent-fallback` se mancano chiavi o la chiamata LLM fallisce

Con il dataset demo attuale, `ORBITA` puo` far emergere anche una proposta specifica di travel planning:

- `travel-planning`
- titolo: `Riprogetta le trasferte con travel policy rail-first e booking anticipato`
- caso d'uso: riduzione voli brevi, booking anticipato, piu` riunioni virtuali e controllo delle notti hotel

File principali:

- [route.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/ai/insights/route.ts)
- [insights-orchestrator.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/ai/insights-orchestrator.ts)
- [insights-agents.ts](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/lib/ai/insights-agents.ts)

### 4. Open data, audio e report

- `GET /api/open-data/context`: recupera contesto territoriale, con fallback demo
- `POST /api/ai/insights`: produce score, carbon, azioni e trace agenti
- `POST /api/audio/briefing`: briefing audio demo o ElevenLabs
- `POST /api/reports/csrd`: genera PDF CSRD

Briefing audio:

- il trigger UI si trova nel pannello `ORBITA`
- se ElevenLabs e` disponibile, viene restituito audio reale in `data:audio/mpeg;base64,...`
- se `ELEVENLABS_VOICE_ID` non e` valido, la route prova a usare una voce disponibile dell'account
- se ElevenLabs non e` raggiungibile, resta disponibile il transcript demo

Directory API:

- [app/api/open-data](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/open-data)
- [app/api/ai](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/ai)
- [app/api/audio](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/audio)
- [app/api/reports](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/app/api/reports)

## Demo vs live

Al momento il prodotto e` volutamente demo-first.

- I dati aziendali partono da mock o da input utente
- Gli open data provano a essere live, ma hanno fallback demo
- L'AI e` predisposta per Regolo, ma ripiega su fallback multi-agent strutturato se l'LLM non e` raggiungibile
- L'audio usa ElevenLabs quando disponibile, con fallback demo se il provider non risponde
- La persistenza Supabase non e` attualmente esposta in UI

Questo significa che l'app resta sempre presentabile in hackathon anche senza servizi esterni disponibili.

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

Verifiche fatte sull'attuale stato del progetto:

- `npm run build`: passato
- `next start` locale: avvio verificato
- test route `POST /api/ai/insights`: passato
- smoke test completo `open-data -> insights -> audio -> report`: passato
- smoke test con dataset demo aggiornato su travel planning: passato

Risultato del test route nell'ambiente attuale:

- `agentCount: 4`
- `firstAgent: planner`
- `orchestrationMode: multi-agent-llm`
- `agentModes: llm,llm,llm,llm`
- `ORBITA` include la proposta `travel-planning` tra le prime 3 azioni del mock aggiornato
- stima travel planning del mock attuale: `9.95 tCO2eq` e `20.970 EUR/anno`

Nota:

- Regolo e` raggiungibile e risponde correttamente via `chat/completions`
- la route AI usa payload OpenAI-compatible con `model` configurabile
- `GET /api/open-data/context` ha restituito `source: live` durante lo smoke test
- `POST /api/audio/briefing` puo` generare audio reale via ElevenLabs
- il mock demo effettivo e` letto da [mock-company-full.json](/c:/Users/danie/Desktop/AiTest/eco_signal/HackNationEco/data/mock-company-full.json)

## Limiti attuali

- parsing automatico documenti limitato a `CSV`, `JSON`, `TXT`
- `PDF` e `XLSX` sono caricati come evidenza ma non estratti in profondita`
- Supabase non e` ancora collegato in modo operativo end-to-end al prodotto finale
- manca ancora una vista dedicata in UI per mostrare il dettaglio dell'`agentTrace`

## Prossimi step consigliati

- aggiungere parsing reale di bollette e PDF
- visualizzare in UI il trace dei 4 agenti
- collegare persistenza aziende, upload e report su Supabase
- aggiungere widget diagnostico dedicato al travel planning con KPI e leve di riduzione
- distinguere in modo ancora piu` esplicito i badge `LIVE`, `DEMO`, `DERIVATO`
- mantenere Regolo ed ElevenLabs pienamente operativi anche su ambienti non sandbox
