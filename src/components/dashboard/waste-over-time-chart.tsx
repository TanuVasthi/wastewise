"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Total (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function WasteOverTimeChart() {
  const [data, setData] = useState([
    { date: "Mon", total: 0 },
    { date: "Tue", total: 0 },
    { date: "Wed", total: 0 },
    { date: "Thu", total: 0 },
    { date: "Fri", total: 0 },
    { date: "Sat", total: 0 },
    { date: "Sun", total: 0 },
  ]);

  useEffect(() => {
    setData([
      { date: "Mon", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Tue", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Wed", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Thu", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Fri", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Sat", total: Math.floor(Math.random() * 200) + 100 },
      { date: "Sun", total: Math.floor(Math.random() * 200) + 100 },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Waste Collected</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
             <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
