import { generateActionPlan } from "@/lib/insights";
import type { OnboardingData, OpenDataContext } from "@/lib/types";
import { NextResponse } from "next/server";

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

  const demoPayload = generateActionPlan(body.data, body.openData);

  if (process.env.REGOLO_API_KEY && process.env.REGOLO_API_URL) {
    try {
      const response = await fetch(`${process.env.REGOLO_API_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REGOLO_API_KEY}`
        },
        body: JSON.stringify({
          system: systemPrompt,
          input: {
            company: body.data.companyName,
            sector: body.data.sector,
            employees: body.data.employeesRange,
            totalEmissions: demoPayload.carbon.total,
            benchmark: demoPayload.carbon.benchmarkTotal,
            topEmissionSource: demoPayload.topSource.label,
            budgetRange: body.data.budgetRange
          }
        })
      });

      if (response.ok) {
        const externalPayload = await response.json();
        return NextResponse.json({
          ...demoPayload,
          source: "regolo",
          externalPayload
        });
      }
    } catch {
      return NextResponse.json({
        ...demoPayload,
        source: "demo",
        warning: "Fallback locale attivato: Regolo non raggiungibile."
      });
    }
  }

  return NextResponse.json({
    ...demoPayload,
    source: "demo",
    systemPrompt
  });
}
