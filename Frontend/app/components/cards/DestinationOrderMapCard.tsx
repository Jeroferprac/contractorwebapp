"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getWarehouses } from "@/lib/warehouse";
import { Package } from "lucide-react";

// Custom icon for warehouse (box)
const warehouseIcon = new L.Icon({
  iconUrl: "/box-icon.png", // Place your icon in public/ or use a CDN
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom icon for truck (for the first marker)
const truckIcon = new L.Icon({
  iconUrl: "/truck-icon.png", // Place your icon in public/ or use a CDN
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Helper: Geocode address to [lat, lng] using OpenStreetMap Nominatim
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  // Check localStorage cache first
  const cacheKey = `geocode_${address}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    localStorage.setItem(cacheKey, JSON.stringify([lat, lon]));
    return [lat, lon];
  }
  return null;
}

// Helper: Fit map to markers
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

export function DestinationOrderMapCard() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [coords, setCoords] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getWarehouses();
        setWarehouses(data);
        // Geocode all addresses in parallel
        const results = await Promise.all(
          data.map((w: any) => geocodeAddress(w.address))
        );
        setCoords(results.filter(Boolean) as [number, number][]);
      } catch (e) {
        setError("Failed to load warehouse data or geocode addresses.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Example stats (replace with real calculations if needed)
  const area = 876;
  const percentChange = 21;

  return (
    <Card className="relative overflow-hidden w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Place
          </div>
          <div className="text-xl font-bold">Destination Order</div>
        </div>
        <div className="flex flex-col md:items-end">
          <div className="text-3xl font-bold">{area} Area</div>
          <div className="text-green-600 font-semibold text-sm mt-1">
            +{percentChange}% <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[260px] md:h-[300px] rounded-b-lg overflow-hidden relative">
          {loading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading map...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : coords.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">No locations found</div>
          ) : (
            <MapContainer
              style={{ width: "100%", height: "100%" }}
              center={coords[0]}
              zoom={13}
              scrollWheelZoom={false}
              dragging={true}
              zoomControl={false}
              doubleClickZoom={false}
              attributionControl={false}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {/* Draw route */}
              {coords.length > 1 && <Polyline positions={coords} color="#22c55e" weight={5} opacity={0.7} />} 
              {/* Markers */}
              {coords.map((pos, idx) => (
                <Marker
                  key={idx}
                  position={pos}
                  icon={idx === 0 ? truckIcon : warehouseIcon}
                />
              ))}
              <FitBounds positions={coords} />
            </MapContainer>
          )}
        </div>
        <div className="flex justify-end p-4">
          <Button variant="outline" className="border-2 border-green-400 text-green-600 font-bold rounded-lg px-6 py-2">
            See Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 