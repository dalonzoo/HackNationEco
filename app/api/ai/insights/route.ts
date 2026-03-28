import { runInsightsOrchestration } from "@/lib/ai/insights-orchestrator";
import type { OnboardingData, OpenDataContext } from "@/lib/types";
import { NextResponse } from "next/server";

const regoloModel = process.env.REGOLO_MODEL ?? "gpt-oss-20b";
const geminiModel = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const geminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/openai";

const systemPrompt = `
Sei EcoSignal, un consulente ESG AI specializzato per PMI italiane.
Parli in italiano con tono professionale ma accessibile.
Ogni suggerimento include impatto CO2, risparmio economico, difficolta', payback e incentivi applicabili.
Usi sempre i dati dell'azienda e li confronti con il benchmark di settore.
`.trim();

type ProviderConfig = {
  id: "gemini" | "regolo";
  label: string;
  apiKey: string;
  apiUrl: string;
  model: string;
};

function getAvailableProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  if (process.env.GEMINI_API_KEY) {
    providers.push({
      id: "gemini" as const,
      label: "Gemini",
      apiKey: process.env.GEMINI_API_KEY,
      apiUrl: geminiBaseUrl,
      model: geminiModel
    });
  }

  if (process.env.REGOLO_API_KEY && process.env.REGOLO_API_URL) {
    providers.push({
      id: "regolo" as const,
      label: "Regolo",
      apiKey: process.env.REGOLO_API_KEY,
      apiUrl: process.env.REGOLO_API_URL,
      model: regoloModel
    });
  }

  return providers;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    data: OnboardingData;
    openData: OpenDataContext;
  };

  const providers = getAvailableProviders();
  const providerFailures: string[] = [];

  for (const provider of providers) {
    const llmRunner = async ({
      agent,
      instruction,
      context
    }: {
      agent: string;
      instruction: string;
      context: Record<string, unknown>;
    }) => {
      const response = await fetch(`${provider.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model: provider.model,
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
        throw new Error(`${provider.label} agent ${agent} unavailable`);
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
    };

    try {
      const result = await runInsightsOrchestration({
        data: body.data,
        openData: body.openData,
        runner: llmRunner
      });

      if (result.orchestrationMode === "multi-agent-llm") {
        return NextResponse.json({
          ...result,
          source: `${provider.id}-multi-agent`,
          warning:
            providerFailures.length > 0
              ? `Provider attivo: ${provider.label}. Fallback provider usato dopo errore su ${providerFailures.join(", ")}.`
              : undefined,
          systemPrompt
        });
      }

      providerFailures.push(provider.label);
    } catch {
      providerFailures.push(provider.label);
    }
  }

  const fallback = await runInsightsOrchestration({
    data: body.data,
    openData: body.openData
  });

  return NextResponse.json({
    ...fallback,
    source: "fallback-multi-agent",
    warning:
      providerFailures.length > 0
        ? `Fallback locale multi-agent attivato: provider non riusciti ${providerFailures.join(", ")}.`
        : "Fallback locale multi-agent attivato: nessun provider LLM configurato.",
    systemPrompt
  });
}
