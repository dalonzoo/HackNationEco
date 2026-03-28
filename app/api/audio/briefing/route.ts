import { buildBriefing } from "@/lib/insights";
import type { ActionRecommendation, OpenDataContext } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    companyName: string;
    summary: string[];
    actions: ActionRecommendation[];
    openData: OpenDataContext;
  };

  const fallback = buildBriefing(body.companyName, body.summary, body.actions, body.openData);

  if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text: fallback.transcript,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.45,
              similarity_boost: 0.72
            }
          })
        }
      );

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");

        return NextResponse.json({
          ...fallback,
          source: "elevenlabs",
          audioUrl: `data:audio/mpeg;base64,${base64Audio}`
        });
      }
    } catch {
      return NextResponse.json({
        ...fallback,
        warning: "Fallback demo: ElevenLabs non raggiungibile."
      });
    }
  }

  return NextResponse.json(fallback);
}
