"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { locations, wasteTypes } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const formSchema = z.object({
  wasteType: z.enum(wasteTypes, {
    required_error: "Please select a waste type.",
  }),
  quantity: z.coerce
    .number({ required_error: "Please enter a quantity." })
    .positive({ message: "Quantity must be positive." }),
  location: z.string({ required_error: "Please select a location." }).min(1, "Please select a location."),
  date: z.date({
    required_error: "A date of collection is required.",
  }),
  collectorId: z.string().min(1, "Collector ID is required."),
  truckId: z.string().optional(),
});

export function DataEntryForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wasteType: undefined,
      quantity: undefined,
      location: undefined,
      date: new Date(),
      collectorId: "C001", // Should be dynamically set in a real app
      truckId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "waste-records"), values);
      
      toast({
        title: "Success!",
        description: "Waste collection record has been saved to Firebase.",
        className: "bg-primary text-primary-foreground",
      });
      form.reset({
        wasteType: undefined,
        quantity: undefined,
        location: undefined,
        date: new Date(),
        collectorId: "C001",
        truckId: "",
      });
    } catch (error: any) {
      console.error("Error adding document: ", error);
      let description = "Failed to save record. Please make sure your Firebase project is set up correctly.";
      if (error.code === 'permission-denied') {
          description = "Failed to save record. Please check your Firestore security rules to allow write access."
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waste Collection Data Entry</CardTitle>
        <CardDescription>Fill in the details below to record a new waste collection.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="wasteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a waste type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wasteTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 50" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Zone/Ward)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2000-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collectorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collector Name or ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. C001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="truckId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Truck/Bin ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. T01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit Record"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
