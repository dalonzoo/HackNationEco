"use client";

import type { EmissionCategory } from "@/lib/types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function EmissionDonutChart({
  data,
  total
}: {
  data: EmissionCategory[];
  total: number;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={68}
            outerRadius={94}
            stroke="none"
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} tCO2eq`, "Emissioni"]}
            contentStyle={{
              backgroundColor: "#08111d",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 12,
              color: "#edf5f0"
            }}
          />
          <text x="50%" y="46%" textAnchor="middle" fill="#98a7b5" fontSize={12}>
            Totale annuo
          </text>
          <text x="50%" y="55%" textAnchor="middle" fill="#edf5f0" fontSize={24} fontWeight={700}>
            {total.toFixed(1)}
          </text>
          <text x="50%" y="64%" textAnchor="middle" fill="#98a7b5" fontSize={12}>
            tCO2eq
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
