"use client";

import { useEffect, useState } from "react";
import type { LocationData } from "@/src/utils/location-utils";

interface MapProps {
  locationData: LocationData;
  zoom?: number;
}

const DynamicMap: React.FC<MapProps> = ({ locationData, zoom = 13 }) => {
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadMapComponents = async () => {
      try {
        const [{ MapContainer, TileLayer, Marker, Popup, Rectangle }, leaflet] =
          await Promise.all([import("react-leaflet"), import("leaflet")]);

        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        setMapComponents({
          MapContainer,
          TileLayer,
          Marker,
          Popup,
          Rectangle,
        });
      } catch (error) {
        console.error("Error loading map components:", error);
      }
    };

    loadMapComponents();
  }, [isClient]);

  if (!isClient || !mapComponents || !locationData.coordinates) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Rectangle } = mapComponents;
  const { coordinates, boundingBox, type } = locationData;
  const center: [number, number] = [coordinates.lat, coordinates.lng];

  const bounds = boundingBox
    ? [
        [boundingBox.south, boundingBox.west] as [number, number],
        [boundingBox.north, boundingBox.east] as [number, number],
      ]
    : undefined;

  return (
    <MapContainer
      key={`${center.join(",")}-${type}`}
      center={center}
      zoom={zoom}
      bounds={type === "boundingbox" && bounds ? bounds : undefined}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {type === "pin" ? (
        <Marker position={center} draggable={false}>
          <Popup>Location of the item</Popup>
        </Marker>
      ) : (
        bounds && (
          <Rectangle
            bounds={bounds}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#60a5fa",
              fillOpacity: 0.3,
              weight: 3,
            }}
          >
            <Popup>General area of the item</Popup>
          </Rectangle>
        )
      )}
    </MapContainer>
  );
};

export default DynamicMap;
