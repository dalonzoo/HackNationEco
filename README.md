# EcoSignal Enterprise

Demo hackathon in italiano per PMI italiane che vogliono misurare impatto ambientale, ottenere insight ESG e generare un report CSRD.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Recharts per i grafici
- jsPDF per il report PDF
- Modalita` demo-first con fallback locali per AI, open data e audio briefing

## Avvio locale

1. Copia `.env.example` in `.env.local`
2. Installa le dipendenze con `cmd /c npm install`
3. Avvia con `cmd /c npm run dev`
4. Build di verifica con `cmd /c npm run build`

## Integrazioni opzionali

- Regolo.ai per insight AI reali
- ElevenLabs per audio briefing reale
- Supabase per persistenza dati

Se le chiavi non sono configurate, l'app funziona comunque in modalita` demo.
