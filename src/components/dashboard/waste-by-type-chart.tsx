"use client";

import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const data = [
  { name: "Organic", value: 400, color: "hsl(120, 60%, 40%)" },
  { name: "Plastic", value: 300, color: "hsl(210, 80%, 50%)" },
  { name: "Paper", value: 200, color: "hsl(30, 40%, 50%)" },
  { name: "E-Waste", value: 100, color: "hsl(220, 15%, 40%)" },
  { name: "Other", value: 150, color: "hsl(25, 90%, 55%)" },
];

const chartConfig = {
  value: {
    label: "Kilograms",
  },
  Organic: {
    label: "Organic",
    color: "hsl(120, 60%, 40%)",
  },
  Plastic: {
    label: "Plastic",
    color: "hsl(210, 80%, 50%)",
  },
  Paper: {
    label: "Paper",
    color: "hsl(30, 40%, 50%)",
  },
  "E-Waste": {
    label: "E-Waste",
    color: "hsl(220, 15%, 40%)",
  },
  Other: {
    label: "Other",
    color: "hsl(25, 90%, 55%)",
  },
} satisfies ChartConfig;


export function WasteByTypeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Type Breakdown</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Legend />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
