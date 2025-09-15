import { useQuery } from "@tanstack/react-query";
import { Info, BarChart3, MousePointer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LeafletMap from "@/components/map/leaflet-map";
import { DroneZone } from "@shared/schema";

export default function MapView() {
  const { data: zones, isLoading } = useQuery<DroneZone[]>({
    queryKey: ["/api/drone-zones"],
  });

  const zoneStats = zones?.reduce(
    (acc, zone) => {
      if (zone.zoneType === "restricted") acc.restricted++;
      else if (zone.zoneType === "controlled") acc.controlled++;
      return acc;
    },
    { restricted: 0, controlled: 0 }
  ) || { restricted: 0, controlled: 0 };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <LeafletMap zones={zones || []} />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-40 space-y-2">
        {/* Zone Legend */}
        <Card className="max-w-xs">
          <CardContent className="p-4">
            <h3 className="font-semibold text-neutral mb-3 flex items-center">
              <Info className="mr-2 text-primary w-4 h-4" />
              No-Fly Zones
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-neutral">Airport Restricted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-neutral">Military Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-neutral">Nature Reserve</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Stats */}
        <Card className="max-w-xs">
          <CardContent className="p-4">
            <h4 className="font-medium text-neutral mb-2 flex items-center">
              <BarChart3 className="mr-2 w-4 h-4" />
              Zone Statistics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-red-500">{zoneStats.restricted}</div>
                <div className="text-gray-500">Restricted</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-500">{zoneStats.controlled}</div>
                <div className="text-gray-500">Controlled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Click Instructions */}
      <div className="absolute bottom-4 right-4 z-40">
        <Card>
          <CardContent className="p-3">
            <p className="text-sm text-gray-600 flex items-center">
              <MousePointer className="mr-2 text-primary w-4 h-4" />
              Click on map to select location for reporting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
