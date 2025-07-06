"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"
  
  const data = [
    { name: 'Jan', "Zone A": 400, "Zone B": 240, "Zone C": 180 },
    { name: 'Feb', "Zone A": 300, "Zone B": 139, "Zone C": 220 },
    { name: 'Mar', "Zone A": 200, "Zone B": 980, "Zone C": 350 },
    { name: 'Apr', "Zone A": 278, "Zone B": 390, "Zone C": 280 },
    { name: 'May', "Zone A": 189, "Zone B": 480, "Zone C": 410 },
    { name: 'Jun', "Zone A": 239, "Zone B": 380, "Zone C": 250 },
  ]
  
  export function ZoneTrendsChart() {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Zone-wise Waste Trends</CardTitle>
          <CardDescription>Last 6 Months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
              <Line type="monotone" dataKey="Zone A" stroke="hsl(var(--chart-1))" />
              <Line type="monotone" dataKey="Zone B" stroke="hsl(var(--chart-2))" />
              <Line type="monotone" dataKey="Zone C" stroke="hsl(var(--chart-3))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }
  