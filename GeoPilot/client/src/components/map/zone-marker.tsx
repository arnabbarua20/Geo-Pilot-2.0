import { X } from "lucide-react";
import { DroneZone } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface ZoneMarkerProps {
  zone: DroneZone;
  onClose: () => void;
}

export default function ZoneMarker({ zone, onClose }: ZoneMarkerProps) {
  const getStatusColor = (zoneType: string) => {
    switch (zoneType) {
      case 'restricted': return 'text-red-500 bg-red-500';
      case 'controlled': return 'text-orange-500 bg-orange-500';
      case 'protected': return 'text-blue-500 bg-blue-500';
      default: return 'text-gray-500 bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral">{zone.title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(zone.zoneType).split(' ')[1]}`} />
              <span className={`font-medium ${getStatusColor(zone.zoneType).split(' ')[0]}`}>
                {zone.status.toUpperCase()}
              </span>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral mb-1">Restriction Type</h4>
              <p className="text-gray-600 capitalize">{zone.reason.replace('_', ' ')}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral mb-1">Coordinates</h4>
              <p className="text-gray-600 font-mono text-sm">
                {zone.latitude.toFixed(6)}, {zone.longitude.toFixed(6)}
              </p>
            </div>
            
            {zone.details && (
              <div>
                <h4 className="font-medium text-neutral mb-1">Details</h4>
                <p className="text-gray-600">{zone.details}</p>
              </div>
            )}

            {zone.emergencyContact && (
              <div>
                <h4 className="font-medium text-neutral mb-1">Emergency Contact</h4>
                <p className="text-gray-600">{zone.emergencyContact}</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm text-gray-600">{formatDate(zone.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
