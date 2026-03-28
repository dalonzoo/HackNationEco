import { runInsightsOrchestration } from "@/lib/ai/insights-orchestrator";
import type { OnboardingData, OpenDataContext } from "@/lib/types";
import { NextResponse } from "next/server";

const regoloModel = process.env.REGOLO_MODEL ?? "gpt-oss-20b";

const systemPrompt = `
Sei EcoSignal, un consulente ESG AI specializzato per PMI italiane.
Parli in italiano con tono professionale ma accessibile.
Ogni suggerimento include impatto CO2, risparmio economico, difficolta', payback e incentivi applicabili.
Usi sempre i dati dell'azienda e li confronti con il benchmark di settore.
`.trim();

export async function POST(request: Request) {
  const body = (await request.json()) as {
    data: OnboardingData;
    openData: OpenDataContext;
  };

  const llmRunner =
    process.env.REGOLO_API_KEY && process.env.REGOLO_API_URL
      ? async ({
          agent,
          instruction,
          context
        }: {
          agent: string;
          instruction: string;
          context: Record<string, unknown>;
        }) => {
          const response = await fetch(`${process.env.REGOLO_API_URL}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REGOLO_API_KEY}`
            },
            body: JSON.stringify({
              model: regoloModel,
              messages: [
                {
                  role: "system",
                  content: `${systemPrompt}\nAgente attivo: ${agent}.`
                },
                {
                  role: "user",
                  content: JSON.stringify(
                    {
                      instruction,
                      context
                    },
                    null,
                    2
                  )
                }
              ],
              temperature: 0.3
            })
          });

          if (!response.ok) {
            throw new Error(`Regolo agent ${agent} unavailable`);
          }

          const payload = (await response.json()) as {
            output?: string;
            text?: string;
            content?: string;
            choices?: Array<{
              message?: {
                content?: string;
              };
            }>;
          };

          return (
            payload.output ??
            payload.text ??
            payload.content ??
            payload.choices?.[0]?.message?.content ??
            JSON.stringify(payload)
          );
        }
      : undefined;

  try {
    const result = await runInsightsOrchestration({
      data: body.data,
      openData: body.openData,
      runner: llmRunner
    });

    return NextResponse.json({
      ...result,
      systemPrompt
    });
  } catch {
    const fallback = await runInsightsOrchestration({
      data: body.data,
      openData: body.openData
    });

    return NextResponse.json({
      ...fallback,
      systemPrompt
    });
  }
}
