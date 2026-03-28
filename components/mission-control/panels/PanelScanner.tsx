"use client";
import { ChoiceChips } from "@/components/ui/ecosignal-kit";
import type { DataSourceEntry, OnboardingData } from "@/lib/types";
import { useRef, useState } from "react";

export function PanelScanner({
  mode,
  isFlowLaunching,
  sector,
  employeeValue,
  electricityKwh,
  carbonTotal,
  scopeValues,
  percentileLabel,
  ingestionNotice,
  sources,
  sectors,
  onSectorChange,
  onEmployeeChange,
  onElectricityChange,
  onLoadDemo,
  onFilesAdded,
  onStartFlow
}: {
  mode: "intake" | "workspace";
  isFlowLaunching: boolean;
  sector: string;
  employeeValue: number;
  electricityKwh: number;
  carbonTotal: number;
  scopeValues: { label: string; value: number; width: number }[];
  percentileLabel: string;
  ingestionNotice: string;
  sources: DataSourceEntry[];
  sectors: readonly string[];
  onSectorChange: (value: OnboardingData["sector"]) => void;
  onEmployeeChange: (value: number) => void;
  onElectricityChange: (value: number) => void;
  onLoadDemo: () => void;
  onFilesAdded: (files: File[]) => Promise<void>;
  onStartFlow: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showManualInputs, setShowManualInputs] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const isIntake = mode === "intake";

  async function handleDrop(files: FileList | null) {
    if (!files?.length) return;
    const nextFiles = Array.from(files);
    setUploadedFiles(nextFiles.map((file) => file.name));
    await onFilesAdded(nextFiles);
  }

  if (isIntake) {
    return (
      <div className="flex min-h-full items-center justify-center p-4 lg:p-6">
        <div className="w-full max-w-[920px] space-y-5 lg:space-y-6">
          <div className="space-y-4 text-center">
            <h2 className="display-font text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[0.94] text-text">
              INSERISCI I DATI.
              <br />
              AL RESTO PENSA IL SISTEMA.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-6 text-muted lg:text-base lg:leading-7">
              Carica un dataset della tua azienda.
            </p>
          </div>

          <div
            data-interactive="true"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={async (event) => {
              event.preventDefault();
              setIsDragActive(false);
              await handleDrop(event.dataTransfer.files);
            }}
            className={`border p-5 lg:p-6 transition ${
              isDragActive
                ? "border-accent bg-[rgba(0,255,136,0.08)]"
                : "border-[rgba(0,255,136,0.12)] bg-[rgba(255,255,255,0.02)]"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mono-font text-xs uppercase tracking-[0.22em] text-accent">Input missione</div>
                <div className="mt-3 text-sm leading-6 text-muted">
                  Trascina `CSV`, `JSON`, `TXT`, `PDF` o `XLSX` oppure usa il dataset demo per vedere subito il flusso completo.
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mono-font border border-[rgba(74,158,255,0.28)] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-[var(--blue-data)]"
                  >
                    Carica file
                  </button>
                  <button
                    type="button"
                    onClick={onLoadDemo}
                    className="mono-font border border-[rgba(240,160,48,0.28)] px-4 py-3 text-[10px] uppercase tracking-[0.24em] text-[var(--amber)]"
                  >
                    Usa dataset demo
                  </button>
                </div>

                {uploadedFiles.length ? (
                  <div className="mt-5 border border-[rgba(0,255,136,0.14)] bg-[rgba(0,255,136,0.04)] p-4">
                    <div className="mono-font text-[10px] uppercase tracking-[0.22em] text-accent">File collegato</div>
                    <div className="mt-2 space-y-1">
                      {uploadedFiles.map((fileName) => (
                        <div key={fileName} className="mono-font text-xs uppercase tracking-[0.18em] text-text">
                          {fileName}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col gap-3 lg:w-[220px]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mono-font border border-[rgba(255,255,255,0.08)] px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-text"
                >
                  Cambia file
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInputs((current) => !current)}
                  className="mono-font border border-[rgba(255,255,255,0.08)] px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-text"
                >
                  {showManualInputs ? "Nascondi campi" : "Compila manualmente"}
                </button>
              </div>
            </div>

            {showManualInputs ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="space-y-3">
                  <div className="hud-label">SETTORE</div>
                  <ChoiceChips options={sectors} value={sector} onChange={onSectorChange} />
                </div>

                <label className="block space-y-3">
                  <span className="hud-label">DIPENDENTI</span>
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={employeeValue}
                    onChange={(event) => onEmployeeChange(Number(event.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="mono-font text-sm text-text">{employeeValue} risorse presidiate</div>
                </label>

                <label className="block space-y-3">
                  <span className="hud-label">ELETTRICITA' ANNUA</span>
                  <input
                    type="number"
                    min="0"
                    value={electricityKwh}
                    onChange={(event) => onElectricityChange(Number(event.target.value))}
                    className="mono-font w-full border border-[rgba(0,255,136,0.16)] bg-transparent px-4 py-3 text-sm text-text outline-none"
                  />
                  <div className="mono-font text-sm text-muted">{carbonTotal.toFixed(0)} tCO2eq baseline</div>
                </label>
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.json,.txt,.pdf,.xlsx"
              onChange={async (event) => await handleDrop(event.target.files)}
              className="hidden"
            />
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-[rgba(0,255,136,0.08)] pt-5 text-center">
            <button
              type="button"
              onClick={onStartFlow}
              disabled={isFlowLaunching}
              className="mission-launch-button mono-font text-sm uppercase tracking-[0.22em] text-text disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="mission-launch-arrow">-&gt;</span>
              <span className="mission-launch-label">
                {isFlowLaunching ? "MISSIONE IN AVVIO" : "AVVIA FLUSSO MULTI-AGENTE"}
              </span>
            </button>
            <div className="max-w-xl text-sm leading-6 text-muted">{ingestionNotice}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[0.46fr_0.54fr]">
      <div className="scrollbar-hidden min-h-0 overflow-y-auto p-6 lg:p-8">
        <div>
          <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">SCANNER LIVE</div>
          <h2 className="display-font mt-3 text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-text">
            DATI IN CHIARO.
            <br />
            CALCOLO TRACCIABILE.
          </h2>
        </div>

        <div className="mt-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-[var(--amber)]">TRACCIABILITA' ATTIVA</div>
          <div className="mt-3 text-sm leading-7 text-muted">{ingestionNotice}</div>
          <div className="mt-4 space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)] p-3">
                <div className="mono-font flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-text">
                  <span>{source.label}</span>
                  <span className="text-muted">{source.updatedAt}</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{source.origin}</div>
                <div className="mt-2 text-sm leading-6 text-muted">{source.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="scrollbar-hidden min-h-0 overflow-y-auto border-l border-[rgba(0,255,136,0.08)] p-6 lg:p-8">
        <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">OUTPUT LIVE</div>
        <div className="mono-font mt-6 text-[clamp(3rem,8vw,5.5rem)] leading-none text-accent">
          {carbonTotal.toFixed(0)} t
        </div>
        <div className="mono-font mt-2 text-xs uppercase tracking-[0.28em] text-muted">CO2 / anno</div>

        <div className="mt-8 space-y-5">
          {scopeValues.map((scope) => (
            <div key={scope.label} className="space-y-2">
              <div className="mono-font flex items-center justify-between text-xs uppercase tracking-[0.26em] text-muted">
                <span>{scope.label}</span>
                <span className="text-text">{scope.value.toFixed(0)} t</span>
              </div>
              <div className="h-3 bg-[rgba(255,255,255,0.04)]">
                <div className="h-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${scope.width}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">{percentileLabel}</div>
          <div className="mt-4 text-sm leading-7 text-muted">
            Questa baseline e' stata consolidata dal motore multi-agent e resta disponibile come base per le viste successive.
          </div>
        </div>
      </div>
    </div>
  );
}
