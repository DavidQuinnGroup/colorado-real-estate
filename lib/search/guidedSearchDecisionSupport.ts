export type GuidedSearchDecisionInput = {
  city?: string | null;
  price?: number | string | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  propertyType?: string | null;
  status?: string | null;
  hasCoordinates?: boolean | null;
  hasReviewFlag?: boolean | null;
  hasFallbackVisual?: boolean | null;
  reviewSignal?: string | null;
};

export type GuidedSearchDecisionSupport = {
  attentionLabel: string;
  attentionReason: string;
  comparePrompt: string;
  verifyPrompt: string;
  nextStep: string;
  confidenceLevel: 'ready' | 'compare' | 'verify';
};

function getCleanText(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

function getNumericValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function getPropertyTypeLabel(value: string | null | undefined) {
  const propertyType = getCleanText(value);
  return propertyType || 'home';
}

function getAttentionReason(input: GuidedSearchDecisionInput) {
  const city = getCleanText(input.city) || 'this market';
  const propertyType = getPropertyTypeLabel(input.propertyType).toLowerCase();
  const price = getNumericValue(input.price);

  if (input.hasReviewFlag) {
    return 'This result deserves attention because at least one public listing signal should be carried into deeper review.';
  }

  if (price !== null && price >= 2_000_000) {
    return `This ${propertyType} deserves attention because high-value decisions should be compared against market context, condition, and fit before touring.`;
  }

  if (input.hasCoordinates) {
    return `This result is mapped in ${city}, so place, commute, neighborhood context, and nearby alternatives can be compared before opening details.`;
  }

  return `This ${propertyType} is worth a first pass because the listing facts can be compared against your place, budget, and due-diligence priorities.`;
}

function getVerifyPrompt(input: GuidedSearchDecisionInput) {
  if (input.hasFallbackVisual) {
    return 'Verify photography, condition, disclosures, and showing details before relying on the visual presentation.';
  }

  if (input.hasReviewFlag) {
    return 'Verify the flagged public signal, property records, condition history, and professional inspection questions.';
  }

  return 'Verify taxes, HOA, insurance, condition, records, and financing assumptions before deciding this is a fit.';
}

export function buildGuidedSearchDecisionSupport(input: GuidedSearchDecisionInput): GuidedSearchDecisionSupport {
  const reviewSignal = getCleanText(input.reviewSignal);
  const hasReviewFlag = Boolean(input.hasReviewFlag);
  const hasFallbackVisual = Boolean(input.hasFallbackVisual);
  const hasCoordinates = Boolean(input.hasCoordinates);
  const beds = typeof input.beds === 'number' && Number.isFinite(input.beds) ? input.beds : null;
  const baths = typeof input.baths === 'number' && Number.isFinite(input.baths) ? input.baths : null;
  const coreFit = [beds !== null ? `${beds}+ beds` : null, baths !== null ? `${baths}+ baths` : null]
    .filter(Boolean)
    .join(' / ');

  return {
    attentionLabel: hasReviewFlag ? 'Review before touring' : hasCoordinates ? 'Compare location fit' : 'Start with listing facts',
    attentionReason: getAttentionReason(input),
    comparePrompt: coreFit
      ? `Compare ${coreFit}, price, location, and property type against the next best alternatives in this search.`
      : 'Compare price, location, property type, and market alternatives before narrowing to one home.',
    verifyPrompt: getVerifyPrompt({ ...input, hasReviewFlag, hasFallbackVisual }),
    nextStep: hasReviewFlag
      ? 'Open Property Intelligence before asking about timing or tour strategy.'
      : 'Open the property page when this result still fits after comparison.',
    confidenceLevel: hasReviewFlag || hasFallbackVisual ? 'verify' : reviewSignal ? 'compare' : 'ready',
  };
}
