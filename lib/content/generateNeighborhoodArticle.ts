/**
 * DQG AI Article Factory.
 * Generates neighborhood intelligence articles from verified REIE location data.
 */

import type { Neighborhood } from "../neighborhoods";
import { formatTimeWealth } from "../utils/formatters";

export type GeneratedNeighborhoodArticle = {
  title: string;
  body: string;
  metadata: {
    city: string;
    efficiency: number;
    neighborhood: string;
    resilience: number;
    primaryAnchor: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAltitudeAdvice(neighborhood: Neighborhood) {
  if (neighborhood.altitude > 6000) {
    return "High-altitude UV-protective window coatings and dual-stage humidification are non-negotiable here.";
  }

  return "Standard Front Range building envelope requirements apply, with drainage, roof age, and mechanical condition still carrying material value risk.";
}

function getSoilProfile(neighborhood: Neighborhood) {
  return neighborhood.soilType || "Bentonite analysis required";
}

function buildArticleBody(neighborhood: Neighborhood, timeSaved: string) {
  const name = escapeHtml(neighborhood.name);
  const primaryAnchor = escapeHtml(neighborhood.primaryAnchor);
  const soilProfile = escapeHtml(getSoilProfile(neighborhood));
  const altitudeAdvice = escapeHtml(getAltitudeAdvice(neighborhood));
  const lifestyleVibe = escapeHtml(neighborhood.lifestyleVibe);

  return `
    <section>
      <h2 class="text-3xl font-black italic uppercase tracking-tighter">The Lifestyle Perimeter</h2>
      <p>
        ${name} is engineered for a ${neighborhood.avgEfficiencyScore} efficiency rating.
        Choosing this location provides a weekly Time ROI of approximately ${timeSaved} when commuting to ${primaryAnchor}.
      </p>
    </section>

    <section class="my-8 border-l-4 border-gold-500 bg-slate-800 p-6 shadow-inner">
      <h3 class="mb-2 text-xs font-bold uppercase tracking-widest text-gold-400">GC-Lens: Structural Resilience</h3>
      <ul class="space-y-2 text-sm text-slate-300">
        <li><strong>Soil Profile:</strong> ${soilProfile}</li>
        <li><strong>Altitude Forensics:</strong> ${altitudeAdvice}</li>
        <li><strong>Area Resilience Score:</strong> ${neighborhood.resilienceScore}/100</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-bold uppercase italic text-white">The Day-in-the-Life Vibe</h2>
      <p>${lifestyleVibe}</p>
    </section>

    <footer class="mt-12 border-t border-slate-700 pt-4">
      <p class="text-[10px] font-bold uppercase italic tracking-widest text-slate-500">
        Verified by David Quinn | 30-Year General Contractor & Strategic Consultant
      </p>
    </footer>
  `;
}

export async function generateNeighborhoodArticle(
  neighborhood: Neighborhood
): Promise<GeneratedNeighborhoodArticle> {
  const timeSaved = formatTimeWealth(neighborhood.avgEfficiencyScore * 3);

  return {
    title: `Strategic Intelligence: ${neighborhood.name}, ${neighborhood.city}`,
    body: buildArticleBody(neighborhood, timeSaved),
    metadata: {
      city: neighborhood.city,
      efficiency: neighborhood.avgEfficiencyScore,
      neighborhood: neighborhood.name,
      resilience: neighborhood.resilienceScore,
      primaryAnchor: neighborhood.primaryAnchor,
    },
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/content/generateNeighborhoodArticle.ts
