"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Recycle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("data-collector");

  const handleLogin = () => {
    if (role === "admin") {
      router.push("/dashboard");
    } else {
      router.push("/data-entry");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Recycle className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            WasteWise Analytics
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Solid Waste Management & Analytics Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Your Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-collector">Data Collector</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full" size="lg">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
