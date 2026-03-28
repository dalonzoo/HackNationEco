"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BenchmarkBarChart({
  total,
  benchmark
}: {
  total: number;
  benchmark: number;
}) {
  const data = [
    {
      name: "Azienda",
      value: Number(total.toFixed(1))
    },
    {
      name: "Benchmark",
      value: Number(benchmark.toFixed(1))
    }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fill: "#7f91a2", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7f91a2", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} tCO2eq`, "Emissioni"]}
            cursor={{ fill: "rgba(148,163,184,0.06)" }}
            contentStyle={{
              backgroundColor: "#08111d",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 12,
              color: "#edf5f0"
            }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#00C896" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
