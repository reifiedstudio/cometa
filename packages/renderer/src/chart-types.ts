export type ChartType = "bar" | "line" | "pie" | "area" | "stacked-bar";

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface StackedChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface ChartDef {
  type: ChartType;
  title?: string;
  data: ChartDataPoint[] | StackedChartDataPoint[];
  /** Series keys for stacked-bar charts (excluding "label") */
  series?: string[];
}
