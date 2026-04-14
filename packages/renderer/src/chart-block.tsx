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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDef } from "./chart-types.js";

const COLORS = [
  "var(--color-chart-1, #e76f51)",
  "var(--color-chart-2, #2a9d8f)",
  "var(--color-chart-3, #264653)",
  "var(--color-chart-4, #e9c46a)",
  "var(--color-chart-5, #f4a261)",
];

export function ChartBlock({ def }: { def: ChartDef }) {
  const data = def.data.map((d) => ({ ...d, name: d.label }));

  return (
    <div className="my-6 rounded-lg border bg-card p-4">
      {def.title && (
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{def.title}</h4>
      )}
      <ResponsiveContainer width="100%" height={300}>
        {renderChart(def.type, data, def.series)}
      </ResponsiveContainer>
    </div>
  );
}

function renderChart(
  type: ChartDef["type"],
  data: Record<string, unknown>[],
  series?: string[],
): React.JSX.Element {
  switch (type) {
    case "bar":
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      );

    case "line":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      );

    case "area":
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS[0]}
            fill={COLORS[0]}
            fillOpacity={0.2}
          />
        </AreaChart>
      );

    case "pie":
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );

    case "stacked-bar": {
      const keys = series ?? Object.keys(data[0] ?? {}).filter((k) => k !== "name" && k !== "label");
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {keys.map((key, i) => (
            <Bar key={key} dataKey={key} stackId="a" fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      );
    }
  }
}
