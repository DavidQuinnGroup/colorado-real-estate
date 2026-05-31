/**
 * DQG INTELLIGENCE ENGINE: GEO-LOGIC UTILITIES
 * The mathematical heart of the Ritual Manager & Efficiency Engine.
 * Implements Module 4.1 Core Efficiency Logic.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RitualAnchor {
  lat: number;
  lng: number;
  frequency: number; // $W_i$: Days per week (1-7) [cite: 297]
  label?: string;
}

// THE FIXED NORTH STAR (DQG HQ)
// The Authority Center for all relative Front Range calculations.
export const DQG_HQ_COORDS: Coordinates = { lat: 40.0174, lng: -105.2760 };

/**
 * CALCULATE RITUAL PULSE
 * Returns the "Friday Afternoon" travel reality between two points.
 * Factors in the "Front Range Reality" multiplier.
 */
export function calculateRitualPulse(point1: Coordinates, point2: Coordinates) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
  const dLon = (point2.lng - point1.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  /**
   * BOULDER TRAFFIC MULTIPLIER (The "Reality Factor")
   * 2.5 mins/mile accounts for high-stakes commute windows.
   */
  const avgMinsPerMile = 2.5;
  const estMinutes = Math.ceil(distance * avgMinsPerMile);

  return {
    miles: distance.toFixed(1),
    time: estMinutes, // $T_i$ (One-way)
    label: estMinutes < 5 ? "IMMEDIATE" : `${estMinutes} MINS`
  };
}

/**
 * CALCULATE EFFICIENCY SCORE ($E$)
 * Implements Source [cite: 292] proprietary formula:
 * $E = 100 - (\sum (T_i * W_i) / T_{max})$
 * * @param propertyCoords - Target Estate coordinates
 * @param anchors - User defined North Star Anchors [cite: 301]
 * @returns {number} Efficiency Score (0-100)
 */
export function calculateEfficiencyScore(propertyCoords: Coordinates, anchors: RitualAnchor[]): number {
  const T_MAX = 60; // Penalty Threshold Baseline [cite: 298]

  if (!anchors || anchors.length === 0) {
    // Default to DQG HQ Authority if no anchors provided
    const toHQ = calculateRitualPulse(propertyCoords, DQG_HQ_COORDS);
    const roundTrip = toHQ.time * 2;
    // Assume a standard 5-day interaction with the center
    const baselinePenalty = (roundTrip * 5) / T_MAX;
    const score = 100 - baselinePenalty;
    return Math.max(10, Math.min(100, Math.floor(score)));
  }

  // 1. Summation of (Time * Weight) / T_max
  let totalPenalty = 0;

  anchors.forEach(anchor => {
    const pulse = calculateRitualPulse(propertyCoords, { lat: anchor.lat, lng: anchor.lng });
    const roundTripTime = pulse.time * 2; // $T_i$ (Round-trip) [cite: 296]
    const weight = anchor.frequency;     // $W_i$ (1-7 days) [cite: 297]

    totalPenalty += (roundTripTime * weight) / T_MAX;
  });

  // 2. Final Score Application [cite: 292]
  const finalScore = 100 - totalPenalty;

  // 3. Clamping and "Luxury Floor" (Minimum viable score of 15) [cite: 300]
  return Math.floor(Math.max(15, Math.min(100, finalScore)));
}

/**
 * GET TRAVEL NARRATIVE
 * The "Concierge Voice" for the Property Cards[cite: 287].
 * Converts raw Efficiency Math into strategic lifestyle context.
 */
export function getTravelNarrative(score: number): string {
  if (score >= 95) return "Maximum Life ROI: This estate perfectly condenses your ritual perimeter.";
  if (score >= 85) return "High-Efficiency: Minimal impact on your weekly time wealth.";
  if (score >= 70) return "Balanced Proximity: Standard Front Range travel windows apply.";
  return "Time-Tax Warning: Increased luxury space at the cost of ritual transit efficiency.";
}