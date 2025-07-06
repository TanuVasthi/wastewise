
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
import type { WasteRecord } from "@/lib/data";

interface AiSuggestionsProps {
    records: WasteRecord[];
}

export function AiSuggestions({ records }: AiSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestBinLocationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (records.length === 0) {
        setError("No waste data available to analyze. Please add some records first.");
        setLoading(false);
        return;
    }

    const historicalData = JSON.stringify(
      records.map((r) => ({
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
      setError(e.message || "An unknown error occurred during AI analysis.");
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
          Analyze recent waste data (last 6 months) to identify zones needing more bins and optimize
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
        {!loading && !result && !error && (
            <div className="py-8 text-center text-muted-foreground">
                <p>Click the button to get AI suggestions based on your data.</p>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={loading || records.length === 0}>
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
