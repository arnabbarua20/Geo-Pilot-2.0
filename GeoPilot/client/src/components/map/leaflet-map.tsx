import { useEffect, useRef, useState } from "react";
import { DroneZone } from "@shared/schema";
import ZoneMarker from "./zone-marker";

interface LeafletMapProps {
  zones: DroneZone[];
}

export default function LeafletMap({ zones }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<DroneZone | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current).setView([-41.2865, 174.7762], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Handle map clicks for location selection
      map.on('click', (e: any) => {
        const event = new CustomEvent('mapLocationSelected', {
          detail: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        });
        window.dispatchEvent(event);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !zones.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add zone markers
    import("leaflet").then((L) => {
      zones.forEach(zone => {
        const markerColor = getMarkerColor(zone.reason);
        
        const marker = L.marker([zone.latitude, zone.longitude]).addTo(mapInstanceRef.current);
        
        const popupContent = `
          <div class="p-0">
            <h3 class="font-semibold text-neutral mb-2">${zone.title}</h3>
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-3 h-3 ${getStatusColorClass(zone.zoneType)} rounded-full"></div>
              <span class="text-sm font-medium">${zone.status.toUpperCase()}</span>
            </div>
            <p class="text-sm text-gray-600 mb-3">${zone.details || 'No additional details'}</p>
            <button onclick="window.showZoneDetails('${zone.id}')" class="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded font-medium hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: 'custom-popup'
        });

        markersRef.current.push(marker);
      });

      // Global function for zone details
      (window as any).showZoneDetails = (zoneId: string) => {
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
          setSelectedZone(zone);
        }
      };
    });
  }, [zones]);

  const getMarkerColor = (reason: string) => {
    switch (reason) {
      case 'airport': return 'red';
      case 'hospital': return 'orange';
      case 'nature': return 'blue';
      case 'military': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColorClass = (zoneType: string) => {
    switch (zoneType) {
      case 'restricted': return 'bg-red-500';
      case 'controlled': return 'bg-orange-500';
      case 'protected': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      <div ref={mapRef} className="h-full w-full" />
      {selectedZone && (
        <ZoneMarker 
          zone={selectedZone} 
          onClose={() => setSelectedZone(null)} 
        />
      )}
    </>
  );
}
