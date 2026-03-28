import { buildBriefing } from "@/lib/insights";
import type { ActionRecommendation, BriefingResponse, OpenDataContext } from "@/lib/types";
import { NextResponse } from "next/server";

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  high_quality_base_model_ids?: string[];
}

function withBriefingMeta(briefing: BriefingResponse): BriefingResponse {
  return {
    ...briefing,
    generatedAt: new Date().toISOString()
  };
}

async function fetchAvailableVoices(apiKey: string) {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": apiKey
    }
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as { voices?: ElevenLabsVoice[] };
  return payload.voices ?? [];
}

async function synthesizeBriefing(params: {
  transcript: string;
  apiKey: string;
  voiceId: string;
}) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${params.voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": params.apiKey
    },
    body: JSON.stringify({
      text: params.transcript,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.72
      }
    })
  });

  return response;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    companyName: string;
    summary: string[];
    actions: ActionRecommendation[];
    openData: OpenDataContext;
  };

  const fallback = withBriefingMeta(buildBriefing(body.companyName, body.summary, body.actions, body.openData));

  if (process.env.ELEVENLABS_API_KEY) {
    try {
      const configuredVoiceId = process.env.ELEVENLABS_VOICE_ID;
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (configuredVoiceId) {
        const configuredResponse = await synthesizeBriefing({
          transcript: fallback.transcript,
          apiKey,
          voiceId: configuredVoiceId
        });

        if (configuredResponse.ok) {
          const audioBuffer = await configuredResponse.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString("base64");

          return NextResponse.json({
            ...fallback,
            source: "elevenlabs",
            audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
            voiceId: configuredVoiceId
          });
        }

        const configuredError = await configuredResponse.text();
        const voices = await fetchAvailableVoices(apiKey);
        const fallbackVoice = voices.find((voice) => voice.voice_id !== configuredVoiceId) ?? voices[0];

        if (fallbackVoice) {
          const fallbackVoiceResponse = await synthesizeBriefing({
            transcript: fallback.transcript,
            apiKey,
            voiceId: fallbackVoice.voice_id
          });

          if (fallbackVoiceResponse.ok) {
            const audioBuffer = await fallbackVoiceResponse.arrayBuffer();
            const base64Audio = Buffer.from(audioBuffer).toString("base64");

            return NextResponse.json({
              ...fallback,
              source: "elevenlabs",
              audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
              voiceId: fallbackVoice.voice_id,
              voiceName: fallbackVoice.name,
              warning: `Voice ID configurato non valido. Usata la voce disponibile "${fallbackVoice.name}".`
            });
          }

          const fallbackVoiceError = await fallbackVoiceResponse.text();

          return NextResponse.json({
            ...fallback,
            warning: `Fallback demo: ElevenLabs ha rifiutato sia la voce configurata sia la voce "${fallbackVoice.name}". ${fallbackVoiceError.slice(0, 180)}`
          });
        }

        return NextResponse.json({
          ...fallback,
          warning: `Fallback demo: ElevenLabs ha risposto ${configuredResponse.status}. ${configuredError.slice(0, 180)}`
        });
      }

      const voices = await fetchAvailableVoices(apiKey);
      const fallbackVoice = voices[0];

      if (fallbackVoice) {
        const fallbackVoiceResponse = await synthesizeBriefing({
          transcript: fallback.transcript,
          apiKey,
          voiceId: fallbackVoice.voice_id
        });

        if (fallbackVoiceResponse.ok) {
          const audioBuffer = await fallbackVoiceResponse.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString("base64");

          return NextResponse.json({
            ...fallback,
            source: "elevenlabs",
            audioUrl: `data:audio/mpeg;base64,${base64Audio}`,
            voiceId: fallbackVoice.voice_id,
            voiceName: fallbackVoice.name,
            warning: `Nessun voice ID configurato. Usata la voce disponibile "${fallbackVoice.name}".`
          });
        }

        const fallbackVoiceError = await fallbackVoiceResponse.text();

        return NextResponse.json({
          ...fallback,
          warning: `Fallback demo: ElevenLabs ha rifiutato la voce "${fallbackVoice.name}". ${fallbackVoiceError.slice(0, 180)}`
        });
      }

      return NextResponse.json({
        ...fallback,
        warning: "Fallback demo: nessuna voce ElevenLabs disponibile sull'account."
      });
    } catch {
      return NextResponse.json({
        ...fallback,
        warning: "Fallback demo: ElevenLabs non raggiungibile."
      });
    }
  }

  return NextResponse.json(fallback);
}
