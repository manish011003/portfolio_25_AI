"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHART_COLORS,
  chartSeriesNames,
  formatChartValue,
  isPolarChart,
  type ChartBlock,
} from "@/lib/blocks";

type PlotRow = {
  name: string;
  displays: string[];
  [key: string]: string | number | string[];
};

function seriesKeys(count: number) {
  return Array.from({ length: count }, (_, index) => `s${index}`);
}

function plotRows(block: ChartBlock, keys: string[]): PlotRow[] {
  return block.data
    .filter((row) => row.label.trim())
    .map((row) => {
      const displays = [row.display ?? "", ...(row.displays ?? [])];
      const values = [row.value, ...(row.values ?? [])];
      const point: PlotRow = { name: row.label, displays };
      keys.forEach((key, index) => {
        point[key] = Number.isFinite(values[index]) ? values[index] : 0;
      });
      return point;
    });
}

function tickStyle() {
  return { fill: "#5c574e", fontSize: 12 };
}

function axisLabel(value: string | undefined, position: "insideBottom" | "insideLeft") {
  if (!value) return undefined;
  return { value, position, fill: "#5c574e", fontSize: 11 };
}

function ChartTooltip({
  unit,
  names,
  active,
  payload,
  label,
}: {
  unit?: string;
  names: string[];
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; payload?: PlotRow; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const heading = label || String(payload[0]?.payload?.name ?? "");
  return (
    <div className="border-2 border-[#111] bg-[#fff8ee] px-3 py-2 text-sm text-[#111]">
      <p className="font-medium">{heading}</p>
      {payload.map((item) => {
        const key = String(item.dataKey ?? "");
        const index = Math.max(0, keysIndex(key));
        const display = item.payload?.displays?.[index];
        const name = names[index] ?? key;
        return (
          <p key={key}>
            {names.length > 1 ? `${name}: ` : ""}
            {formatChartValue(Number(item.value), unit, display)}
          </p>
        );
      })}
    </div>
  );
}

function keysIndex(key: string) {
  const match = /^s(\d+)$/.exec(key);
  return match ? Number(match[1]) : 0;
}

export function CaseChart({ block, compact = false }: { block: ChartBlock; compact?: boolean }) {
  const polar = isPolarChart(block.chartType);
  const names = polar ? ["Value"] : chartSeriesNames(block);
  const keys = seriesKeys(names.length);
  const data = plotRows(block, keys);
  if (!data.length) return null;

  const chartStyle = { width: "100%", aspectRatio: 1.7, maxHeight: 320 } as const;
  const unit = block.unit;
  const showLegend = names.length > 1 && !polar;
  const formatTick = (value: number) => formatChartValue(value, unit);

  return (
    <figure className={compact ? "my-2" : "my-8"}>
      {block.title ? (
        <figcaption className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {block.title}
        </figcaption>
      ) : null}
      {block.chartType === "line" ? (
        <LineChart responsive style={chartStyle} data={data}>
          <CartesianGrid stroke="#e4ddd0" vertical={false} />
          <XAxis dataKey="name" stroke="#111111" tick={tickStyle()} label={axisLabel(block.xLabel, "insideBottom")} />
          <YAxis stroke="#111111" tick={tickStyle()} tickFormatter={formatTick} label={axisLabel(block.yLabel, "insideLeft")} />
          <Tooltip content={<ChartTooltip unit={unit} names={names} />} />
          {showLegend ? <Legend /> : null}
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={names[index]}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLORS[index % CHART_COLORS.length] }}
            />
          ))}
        </LineChart>
      ) : block.chartType === "area" ? (
        <AreaChart responsive style={chartStyle} data={data}>
          <CartesianGrid stroke="#e4ddd0" vertical={false} />
          <XAxis dataKey="name" stroke="#111111" tick={tickStyle()} label={axisLabel(block.xLabel, "insideBottom")} />
          <YAxis stroke="#111111" tick={tickStyle()} tickFormatter={formatTick} label={axisLabel(block.yLabel, "insideLeft")} />
          <Tooltip content={<ChartTooltip unit={unit} names={names} />} />
          {showLegend ? <Legend /> : null}
          {keys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={names[index]}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              fillOpacity={0.28}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      ) : polar ? (
        <PieChart responsive style={{ width: "100%", aspectRatio: 1.2, maxHeight: 320 }}>
          <Tooltip content={<ChartTooltip unit={unit} names={names} />} />
          <Pie
            data={data}
            dataKey={keys[0]}
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={block.chartType === "donut" ? "45%" : 0}
            outerRadius="70%"
          >
            {data.map((row, index) => (
              <Cell key={row.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      ) : (
        <BarChart responsive style={chartStyle} data={data}>
          <CartesianGrid stroke="#e4ddd0" vertical={false} />
          <XAxis dataKey="name" stroke="#111111" tick={tickStyle()} label={axisLabel(block.xLabel, "insideBottom")} />
          <YAxis stroke="#111111" tick={tickStyle()} tickFormatter={formatTick} label={axisLabel(block.yLabel, "insideLeft")} />
          <Tooltip content={<ChartTooltip unit={unit} names={names} />} />
          {showLegend ? <Legend /> : null}
          {keys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              name={names[index]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      )}
    </figure>
  );
}
