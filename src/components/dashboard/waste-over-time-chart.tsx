"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { format, subDays, isSameDay } from "date-fns";
import type { WasteRecord } from "@/lib/data";


const chartConfig = {
  total: {
    label: "Total (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface WasteOverTimeChartProps {
    records: WasteRecord[];
}

export function WasteOverTimeChart({ records }: WasteOverTimeChartProps) {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    
    const aggregatedData = last7Days.map(date => {
        const dayOfWeek = format(date, "eee");
        
        const total = records
            .filter(record => isSameDay(new Date(record.date), date))
            .reduce((sum, record) => sum + record.quantity, 0);

        return { date: dayOfWeek, total };
    });

    return aggregatedData;
  }, [records]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Waste Collected</CardTitle>
        <CardDescription>Last 7 Days</CardDescription>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
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
        ) : (
             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available to display chart.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
