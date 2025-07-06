"use client"

import { useMemo } from "react";
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { WasteRecord } from "@/lib/data";
import { format, subMonths, getMonth, getYear, startOfMonth } from "date-fns";
  
const chartConfig = {
    ZoneA: { label: "Zone A", color: "hsl(var(--chart-1))" },
    ZoneB: { label: "Zone B", color: "hsl(var(--chart-2))" },
    ZoneC: { label: "Zone C", color: "hsl(var(--chart-3))" },
    ZoneD: { label: "Zone D", color: "hsl(var(--chart-4))" },
    ZoneE: { label: "Zone E", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

interface ZoneTrendsChartProps {
    records: WasteRecord[];
}

export function ZoneTrendsChart({ records }: ZoneTrendsChartProps) {
    const data = useMemo(() => {
        if (!records || records.length === 0) return [];

        const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

        const filteredRecords = records.filter(r => new Date(r.date) >= sixMonthsAgo);

        const monthlyData = filteredRecords.reduce((acc, record) => {
            const monthKey = format(new Date(record.date), "yyyy-MM");
            if (!acc[monthKey]) {
                acc[monthKey] = { name: format(new Date(record.date), "MMM") };
            }
            
            const zoneKey = record.location.replace(" ", "");
            acc[monthKey][zoneKey] = (acc[monthKey][zoneKey] || 0) + record.quantity;
            return acc;
        }, {} as Record<string, any>);

        const sortedMonths = Object.keys(monthlyData).sort();
        
        return sortedMonths.map(monthKey => monthlyData[monthKey]);

    }, [records]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Zone-wise Waste Trends</CardTitle>
                <CardDescription>Last 6 Months</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
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
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        {Object.entries(chartConfig).map(([zoneKey, config]) => (
                            <Line key={zoneKey} type="monotone" dataKey={zoneKey} name={config.label} stroke={config.color} />
                        ))}
                    </LineChart>
                </ChartContainer>
                ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available to display chart.
                </div>
                )}
            </CardContent>
        </Card>
    )
}
