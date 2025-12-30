"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

interface TimeSeriesChartProps {
  data: { date: string; count: number; critical?: number; high?: number; medium?: number; low?: number }[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM dd"),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2847" />
        <XAxis dataKey="date" stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
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
        <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} />
        <Line type="monotone" dataKey="critical" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626" }} />
        <Line type="monotone" dataKey="high" stroke="#F97316" strokeWidth={2} dot={{ fill: "#F97316" }} />
        <Line type="monotone" dataKey="medium" stroke="#FBBF24" strokeWidth={2} dot={{ fill: "#FBBF24" }} />
        <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
