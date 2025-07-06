"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, AlertTriangle, MapPin } from "lucide-react";
import {
  suggestBinLocations,
  type SuggestBinLocationsOutput,
} from "@/ai/flows/suggest-bin-locations";
import { mockWasteRecords } from "@/lib/data";

export function AiSuggestions() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestBinLocationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // For demonstration, we'll stringify our mock data.
    // In a real app, you might fetch and format more complex data.
    const historicalData = JSON.stringify(
      mockWasteRecords.map((r) => ({
        zone: r.location,
        type: r.wasteType,
        qty: r.quantity,
        date: r.date.toISOString().split("T")[0],
      })),
      null,
      2
    );

    try {
      const output = await suggestBinLocations({ historicalData });
      setResult(output);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <CardTitle>AI-Powered Zone Suggestions</CardTitle>
        </div>
        <CardDescription>
          Analyze historical data to identify zones needing more bins and optimize
          resource allocation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Analyzing data...</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {result && (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription className="space-y-4">
              <div>
                <h4 className="font-semibold">Suggested Zones for More Bins:</h4>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  {result.suggestedZones.map((zone) => (
                    <li key={zone} className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{zone}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Reasoning:</h4>
                <p className="mt-1 text-sm">{result.reasoning}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Waste Data"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
