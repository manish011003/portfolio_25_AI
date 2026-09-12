"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, type ChartBlock } from "@/lib/blocks";

export function CaseChart({ block }: { block: ChartBlock }) {
  const data = block.data.map((row) => ({ name: row.label, value: row.value }));
  if (!data.length) return null;

  const chartStyle = { width: "100%", aspectRatio: 1.7, maxHeight: 320 } as const;

  return (
    <figure className="my-8">
      {block.title ? (
        <figcaption className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {block.title}
        </figcaption>
      ) : null}
      {block.chartType === "line" ? (
        <LineChart responsive style={chartStyle} data={data}>
          <CartesianGrid stroke="#e4ddd0" vertical={false} />
          <XAxis dataKey="name" stroke="#111111" tick={{ fill: "#5c574e", fontSize: 12 }} label={axisLabel(block.xLabel, "insideBottom")} />
          <YAxis stroke="#111111" tick={{ fill: "#5c574e", fontSize: 12 }} label={axisLabel(block.yLabel, "insideLeft")} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ fill: CHART_COLORS[0] }} />
        </LineChart>
      ) : block.chartType === "pie" ? (
        <PieChart responsive style={{ width: "100%", aspectRatio: 1.2, maxHeight: 320 }}>
          <Tooltip />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%">
            {data.map((_, index) => (
              <Cell key={data[index].name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      ) : (
        <BarChart responsive style={chartStyle} data={data}>
          <CartesianGrid stroke="#e4ddd0" vertical={false} />
          <XAxis dataKey="name" stroke="#111111" tick={{ fill: "#5c574e", fontSize: 12 }} label={axisLabel(block.xLabel, "insideBottom")} />
          <YAxis stroke="#111111" tick={{ fill: "#5c574e", fontSize: 12 }} label={axisLabel(block.yLabel, "insideLeft")} />
          <Tooltip />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </figure>
  );
}

function axisLabel(value: string | undefined, position: "insideBottom" | "insideLeft") {
  if (!value) return undefined;
  return { value, position, fill: "#5c574e", fontSize: 11 };
}
