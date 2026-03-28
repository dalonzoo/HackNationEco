import { motion, useReducedMotion } from "framer-motion";

export function ParticleField() {
  const reduceMotion = useReducedMotion();
  const dots = Array.from({ length: 120 }, (_, index) => ({
    x: (index * 47) % 1000,
    y: (index * 83) % 700,
    r: index % 3 === 0 ? 1.2 : 0.8,
    color: index % 7 === 0 ? "rgba(240,160,48,0.28)" : index % 5 === 0 ? "rgba(74,158,255,0.28)" : "rgba(0,255,136,0.24)"
  }));

  return (
    <>
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] top-[14%] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.13),transparent_70%)] blur-3xl"
            animate={{ x: [0, 28, -12, 0], y: [0, 18, -10, 0], opacity: [0.3, 0.55, 0.34, 0.3] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute right-[10%] top-[10%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(74,158,255,0.12),transparent_70%)] blur-3xl"
            animate={{ x: [0, -24, 16, 0], y: [0, 12, -14, 0], opacity: [0.24, 0.48, 0.28, 0.24] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[8%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,160,48,0.08),transparent_72%)] blur-3xl"
            animate={{ scale: [0.92, 1.08, 0.98], opacity: [0.18, 0.3, 0.18] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
        preserveAspectRatio="none"
        viewBox="0 0 1000 700"
      >
        {dots.map((dot, index) => (
          <circle
            key={`${dot.x}-${dot.y}`}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            style={{
              fill: dot.color,
              opacity: reduceMotion ? 1 : 0.45 + ((index % 5) * 0.08)
            }}
          />
        ))}
      </svg>
    </>
  );
}
