"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getSeverityColor } from "@/utils/helpers";
import type { SeverityLevel } from "@/types";

interface SeverityData {
  name: string;
  value: number;
  severity: SeverityLevel;
}

interface SeverityDistributionChartProps {
  data: SeverityData[];
}

export function SeverityDistributionChart({ data }: SeverityDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#12172A",
            border: "1px solid #1E2847",
            borderRadius: "8px",
            color: "#F1F5F9",
          }}
          labelStyle={{ color: "#F1F5F9" }}
          itemStyle={{ color: "#F1F5F9" }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
