export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  south: number;
  north: number;
  west: number;
  east: number;
}

export interface LocationData {
  type: "pin" | "boundingbox";
  coordinates?: LocationCoordinates;
  boundingBox?: BoundingBox;
  displayName?: string;
}

export const DEFAULT_COORDINATES: LocationCoordinates = {
  lat: 46.8182,
  lng: 8.2275,
};

export const convertToLatLng = (
  coords: LocationCoordinates
): [number, number] => {
  return [coords.lat, coords.lng];
};

const boundingBoxArea = (boundingBox: BoundingBox): number => {
  const latDiff = boundingBox.north - boundingBox.south;
  const lngDiff = boundingBox.east - boundingBox.west;
  return latDiff * lngDiff;
};

const isBoundingBox = (boundingbox: string[]): boolean => {
  const [south, north, west, east] = boundingbox.map(parseFloat);
  const area = boundingBoxArea({
    south,
    north,
    west,
    east,
  });
  return area >= 0.000001;
};

const parseBoundingBox = (boundingbox: string[]): BoundingBox => {
  const [south, north, west, east] = boundingbox.map(parseFloat);
  return { south, north, west, east };
};

export const parseAddressToLocationData = async (
  address: string
): Promise<LocationData> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const coordinates: LocationCoordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      };

      if (result.boundingbox && isBoundingBox(result.boundingbox)) {
        return {
          type: "boundingbox",
          coordinates,
          boundingBox: parseBoundingBox(result.boundingbox),
          displayName: result.display_name,
        };
      } else {
        return {
          type: "pin",
          coordinates,
          displayName: result.display_name,
        };
      }
    }

    throw new Error("No location data found for address");
  } catch (error) {
    console.warn("Geocoding failed, using default coordinates:", error);
    return {
      type: "pin",
      coordinates: DEFAULT_COORDINATES,
    };
  }
};

export const parseAddressToCoordinates = async (
  address: string
): Promise<LocationCoordinates> => {
  const locationData = await parseAddressToLocationData(address);
  return locationData.coordinates || DEFAULT_COORDINATES;
};

const calculateBoundingBoxZoom = (boundingBox: BoundingBox): number => {
  const area = boundingBoxArea(boundingBox);

  if (area < 0.00001) return 19;
  if (area < 0.0001) return 17;
  if (area < 0.001) return 15;
  if (area < 0.01) return 13;
  if (area < 0.1) return 11;
  if (area < 1) return 9;
  if (area < 10) return 7;
  return 5;
};

export const getOptimalZoom = (locationData: LocationData): number => {
  if (locationData.type === "pin") {
    return 15;
  }

  if (locationData.boundingBox) {
    return calculateBoundingBoxZoom(locationData.boundingBox);
  }

  return 13;
};
