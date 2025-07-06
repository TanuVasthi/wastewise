import { KpiCard } from "@/components/dashboard/kpi-card";
import { WasteOverTimeChart } from "@/components/dashboard/waste-over-time-chart";
import { WasteByTypeChart } from "@/components/dashboard/waste-by-type-chart";
import { AiSuggestions } from "@/components/dashboard/ai-suggestions";
import { ZoneTrendsChart } from "@/components/dashboard/zone-trends-chart";

import { Trash2, Scale, Truck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          title="Total Collected Today"
          value="1.2 Tons"
          description="+15% from yesterday"
          Icon={Trash2}
        />
        <KpiCard
          title="Average Waste / Day"
          value="850 kg"
          description="Based on the last 30 days"
          Icon={Scale}
        />
        <KpiCard
          title="Missed Pickups"
          value="3"
          description="In the last 7 days"
          Icon={Truck}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WasteOverTimeChart />
        <WasteByTypeChart />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ZoneTrendsChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AiSuggestions />
      </div>
    </div>
  );
}
