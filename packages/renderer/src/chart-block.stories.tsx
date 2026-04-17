import type { Meta, StoryObj } from "@storybook/react";
import { ChartBlock } from "./chart-block";

const meta: Meta<typeof ChartBlock> = {
  title: "ChartBlock",
  component: ChartBlock,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChartBlock>;

export const BarChart: Story = {
  args: {
    def: {
      type: "bar",
      title: "Monthly Revenue",
      data: [
        { label: "Jan", value: 50000 },
        { label: "Feb", value: 62000 },
        { label: "Mar", value: 71000 },
        { label: "Apr", value: 58000 },
        { label: "May", value: 84000 },
        { label: "Jun", value: 92000 },
      ],
    },
  },
};

export const LineChart: Story = {
  args: {
    def: {
      type: "line",
      title: "Expense Trend",
      data: [
        { label: "Jan", value: 35000 },
        { label: "Feb", value: 38000 },
        { label: "Mar", value: 32000 },
        { label: "Apr", value: 41000 },
        { label: "May", value: 39000 },
        { label: "Jun", value: 44000 },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    def: {
      type: "pie",
      title: "Revenue vs Expenses",
      data: [
        { label: "Net Profit", value: 140000 },
        { label: "Expenses", value: 310000 },
      ],
    },
  },
};

export const AreaChart: Story = {
  args: {
    def: {
      type: "area",
      title: "Cash Flow",
      data: [
        { label: "Jan", value: 120000 },
        { label: "Feb", value: 135000 },
        { label: "Mar", value: 142000 },
        { label: "Apr", value: 128000 },
        { label: "May", value: 155000 },
        { label: "Jun", value: 168000 },
      ],
    },
  },
};

export const StackedBarChart: Story = {
  args: {
    def: {
      type: "stacked-bar",
      title: "Revenue by Category",
      series: ["services", "products", "consulting"],
      data: [
        { label: "Jan", services: 30000, products: 15000, consulting: 5000 },
        { label: "Feb", services: 35000, products: 18000, consulting: 9000 },
        { label: "Mar", services: 40000, products: 22000, consulting: 9000 },
        { label: "Apr", services: 32000, products: 16000, consulting: 10000 },
      ],
    },
  },
};
