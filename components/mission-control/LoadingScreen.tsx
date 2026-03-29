"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function LoadingScreen({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#030504]"
          exit={{ opacity: 0, y: reduceMotion ? 0 : 40, transition: { duration: 0.28 } }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-[46vw] w-[46vw] max-h-[540px] max-w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,255,136,0.08)]"
            animate={reduceMotion ? undefined : { scale: [0.92, 1.04, 0.96], opacity: [0.32, 0.6, 0.34] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[68vw] w-[68vw] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(74,158,255,0.08)]"
            animate={reduceMotion ? undefined : { rotate: [0, 360], opacity: [0.15, 0.24, 0.15] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.12),transparent_34%),radial-gradient(circle_at_50%_62%,rgba(74,158,255,0.08),transparent_26%)]" />

          <div className="display-font text-[clamp(3rem,10vw,7rem)] uppercase tracking-[0.18em] text-accent">
            ECOSYNCHRO
          </div>
          <div className="mono-font mt-4 text-xs uppercase tracking-[0.42em] text-muted">
            INIZIALIZZAZIONE SISTEMA...
          </div>
          <div className="mono-font mt-3 text-[10px] uppercase tracking-[0.32em] text-[rgba(232,242,235,0.48)]">
            ingestione dati · allineamento segnali · aggancio agenti
          </div>
          <div className="mt-8 h-px w-[min(420px,72vw)] overflow-hidden bg-[rgba(0,255,136,0.1)]">
            <motion.div
              className="loading-progress h-full bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduceMotion ? 0.2 : 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
