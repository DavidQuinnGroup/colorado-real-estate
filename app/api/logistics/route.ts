import { NextResponse } from "next/server";

import { calculateRitualPulse } from "@/lib/utils/geo-logic";

type Coordinate = {
  lat: number;
  lng: number;
};

type NorthStarInput = Coordinate & {
  label?: string;
  icon?: string;
};

type LogisticsRequestBody = {
  homeCoords?: unknown;
  northStars?: unknown;
};

type MatrixResponse = {
  durations?: Array<Array<number | null> | null>;
  message?: string;
};

type TravelTime = {
  label: string | undefined;
  minutes: number | null;
  icon?: string;
  source: "mapbox" | "estimated";
};

const maxMatrixDestinations = 24;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidCoordinate(value: unknown): value is Coordinate {
  if (!isRecord(value)) return false;

  const { lat, lng } = value;

  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

function normalizeNorthStar(value: unknown): NorthStarInput | null {
  if (!isRecord(value)) return null;

  const { lat, lng } = value;

  if (
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  ) {
    return null;
  }

  const label = typeof value.label === "string" ? value.label.trim() : "";
  const icon = typeof value.icon === "string" ? value.icon.trim() : "";

  return {
    lat,
    lng,
    label: label || "North Star",
    icon: icon || undefined,
  };
}

function getNorthStars(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeNorthStar)
    .filter((northStar): northStar is NorthStarInput => northStar !== null)
    .slice(0, maxMatrixDestinations);
}

function getCoordinateParam(coordinate: Coordinate) {
  return `${coordinate.lng},${coordinate.lat}`;
}

function buildMapboxMatrixUrl(homeCoords: Coordinate, northStars: NorthStarInput[], token: string) {
  const coordinates = [homeCoords, ...northStars].map(getCoordinateParam).join(";");
  const params = new URLSearchParams({
    access_token: token,
    annotations: "duration",
    sources: "0",
  });

  return `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?${params.toString()}`;
}

function getEstimatedTravelTimes(homeCoords: Coordinate, northStars: NorthStarInput[]): TravelTime[] {
  return northStars.map((northStar) => {
    const pulse = calculateRitualPulse(homeCoords, northStar);

    return {
      label: northStar.label,
      minutes: pulse.time,
      icon: northStar.icon,
      source: "estimated",
    };
  });
}

function getTravelTimes(data: MatrixResponse, northStars: NorthStarInput[]): TravelTime[] {
  const sourceDurations = data.durations?.[0];

  if (!Array.isArray(sourceDurations)) {
    throw new Error(data.message || "Mapbox matrix response did not include durations.");
  }

  return northStars.map((northStar, index) => {
    const seconds = sourceDurations[index + 1];

    return {
      label: northStar.label,
      minutes: typeof seconds === "number" && Number.isFinite(seconds) ? Math.ceil(seconds / 60) : null,
      icon: northStar.icon,
      source: "mapbox",
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LogisticsRequestBody;

    if (!isValidCoordinate(body.homeCoords)) {
      return NextResponse.json({ error: "Valid homeCoords are required." }, { status: 400 });
    }

    const northStars = getNorthStars(body.northStars);

    if (northStars.length === 0) {
      return NextResponse.json({ times: [] });
    }

    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!mapboxToken) {
      return NextResponse.json({
        times: getEstimatedTravelTimes(body.homeCoords, northStars),
        source: "estimated",
        health: "fallback",
        message: "Mapbox access token is not configured; returned REIE estimated travel times.",
      });
    }

    const response = await fetch(buildMapboxMatrixUrl(body.homeCoords, northStars, mapboxToken), {
      next: { revalidate: 300 },
    });
    const data = (await response.json()) as MatrixResponse;

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Mapbox matrix request failed." },
        { status: response.status }
      );
    }

    return NextResponse.json({ times: getTravelTimes(data, northStars), source: "mapbox", health: "live" });
  } catch (error) {
    console.error("[LOGISTICS] Pulse calculation failed:", error);
    return NextResponse.json({ error: "Failed to calculate pulse." }, { status: 500 });
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/logistics/route.ts
