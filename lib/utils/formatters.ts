/**
 * DQG INTELLIGENCE ENGINE: FORMATTER UTILITIES
 * Standardizing high-stakes financial and logistical data.
 */

/**
 * LUXURY CURRENCY FORMATTER (Module 1.1.2)
 * Formats: Under $1M -> $750K | Over $1M -> $1.28M
 * Used for Listing Prices, Net Proceeds, and Equity Projections.
 */
export function formatLuxuryPrice(price: number): string {
  if (!price || price === 0) return "$0";

  if (price >= 1000000) {
    // Returns $1.28M format [cite: 73]
    return `$${(price / 1000000).toFixed(2).replace(/\.00$/, '')}M`;
  }

  // Returns $750K format
  return `$${Math.round(price / 1000).toLocaleString()}K`;
}

/**
 * TIME WEALTH FORMATTER (Module 4.3)
 * Converts weekly minutes saved into a "Life ROI" narrative.
 * Example: 270 mins -> "4.5 Hours / Week Saved"
 */
export function formatTimeWealth(weeklyMinutes: number): string {
  if (weeklyMinutes <= 0) return "0 Hours";

  const hours = weeklyMinutes / 60;
  const displayHours = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);

  return `${displayHours} Hours / Week Saved`;
}

/**
 * STRATEGIC PERCENTAGE FORMATTER (Module 9.2)
 * Used for Market Velocity and Efficiency Scores.
 */
export function formatMetric(value: number, suffix: string = '%'): string {
  if (value === undefined || value === null) return '--';
  return `${Math.round(value)}${suffix}`;
}

/**
 * AREA FORMATTER
 * Formats square footage to luxury standards.
 */
export function formatSqFt(sqft: number): string {
  if (!sqft) return '--';
  return `${sqft.toLocaleString()} SqFt`;
}

/**
 * GC-GRADE DATE FORMATTER
 * Used for "Critical Path" timelines in Sell-to-Buy operations.
 */
export function formatStrategicDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date).toUpperCase();
}