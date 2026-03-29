import { defaultOnboardingData } from "@/lib/mock-data";
import type { DataSourceEntry, OnboardingData } from "@/lib/types";

type ParsedDocument = {
  applyMode: "merge" | "replace";
  data?: OnboardingData;
  patch: Partial<OnboardingData>;
  source: DataSourceEntry;
  notice: string;
};

const allowedTopLevelKeys: Array<keyof OnboardingData> = [
  "companyName",
  "sector",
  "atecoCode",
  "city",
  "employeesRange",
  "revenueRange",
  "budgetRange",
  "facilities",
  "electricityKwh",
  "gasM3",
  "waterM3",
  "dieselKm",
  "petrolKm",
  "electricKm",
  "flightsKm",
  "trainKm",
  "localSuppliersPct",
  "wasteKg",
  "recyclingPct"
];

function nowLabel() {
  return new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function toNumber(input: unknown): number | null {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  if (typeof input === "string") {
    const normalized = input.replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]/g, "");
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normalizePatch(candidate: Record<string, unknown>): Partial<OnboardingData> {
  const patch: Partial<OnboardingData> = {};

  for (const key of allowedTopLevelKeys) {
    if (!(key in candidate)) continue;
    const value = candidate[key];

    if (
      key === "companyName" ||
      key === "sector" ||
      key === "atecoCode" ||
      key === "city" ||
      key === "employeesRange" ||
      key === "revenueRange" ||
      key === "budgetRange"
    ) {
      if (typeof value === "string" && value.trim()) {
        patch[key] = value.trim() as never;
      }
      continue;
    }

    const numeric = toNumber(value);
    if (numeric !== null) {
      patch[key] = numeric as never;
    }
  }

  return patch;
}

function parseCsv(text: string): Partial<OnboardingData> {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (rows.length < 2) return {};

  const headers = rows[0].split(",").map((part) => part.trim());
  const values = rows[1].split(",").map((part) => part.trim());
  const raw: Record<string, unknown> = {};

  headers.forEach((header, index) => {
    raw[header] = values[index] ?? "";
  });

  return normalizePatch(raw);
}

function parseKeyValueText(text: string): Partial<OnboardingData> {
  const raw: Record<string, unknown> = {};
  text.split(/\r?\n/).forEach((line) => {
    const [left, ...rest] = line.split(":");
    if (!left || rest.length === 0) return;
    raw[left.trim()] = rest.join(":").trim();
  });
  return normalizePatch(raw);
}

export async function parseDataDocument(file: File): Promise<ParsedDocument> {
  const lowerName = file.name.toLowerCase();
  const updatedAt = nowLabel();

  if (lowerName.endsWith(".json")) {
    const text = await file.text();
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === "object") {
      const asRecord = parsed as Record<string, unknown>;
      const patch = normalizePatch(asRecord);

      const isFullPayload = Boolean(asRecord.companyName && asRecord.sector && asRecord.electricityKwh);

      return {
        applyMode: isFullPayload ? "replace" : "merge",
        data: isFullPayload
          ? ({
              ...defaultOnboardingData,
              ...patch,
              travelPlanning:
                asRecord.travelPlanning && typeof asRecord.travelPlanning === "object"
                  ? { ...defaultOnboardingData.travelPlanning, ...(asRecord.travelPlanning as Record<string, unknown>) }
                  : defaultOnboardingData.travelPlanning
            } as OnboardingData)
          : undefined,
        patch,
        source: {
          id: `doc-${file.name}-${Date.now()}`,
          label: "DOCUMENTO JSON",
          kind: "document",
          origin: "Upload utente",
          updatedAt,
          fields: Object.keys(patch),
          note: `Import JSON completato da ${file.name}`
        },
        notice: `Importato ${file.name}: ${Object.keys(patch).length || "0"} campi rilevati.`
      };
    }
  }

  if (lowerName.endsWith(".csv")) {
    const text = await file.text();
    const patch = parseCsv(text);
    return {
      applyMode: "merge",
      patch,
      source: {
        id: `doc-${file.name}-${Date.now()}`,
        label: "DOCUMENTO CSV",
        kind: "document",
        origin: "Upload utente",
        updatedAt,
        fields: Object.keys(patch),
        note: `CSV ingestito da ${file.name}`
      },
      notice: `CSV ${file.name} ingestito con ${Object.keys(patch).length || "0"} campi utili.`
    };
  }

  if (lowerName.endsWith(".txt")) {
    const text = await file.text();
    const patch = parseKeyValueText(text);
    return {
      applyMode: "merge",
      patch,
      source: {
        id: `doc-${file.name}-${Date.now()}`,
        label: "DOCUMENTO TXT",
        kind: "document",
        origin: "Upload utente",
        updatedAt,
        fields: Object.keys(patch),
        note: `TXT analizzato da ${file.name}`
      },
      notice: `TXT ${file.name}: parsing key:value completato.`
    };
  }

  return {
    applyMode: "merge",
    patch: {},
    source: {
      id: `doc-${file.name}-${Date.now()}`,
      label: "DOCUMENTO",
      kind: "document",
      origin: "Upload utente",
      updatedAt,
      fields: [],
      note: `${file.name} registrato come evidenza documentale.`
    },
    notice: `${file.name} registrato. Parsing dettagliato non disponibile per questo formato.`
  };
}
