"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { WasteRecord } from "@/lib/data";

const chartConfig = {
  value: {
    label: "Kilograms",
  },
  Organic: { label: "Organic", color: "hsl(var(--chart-1))" },
  Plastic: { label: "Plastic", color: "hsl(var(--chart-2))" },
  Paper: { label: "Paper", color: "hsl(var(--chart-3))" },
  "E-Waste": { label: "E-Waste", color: "hsl(var(--chart-4))" },
  Glass: { label: "Glass", color: "hsl(var(--chart-5))" },
  Metal: { label: "Metal", color: "hsl(var(--chart-6))" },
} satisfies ChartConfig;


interface WasteByTypeChartProps {
    records: WasteRecord[];
}

export function WasteByTypeChart({ records }: WasteByTypeChartProps) {
  const data = useMemo(() => {
    if (!records || records.length === 0) return [];

    const aggregation = records.reduce((acc, record) => {
        const type = record.wasteType as keyof typeof chartConfig;
        acc[type] = (acc[type] || 0) + record.quantity;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(aggregation).map(([name, value]) => ({
        name,
        value,
        fill: chartConfig[name as keyof typeof chartConfig]?.color
    }));
  }, [records]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Type Breakdown</CardTitle>
        <CardDescription>Based on all collected data</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available to display chart.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
