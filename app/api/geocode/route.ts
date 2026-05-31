import { NextResponse } from "next/server";

type GeocodeRequestBody = {
  address?: unknown;
};

type GeocodeResult = {
  label: string;
  address: string;
  lat: number;
  lng: number;
  source: "mapbox" | "local";
  confidence: "exact" | "city" | "fallback";
};

type MapboxFeature = {
  place_name?: string;
  text?: string;
  center?: [number, number];
  relevance?: number;
};

type MapboxResponse = {
  features?: MapboxFeature[];
  message?: string;
};

const localAnchors: GeocodeResult[] = [
  {
    label: "DQG HQ",
    address: "Boulder Authority Center",
    lat: 40.0174,
    lng: -105.276,
    source: "local",
    confidence: "exact",
  },
  {
    label: "Downtown Boulder",
    address: "Pearl Street, Boulder, CO",
    lat: 40.0191,
    lng: -105.2817,
    source: "local",
    confidence: "exact",
  },
  {
    label: "Downtown Denver",
    address: "Downtown Denver, CO",
    lat: 39.7392,
    lng: -104.9903,
    source: "local",
    confidence: "city",
  },
  {
    label: "Louisville",
    address: "Louisville, CO",
    lat: 39.9778,
    lng: -105.1319,
    source: "local",
    confidence: "city",
  },
  {
    label: "Lafayette",
    address: "Lafayette, CO",
    lat: 39.9936,
    lng: -105.0897,
    source: "local",
    confidence: "city",
  },
  {
    label: "Longmont",
    address: "Longmont, CO",
    lat: 40.1672,
    lng: -105.1019,
    source: "local",
    confidence: "city",
  },
  {
    label: "Broomfield",
    address: "Broomfield, CO",
    lat: 39.9205,
    lng: -105.0867,
    source: "local",
    confidence: "city",
  },
];

function getAddress(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getMapboxToken() {
  return process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
}

function findLocalAnchor(address: string): GeocodeResult | null {
  const normalized = address.toLowerCase();

  return (
    localAnchors.find((anchor) => {
      const label = anchor.label.toLowerCase();
      const anchorAddress = anchor.address.toLowerCase();

      return normalized.includes(label) || normalized.includes(anchorAddress) || label.includes(normalized);
    }) || null
  );
}

function buildMapboxUrl(address: string, token: string) {
  const params = new URLSearchParams({
    access_token: token,
    autocomplete: "false",
    country: "US",
    limit: "1",
    proximity: "-105.2705,40.015",
  });

  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?${params.toString()}`;
}

function normalizeMapboxFeature(feature: MapboxFeature, requestedAddress: string): GeocodeResult | null {
  const [lng, lat] = feature.center || [];

  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    label: feature.text || requestedAddress,
    address: feature.place_name || requestedAddress,
    lat,
    lng,
    source: "mapbox",
    confidence: typeof feature.relevance === "number" && feature.relevance >= 0.9 ? "exact" : "fallback",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeocodeRequestBody;
    const address = getAddress(body.address);

    if (!address) {
      return NextResponse.json({ error: "Address is required." }, { status: 400 });
    }

    const localAnchor = findLocalAnchor(address);
    const mapboxToken = getMapboxToken();

    if (!mapboxToken) {
      if (localAnchor) {
        return NextResponse.json({
          result: localAnchor,
          source: "local",
          health: "fallback",
          message: "Mapbox access token is not configured; returned local REIE geocode.",
        });
      }

      return NextResponse.json(
        {
          error: "Mapbox access token is not configured and no local REIE geocode matched this address.",
          source: "local",
          health: "blocked",
        },
        { status: 422 },
      );
    }

    const response = await fetch(buildMapboxUrl(address, mapboxToken), {
      next: { revalidate: 86400 },
    });
    const data = (await response.json()) as MapboxResponse;

    if (!response.ok) {
      if (localAnchor) {
        return NextResponse.json({
          result: localAnchor,
          source: "local",
          health: "fallback",
          message: data.message || "Mapbox geocode failed; returned local REIE geocode.",
        });
      }

      return NextResponse.json(
        { error: data.message || "Mapbox geocode failed.", source: "mapbox", health: "blocked" },
        { status: response.status },
      );
    }

    const result = normalizeMapboxFeature(data.features?.[0] || {}, address);

    if (!result) {
      if (localAnchor) {
        return NextResponse.json({
          result: localAnchor,
          source: "local",
          health: "fallback",
          message: "Mapbox did not return coordinates; returned local REIE geocode.",
        });
      }

      return NextResponse.json({ error: "No coordinates found for this address.", source: "mapbox", health: "blocked" }, { status: 404 });
    }

    return NextResponse.json({ result, source: "mapbox", health: "live" });
  } catch (error) {
    console.error("[GEOCODE] Address lookup failed:", error);
    return NextResponse.json({ error: "Failed to geocode address." }, { status: 500 });
  }
}
