"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock drawdown data
const drawdownData = [
  { year: 2009, macroBias: -8, sp500: -12 },
  { year: 2010, macroBias: -5, sp500: -7 },
  { year: 2011, macroBias: -12, sp500: -19 },
  { year: 2012, macroBias: -4, sp500: -6 },
  { year: 2013, macroBias: -3, sp500: -5 },
  { year: 2014, macroBias: -6, sp500: -8 },
  { year: 2015, macroBias: -10, sp500: -14 },
  { year: 2016, macroBias: -7, sp500: -10 },
  { year: 2017, macroBias: -2, sp500: -3 },
  { year: 2018, macroBias: -14, sp500: -20 },
  { year: 2019, macroBias: -5, sp500: -7 },
  { year: 2020, macroBias: -18, sp500: -34 },
  { year: 2021, macroBias: -4, sp500: -5 },
  { year: 2022, macroBias: -16, sp500: -25 },
  { year: 2023, macroBias: -6, sp500: -10 },
  { year: 2024, macroBias: -8, sp500: -12 },
  { year: 2025, macroBias: -4, sp500: -8 },
];

export function DrawdownChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={drawdownData}
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
            tickFormatter={(value) => `${value}%`}
            domain={[-40, 0]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(value: number) => [`${value}%`, ""]}
          />
          <Area
            type="monotone"
            dataKey="sp500"
            name="S&P 500"
            fill="#ef4444"
            fillOpacity={0.3}
            stroke="#ef4444"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="macroBias"
            name="Macro Bias"
            fill="#22c55e"
            fillOpacity={0.3}
            stroke="#22c55e"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
