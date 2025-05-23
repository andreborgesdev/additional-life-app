export interface LocationCoordinates {
  lat: number;
  lng: number;
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

export const parseAddressToCoordinates = async (
  address: string
): Promise<LocationCoordinates> => {
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
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    throw new Error("No coordinates found for address");
  } catch (error) {
    console.warn("Geocoding failed, using default coordinates:", error);
    return DEFAULT_COORDINATES;
  }
};

const SWISS_CITIES_COORDINATES: Record<string, LocationCoordinates> = {
  zurich: { lat: 47.3769, lng: 8.5417 },
  geneva: { lat: 46.2044, lng: 6.1432 },
  basel: { lat: 47.5596, lng: 7.5886 },
  bern: { lat: 46.9481, lng: 7.4474 },
  lausanne: { lat: 46.5197, lng: 6.6323 },
  winterthur: { lat: 47.4989, lng: 8.7233 },
  "st. gallen": { lat: 47.4245, lng: 9.3767 },
  lucerne: { lat: 47.0502, lng: 8.3093 },
  lugano: { lat: 46.0037, lng: 8.9511 },
  biel: { lat: 47.1424, lng: 7.2662 },
};

export const getCoordinatesForItem = (
  address?: string
): LocationCoordinates => {
  if (!address) {
    return DEFAULT_COORDINATES;
  }

  const normalizedAddress = address.toLowerCase().trim();

  for (const [city, coords] of Object.entries(SWISS_CITIES_COORDINATES)) {
    if (normalizedAddress.includes(city)) {
      return coords;
    }
  }

  return DEFAULT_COORDINATES;
};
