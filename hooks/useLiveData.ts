"use client";

import type { OpenDataContext } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import type { FeedMetric } from "@/components/mission-control/LiveFeed";

function formatClock(date: Date) {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function useLiveData(openData: OpenDataContext | null) {
  const [seed, setSeed] = useState(0);
  const [counter, setCounter] = useState(128640);
  const [updatedAt, setUpdatedAt] = useState("--:--:--");

  useEffect(() => {
    setUpdatedAt(formatClock(new Date()));

    const tick = window.setInterval(() => {
      setCounter((value) => value + 4 + Math.round(Math.random() * 5));
    }, 900);

    const refresh = window.setInterval(() => {
      setSeed((value) => value + 1);
      setUpdatedAt(formatClock(new Date()));
    }, 30000);

    return () => {
      window.clearInterval(tick);
      window.clearInterval(refresh);
    };
  }, []);

  const feed = useMemo<FeedMetric[]>(() => {
    const air = openData?.airQualityIndex ?? 42;
    const temp = openData?.weeklyTemperatureDelta ?? 1.4;
    const climate = openData?.climateRiskLabel ?? "Stress idrico";

    return [
      {
        id: "pm25",
        label: `PM2.5 ${openData?.city?.toUpperCase() ?? "MILANO"}`,
        value: `${air + seed} ug/m3`,
        detail: `trend ${seed % 2 === 0 ? "+6%" : "+3%"}`,
        tone: air > 60 ? "red" : "amber",
        bar: Math.min(92, air + seed)
      },
      {
        id: "temp",
        label: "TEMP MEDIA IT",
        value: `+${(temp + seed * 0.04).toFixed(1)} C`,
        detail: "vs 1990-2020",
        tone: "blue",
        bar: 58
      },
      {
        id: "co2",
        label: "CO2 ATMOSFERA",
        value: `${(424.3 + seed * 0.2).toFixed(1)} ppm`,
        detail: "fascia Nord Italia",
        tone: "red",
        bar: 88
      },
      {
        id: "drought",
        label: "RISCHIO TERRITORIALE",
        value: climate.toUpperCase(),
        detail: "allerta monitorata",
        tone: "amber",
        bar: 71
      },
      {
        id: "renewable",
        label: "ENERGIA RINNOVAB.",
        value: `${38 + (seed % 5)}%`,
        detail: "mix Italia oggi",
        tone: "accent",
        bar: 43 + (seed % 5) * 4
      }
    ];
  }, [openData, seed]);

  return {
    feed,
    counter,
    updatedAt
  };
}
