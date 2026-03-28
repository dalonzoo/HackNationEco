export function ParticleField() {
  const dots = Array.from({ length: 120 }, (_, index) => ({
    x: (index * 47) % 1000,
    y: (index * 83) % 700,
    r: index % 3 === 0 ? 1.2 : 0.8,
    color: index % 7 === 0 ? "rgba(240,160,48,0.28)" : index % 5 === 0 ? "rgba(74,158,255,0.28)" : "rgba(0,255,136,0.24)"
  }));

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      preserveAspectRatio="none"
      viewBox="0 0 1000 700"
    >
      {dots.map((dot) => (
        <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} style={{ fill: dot.color }} />
      ))}
    </svg>
  );
}
