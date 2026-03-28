"use client";

export function PanelPager({
  currentLabel,
  currentIndex,
  total,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: {
  currentLabel: string;
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) {
  return (
    <div className="border-t border-[rgba(0,255,136,0.08)] px-4 py-3 lg:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="mono-font text-[10px] uppercase tracking-[0.26em] text-muted">
          Vista {currentIndex}/{total} · {currentLabel}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="mono-font border border-[rgba(255,255,255,0.08)] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="mono-font border border-[rgba(0,255,136,0.22)] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
