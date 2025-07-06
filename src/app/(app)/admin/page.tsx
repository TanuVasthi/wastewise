
"use client";

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
import { mockUsers, mockBins, mockWasteRecords } from "@/lib/data";
import { PlusCircle, FileDown, Trash2 } from "lucide-react";

export default function AdminPage() {

    const handleExport = () => {
        const headers = Object.keys(mockWasteRecords[0]).join(',');
        const rows = mockWasteRecords.map(row => 
            Object.values(row).map(val => (val instanceof Date) ? val.toISOString() : val).join(',')
        );
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
              <CardDescription>Download waste collection records as a CSV file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Click the button below to download all waste records.</p>
              <Button onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" /> Export as CSV
              </Button>
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
