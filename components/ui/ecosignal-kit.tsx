"use client";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.32em] text-accent">{eyebrow}</p>
      <h2 className="display-font text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
    </div>
  );
}

export function ChoiceChips<T extends string>({
  options,
  value,
  onChange
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-4 py-2 text-sm ${
            value === option
              ? "border-accent bg-[rgba(0,200,150,0.16)] text-white"
              : "border-white/10 bg-white/5 text-muted"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[rgba(6,10,18,0.88)] px-4 py-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

export function NumericField({
  label,
  value,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[rgba(6,10,18,0.88)] px-4 py-3 pr-16 text-sm text-white outline-none focus:border-accent"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.18em] text-muted">
          {suffix}
        </span>
      </div>
    </label>
  );
}

export function SmallMetric({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[rgba(8,13,22,0.82)] p-5">
      <p className="text-xs uppercase tracking-[0.26em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{hint}</p>
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="panel-soft rounded-3xl p-5">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton mt-4 h-6 w-3/4 rounded-full" />
          <div className="skeleton mt-3 h-20 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}
