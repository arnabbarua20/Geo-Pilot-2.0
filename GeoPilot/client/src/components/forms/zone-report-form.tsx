import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertDroneZoneSchema, type InsertDroneZone } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Crosshair, Tag, ClipboardList, FileText, Phone, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ZoneReportForm() {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDroneZone>({
    resolver: zodResolver(insertDroneZoneSchema),
    defaultValues: {
      title: "",
      latitude: 0,
      longitude: 0,
      reason: "",
      details: "",
      emergencyContact: "",
      zoneType: "controlled",
    },
  });

  const createZoneMutation = useMutation({
    mutationFn: async (data: InsertDroneZone) => {
      const response = await apiRequest("POST", "/api/drone-zones", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drone-zones"] });
      toast({
        title: "Report Submitted Successfully",
        description: "Your drone restriction report has been saved and will be reviewed by authorities.",
      });
      form.reset();
      setSelectedCoordinates(null);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please check your connection and try again.",
        variant: "destructive",
      });
    },
  });

  // Listen for map location selection
  useEffect(() => {
    const handleLocationSelected = (event: CustomEvent) => {
      const { lat, lng } = event.detail;
      setSelectedCoordinates({ lat, lng });
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
    };

    window.addEventListener('mapLocationSelected', handleLocationSelected as EventListener);
    return () => {
      window.removeEventListener('mapLocationSelected', handleLocationSelected as EventListener);
    };
  }, [form]);

  const onSubmit = (data: InsertDroneZone) => {
    createZoneMutation.mutate(data);
  };

  const handleMapSelector = () => {
    // Switch to map view
    window.location.href = "/";
    toast({
      title: "Map Location Selection",
      description: "Click on the map to select coordinates, then return to complete the form.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Location Section */}
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Crosshair className="w-4 h-4" />
                Location
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Click on map to select location or enter manually"
                    value={selectedCoordinates 
                      ? `${selectedCoordinates.lat.toFixed(6)}, ${selectedCoordinates.lng.toFixed(6)}` 
                      : ""
                    }
                    readOnly
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                  onClick={handleMapSelector}
                >
                  <Crosshair className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">Latitude, Longitude coordinates</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden latitude and longitude fields */}
        <FormField
          control={form.control}
          name="longitude"
          render={() => <input type="hidden" />}
        />

        {/* Zone Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Zone Title *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Wellington Hospital Helipad, Private Property, Event Space"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Restriction Reason */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Reason for Restriction *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="airport">Airport/Helipad Operations</SelectItem>
                  <SelectItem value="military">Military Installation</SelectItem>
                  <SelectItem value="hospital">Hospital/Emergency Services</SelectItem>
                  <SelectItem value="prison">Correctional Facility</SelectItem>
                  <SelectItem value="power">Power Plant/Infrastructure</SelectItem>
                  <SelectItem value="nature">Nature Reserve/Wildlife</SelectItem>
                  <SelectItem value="event">Temporary Event Space</SelectItem>
                  <SelectItem value="private">Private Property</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zone Type */}
        <FormField
          control={form.control}
          name="zoneType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zone Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="restricted">Restricted</SelectItem>
                  <SelectItem value="controlled">Controlled</SelectItem>
                  <SelectItem value="protected">Protected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Details */}
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Additional Details
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional context, operating hours, contact information, or special considerations..."
                  rows={4}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Emergency Contact */}
        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Emergency Contact (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Phone number for urgent drone-related issues"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={createZoneMutation.isPending}
            className="flex items-center gap-2"
          >
            {createZoneMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
