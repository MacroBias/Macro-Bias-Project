"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { equityCurveData } from "@/lib/mock-data";

type EquityCurvePoint = {
  year: number;
  macroBias: number;
  sp500: number;
};

export function EquityCurveChart({ data }: { data?: EquityCurvePoint[] }) {
  const chartData = data && data.length > 0 ? data : equityCurveData;

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={{ stroke: "#475569" }}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={{ stroke: "#475569" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="macroBias"
            name="Macro Bias Index"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#22c55e" }}
          />
          <Line
            type="monotone"
            dataKey="sp500"
            name="S&P 500 Index"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
