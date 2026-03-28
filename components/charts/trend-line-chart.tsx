"use client";

import type { TrendPoint } from "@/lib/types";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TrendLineChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#7f91a2", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#7f91a2", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} tCO2eq`, "Valore"]}
            contentStyle={{
              backgroundColor: "#08111d",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 12,
              color: "#edf5f0"
            }}
          />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#00C896"
            strokeWidth={3}
            dot={{ r: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#8FB5A5"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
