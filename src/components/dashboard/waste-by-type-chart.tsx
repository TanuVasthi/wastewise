"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "Organic", value: 400, color: "hsl(var(--chart-1))" },
  { name: "Plastic", value: 300, color: "hsl(var(--chart-2))" },
  { name: "Paper", value: 200, color: "hsl(var(--chart-3))" },
  { name: "E-Waste", value: 100, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 150, color: "hsl(var(--chart-5))" },
];

export function WasteByTypeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Type Breakdown</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip content={<ChartTooltipContent />} />
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
