"use client";

import { useEffect, useState } from "react";

interface MapProps {
  posix: [number, number];
  zoom?: number;
}

const DynamicMap: React.FC<MapProps> = ({ posix, zoom = 13 }) => {
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadMapComponents = async () => {
      try {
        const [{ MapContainer, TileLayer, Marker, Popup }, leaflet] =
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
        });
      } catch (error) {
        console.error("Error loading map components:", error);
      }
    };

    loadMapComponents();
  }, [isClient]);

  if (!isClient || !mapComponents) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

  return (
    <MapContainer
      key={posix.join(",")}
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={posix} draggable={false}>
        <Popup>Location of the item</Popup>
      </Marker>
    </MapContainer>
  );
};

export default DynamicMap;
