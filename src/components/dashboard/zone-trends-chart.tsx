"use client"

import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
  
  const data = [
    { name: 'Jan', "Zone A": 400, "Zone B": 240, "Zone C": 180 },
    { name: 'Feb', "Zone A": 300, "Zone B": 139, "Zone C": 220 },
    { name: 'Mar', "Zone A": 200, "Zone B": 980, "Zone C": 350 },
    { name: 'Apr', "Zone A": 278, "Zone B": 390, "Zone C": 280 },
    { name: 'May', "Zone A": 189, "Zone B": 480, "Zone C": 410 },
    { name: 'Jun', "Zone A": 239, "Zone B": 380, "Zone C": 250 },
  ]
  
  const chartConfig = {
    "Zone A": {
      label: "Zone A",
      color: "hsl(var(--chart-1))",
    },
    "Zone B": {
      label: "Zone B",
      color: "hsl(var(--chart-2))",
    },
    "Zone C": {
      label: "Zone C",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  export function ZoneTrendsChart() {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Zone-wise Waste Trends</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Line type="monotone" dataKey="Zone A" stroke="var(--color-Zone A)" />
              <Line type="monotone" dataKey="Zone B" stroke="var(--color-Zone B)" />
              <Line type="monotone" dataKey="Zone C" stroke="var(--color-Zone C)" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  }
  