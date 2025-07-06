
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUsers, mockBins, type WasteRecord } from "@/lib/data";
import { PlusCircle, FileDown, Trash2, AlertTriangle } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function AdminPage() {
    const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWasteRecords = async () => {
          try {
            const recordsQuery = query(collection(db, "waste-records"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(recordsQuery);
            const records = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                date: data.date.toDate(),
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

    const handleExport = () => {
        if (wasteRecords.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ["ID", "Waste Type", "Quantity (kg)", "Location", "Date", "Collector ID", "Truck ID"].join(',');
        
        const rows = wasteRecords.map(row => {
            const rowData = [
                row.id,
                row.wasteType,
                row.quantity,
                `"${(row.location || '').replace(/"/g, '""')}"`,
                row.date.toISOString(),
                row.collectorId,
                row.truckId || ''
            ];
            return rowData.join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "waste_data_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Tools</h1>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="bins">Bin Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>Add, view, or remove users from the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>View and download waste collection records as a CSV file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading && (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Loading Data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!loading && !error && (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Waste Type</TableHead>
                          <TableHead>Quantity (kg)</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Collector</TableHead>
                          <TableHead>Truck ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wasteRecords.length > 0 ? (
                          wasteRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">{record.wasteType}</TableCell>
                              <TableCell>{record.quantity}</TableCell>
                              <TableCell>{record.location}</TableCell>
                              <TableCell>{record.date.toLocaleDateString()}</TableCell>
                              <TableCell>{record.collectorId}</TableCell>
                              <TableCell>{record.truckId || "N/A"}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <Button onClick={handleExport} disabled={wasteRecords.length === 0 || loading}>
                    <FileDown className="mr-2 h-4 w-4" /> Export as CSV
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bins">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bins</CardTitle>
              <CardDescription>Add, edit, or view bin locations and details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Add New Bin</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="bin-location">Location</Label>
                            <Input id="bin-location" placeholder="e.g. Zone D - School" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="bin-capacity">Capacity (kg)</Label>
                            <Input id="bin-capacity" type="number" placeholder="e.g. 1000" />
                        </div>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Bin
                        </Button>
                    </CardContent>
                </Card>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bin ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity (kg)</TableHead>
                    <TableHead>Last Emptied</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBins.map((bin) => (
                    <TableRow key={bin.id}>
                      <TableCell className="font-mono">{bin.id}</TableCell>
                      <TableCell className="font-medium">{bin.location}</TableCell>
                      <TableCell>{bin.capacity}</TableCell>
                      <TableCell>{bin.lastEmptied.toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
