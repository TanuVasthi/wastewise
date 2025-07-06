"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { date: "Mon", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Tue", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Wed", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Thu", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Fri", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Sat", total: Math.floor(Math.random() * 200) + 100 },
  { date: "Sun", total: Math.floor(Math.random() * 200) + 100 },
];

export function WasteOverTimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Waste Collected</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
