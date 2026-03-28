"use client";

export function PanelTerra({
  nationalCounter,
  onPrimaryAction
}: {
  nationalCounter: number;
  onPrimaryAction: () => void;
}) {
  return (
    <div className="grid h-full gap-8 lg:grid-cols-[0.42fr_0.58fr]">
      <div className="flex h-full flex-col justify-between gap-8 p-6 lg:p-8">
        <div className="space-y-6">
          <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">
            ECOSIGNAL - ENTERPRISE - v2.5
          </div>
          <h1 className="display-font text-[clamp(3.8rem,9vw,7rem)] leading-[0.9] text-text">
            I TUOI DATI
            <br />
            AMBIENTALI.
            <br />
            FINALMENTE
            <br />
            AZIONABILI.
          </h1>
          <p className="max-w-xl text-base leading-8 text-muted">
            La piattaforma AI che trasforma le emissioni aziendali in decisioni, report CSRD e risparmio reale.
            Setup in 10 minuti. Compliance in 30 giorni.
          </p>
        </div>

        <button type="button" onClick={onPrimaryAction} className="custom-cta text-left text-sm text-text">
          <span className="custom-cta-arrow mono-font text-accent">-&gt;</span>
          INIZIA L&apos;ANALISI GRATUITA
        </button>
      </div>

      <div className="flex h-full flex-col justify-center border-l border-[rgba(0,255,136,0.08)] p-6 lg:p-8">
        <div className="mono-font text-xs uppercase tracking-[0.26em] text-muted">COUNTER NAZIONALE CO2</div>
        <div className="mono-font mt-6 text-[clamp(3rem,9vw,6rem)] leading-none text-accent">
          {nationalCounter.toLocaleString("it-IT")}
        </div>
        <div className="mono-font mt-4 text-sm uppercase tracking-[0.28em] text-muted">
          tCO2eq emesse in Italia - oggi
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="mission-section p-4">
            <div className="hud-label">SISTEMA</div>
            <div className="mono-font mt-2 text-2xl text-text">ATTIVO</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">ROI MEDIO</div>
            <div className="mono-font mt-2 text-2xl text-text">12 MESI</div>
          </div>
        </div>
      </div>
    </div>
  );
}
