"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function LoadingScreen({ visible }: { visible: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#030504]"
          exit={{ opacity: 0, y: reduceMotion ? 0 : 40, transition: { duration: 0.28 } }}
        >
          <div className="display-font text-[clamp(3rem,10vw,7rem)] uppercase tracking-[0.18em] text-accent">
            ECOSIGNAL
          </div>
          <div className="mono-font mt-4 text-xs uppercase tracking-[0.42em] text-muted">
            INIZIALIZZAZIONE SISTEMA...
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
