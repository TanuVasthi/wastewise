"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WasteRecord } from "@/lib/data";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { WasteOverTimeChart } from "@/components/dashboard/waste-over-time-chart";
import { WasteByTypeChart } from "@/components/dashboard/waste-by-type-chart";
import { ZoneTrendsChart } from "@/components/dashboard/zone-trends-chart";
import { Skeleton } from "@/components/ui/skeleton";

import { Trash2, Scale, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSameDay, subDays, subMonths } from "date-fns";

export default function DashboardPage() {
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWasteRecords = async () => {
      try {
        const sixMonthsAgo = subMonths(new Date(), 6);
        const recordsQuery = query(
            collection(db, "waste-records"), 
            orderBy("date", "desc"),
            where("date", ">=", sixMonthsAgo)
        );
        const querySnapshot = await getDocs(recordsQuery);
        const records = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
          } as WasteRecord;
        });
        setWasteRecords(records);
      } catch (err: any) {
        console.error(err);
        if (err.code === 'permission-denied') {
             setError("Permission Denied: Could not fetch data. Please go to your Firebase project's Firestore settings and update your Security Rules to allow read access to the 'waste-records' collection. For development, you can start with `allow read, write: if true;`, but be sure to secure your data for production.");
        } else {
            setError("Failed to fetch waste data. Please ensure your Firebase project is set up correctly.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWasteRecords();
  }, []);

  // Calculate KPIs
  const totalCollectedToday = wasteRecords
    .filter(record => isSameDay(new Date(record.date), new Date()))
    .reduce((sum, record) => sum + record.quantity, 0);

  const last30Days = subDays(new Date(), 30);
  const recordsInLast30Days = wasteRecords
    .filter(record => new Date(record.date) >= last30Days);
    
  const totalCollectedLast30Days = recordsInLast30Days
    .reduce((sum, record) => sum + record.quantity, 0);
    
  const averagePerDay = recordsInLast30Days.length > 0 ? (totalCollectedLast30Days / 30).toFixed(0) : 0;


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Skeleton className="h-[105px]" />
          <Skeleton className="h-[105px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[380px]" />
          <Skeleton className="h-[380px]" />
        </div>
        <div className="grid grid-cols-1 gap-6">
           <Skeleton className="h-[380px]" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <KpiCard
          title="Total Collected Today"
          value={`${(totalCollectedToday / 1000).toFixed(2)} Tons`}
          description={wasteRecords.length === 0 ? "No records yet" : "Based on submitted records"}
          Icon={Trash2}
        />
        <KpiCard
          title="Average Waste / Day"
          value={`${averagePerDay} kg`}
          description="Based on the last 30 days"
          Icon={Scale}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WasteOverTimeChart records={wasteRecords} />
        <WasteByTypeChart records={wasteRecords} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ZoneTrendsChart records={wasteRecords} />
      </div>
    </div>
  );
}
