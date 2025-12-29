"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface TypeBreakdownChartProps {
  data: { name: string; value: number; color?: string }[];
}

export function TypeBreakdownChart({ data }: TypeBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2847" />
        <XAxis dataKey="name" stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#12172A",
            border: "1px solid #1E2847",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
