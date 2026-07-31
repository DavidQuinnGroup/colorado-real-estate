import { Resend } from 'resend';

type DigestListing = {
  id?: string;
  propertyId?: string;
  mlsId?: string;
  slug?: string;
  address?: string;
  city?: string;
  state?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  image?: string;
  url?: string;
  efficiencyScore?: number;
  resilienceScore?: number;
  altitude?: number;
  soilType?: string;
  hasPolybutyleneRisk?: boolean;
};

type SendEmailOptions = {
  unsubscribeUrl?: string;
  userId?: string;
  source?: string;
  publicBaseUrl?: string;
};

export type RenderedPropertyAlertEmail = {
  subject: string;
  html: string;
  text: string;
  listingCount: number;
};

type NormalizedListing = {
  id: string | null;
  address: string;
  location: string;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  image: string | null;
  url: string;
  efficiencyScore: number | null;
  resilienceScore: number | null;
  reviewSignal: string;
};

type SendEmailSkippedResult = {
  sent: false;
  reason: string;
};

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY for property intelligence email delivery.');
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeText(value: unknown, fallback = '') {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || fallback;
}

function normalizeFiniteNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed;
}

function formatCurrency(value: number | null) {
  if (!value || value <= 0) return 'Price upon request';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | null) {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value);
}

function getReviewSignal(listing: DigestListing) {
  if (listing.hasPolybutyleneRisk) return 'Plumbing Review';

  const soilType = normalizeText(listing.soilType);
  if (soilType) return soilType;

  const altitude = normalizeFiniteNumber(listing.altitude);
  if (altitude && altitude > 0) return `${formatNumber(altitude)} FT`;

  return 'REIE Verified';
}

function getPublicBaseUrl(options: Pick<SendEmailOptions, 'publicBaseUrl'> = {}) {
  const configuredUrl = options.publicBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

function getListingIdentity(listing: DigestListing) {
  return normalizeText(listing.propertyId || listing.id || listing.mlsId || listing.slug) || null;
}

function getListingPathIdentity(listing: DigestListing) {
  return normalizeText(listing.slug || listing.id || listing.propertyId || listing.mlsId) || null;
}

function safeUrl(value: string | undefined, fallback: string, options: Pick<SendEmailOptions, 'publicBaseUrl'> = {}) {
  const trimmed = normalizeText(value);
  if (!trimmed) return fallback;

  try {
    const url = new URL(trimmed, getPublicBaseUrl(options));
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.toString();
  } catch {
    return fallback;
  }

  return fallback;
}

function getListingUrl(listing: DigestListing, options: Pick<SendEmailOptions, 'publicBaseUrl'> = {}) {
  const identity = getListingPathIdentity(listing);
  const baseUrl = getPublicBaseUrl(options);
  const fallback = identity ? `${baseUrl}/properties/${encodeURIComponent(identity)}` : `${baseUrl}/search`;

  return safeUrl(listing.url, fallback, options);
}

function getTrackedListingUrl(listing: NormalizedListing, options: SendEmailOptions) {
  if (!options.userId || !listing.id) return listing.url;

  const trackingUrl = new URL('/api/track-click', getPublicBaseUrl(options));
  trackingUrl.searchParams.set('u', options.userId);
  trackingUrl.searchParams.set('l', listing.id);
  trackingUrl.searchParams.set('src', normalizeText(options.source, 'email').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48) || 'email');
  trackingUrl.searchParams.set('to', listing.url);

  return trackingUrl.toString();
}

function normalizeImageUrl(value: string | undefined, options: Pick<SendEmailOptions, 'publicBaseUrl'> = {}) {
  const normalized = safeUrl(value, '', options);
  return normalized || null;
}

function normalizeListing(listing: DigestListing, options: Pick<SendEmailOptions, 'publicBaseUrl'> = {}): NormalizedListing {
  const state = normalizeText(listing.state, 'CO');
  const city = normalizeText(listing.city);
  const location = [city, state].filter(Boolean).join(', ') || 'Colorado';

  return {
    id: getListingIdentity(listing),
    address: normalizeText(listing.address, 'Colorado property match'),
    location,
    price: normalizeFiniteNumber(listing.price),
    beds: normalizeFiniteNumber(listing.beds),
    baths: normalizeFiniteNumber(listing.baths),
    sqft: normalizeFiniteNumber(listing.sqft),
    image: normalizeImageUrl(listing.image, options),
    url: getListingUrl(listing, options),
    efficiencyScore: normalizeFiniteNumber(listing.efficiencyScore),
    resilienceScore: normalizeFiniteNumber(listing.resilienceScore),
    reviewSignal: getReviewSignal(listing),
  };
}

function renderListingImage(listing: NormalizedListing, url: string) {
  if (!listing.image) return '';

  return `
    <a href="${escapeHtml(url)}" style="display: block; margin: 0 0 16px; text-decoration: none;">
      <img
        src="${escapeHtml(listing.image)}"
        alt="${escapeHtml(listing.address)}"
        width="640"
        style="display: block; width: 100%; max-width: 640px; height: auto; border: 0;"
      />
    </a>
  `;
}

function renderListingCard(listing: NormalizedListing, options: SendEmailOptions) {
  const url = getTrackedListingUrl(listing, options);

  return `
    <tr>
      <td style="padding: 22px 0; border-top: 1px solid #1f2937;">
        ${renderListingImage(listing, url)}
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 28px; line-height: 1; font-weight: 800; font-style: italic; color: #ffffff;">
                ${escapeHtml(formatCurrency(listing.price))}
              </div>
              <div style="margin-top: 10px; font-size: 14px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #ffffff;">
                ${escapeHtml(listing.address)}
              </div>
              <div style="margin-top: 6px; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #8b949e;">
                ${escapeHtml(listing.location)}
              </div>
              <div style="margin-top: 14px; font-size: 13px; color: #cbd5e1;">
                ${escapeHtml(formatNumber(listing.beds))} beds &nbsp; / &nbsp;
                ${escapeHtml(formatNumber(listing.baths))} baths &nbsp; / &nbsp;
                ${escapeHtml(formatNumber(listing.sqft))} sq ft
              </div>
              <div style="margin-top: 14px; font-size: 12px; color: #67e8f9;">
                Efficiency ${escapeHtml(formatNumber(listing.efficiencyScore))} &middot; Resilience ${escapeHtml(formatNumber(listing.resilienceScore))}
              </div>
              <div style="margin-top: 8px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #94a3b8;">
                Review: ${escapeHtml(listing.reviewSignal)}
              </div>
            </td>
            <td style="width: 150px; text-align: right; vertical-align: top;">
              <a href="${escapeHtml(url)}" style="display: inline-block; padding: 12px 16px; background: #ffffff; color: #020617; text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase;">
                View Intel
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function renderFooter(options: SendEmailOptions) {
  const unsubscribeLink = options.unsubscribeUrl
    ? `
      <br />
      <a href="${escapeHtml(safeUrl(options.unsubscribeUrl, `${getPublicBaseUrl(options)}/search`, options))}" style="color: #67e8f9; text-decoration: underline;">
        Unsubscribe from David Quinn Group property intelligence emails
      </a>
    `
    : '';

  return `
    <tr>
      <td style="padding: 24px 0 0; border-top: 1px solid #1f2937; color: #64748b; font-size: 12px; line-height: 1.7;">
        You are receiving this because you saved a search or requested listing intelligence from David Quinn Group.
        ${unsubscribeLink}
      </td>
    </tr>
  `;
}

function renderDigestHtml(listings: NormalizedListing[], options: SendEmailOptions) {
  const cards = listings.slice(0, 8).map((listing) => renderListingCard(listing, options)).join('');

  return `
    <div style="margin: 0; padding: 0; background: #020617; color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #020617;">
        <tr>
          <td align="center" style="padding: 28px 16px;">
            <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 640px; width: 100%;">
              <tr>
                <td style="padding: 26px 0; border-bottom: 1px solid #1f2937;">
                  <div style="font-size: 11px; font-weight: 900; letter-spacing: 0.36em; text-transform: uppercase; color: #67e8f9;">
                    David Quinn Group
                  </div>
                  <h1 style="margin: 14px 0 0; font-size: 34px; line-height: 1; font-weight: 900; font-style: italic; letter-spacing: 0; text-transform: uppercase; color: #ffffff;">
                    Real Estate Intelligence Digest
                  </h1>
                  <p style="margin: 14px 0 0; max-width: 520px; font-size: 14px; line-height: 1.7; color: #94a3b8;">
                    Fresh Colorado property matches filtered through the David Quinn Group intelligence layer.
                  </p>
                </td>
              </tr>
              ${cards}
              ${renderFooter(options)}
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function renderDigestText(listings: NormalizedListing[], options: SendEmailOptions) {
  const lines = [
    'David Quinn Group',
    'Real Estate Intelligence Digest',
    '',
    'Fresh Colorado property matches filtered through the David Quinn Group intelligence layer.',
    '',
    ...listings.slice(0, 8).flatMap((listing, index) => [
      `${index + 1}. ${listing.address}`,
      `Price: ${formatCurrency(listing.price)}`,
      `Location: ${listing.location}`,
      `Details: ${formatNumber(listing.beds)} beds / ${formatNumber(listing.baths)} baths / ${formatNumber(listing.sqft)} sq ft`,
      `Intelligence: Efficiency ${formatNumber(listing.efficiencyScore)} / Resilience ${formatNumber(listing.resilienceScore)}`,
      `Review: ${listing.reviewSignal}`,
      `View: ${getTrackedListingUrl(listing, options)}`,
      '',
    ]),
    'You are receiving this because you saved a search or requested listing intelligence from David Quinn Group.',
  ];

  if (options.unsubscribeUrl) {
    lines.push(`Unsubscribe: ${safeUrl(options.unsubscribeUrl, `${getPublicBaseUrl(options)}/search`, options)}`);
  }

  return lines.join('\n');
}

function getSubject(listingCount: number) {
  return `David Quinn Group: ${listingCount} property intelligence update${listingCount === 1 ? '' : 's'}`;
}

function getReplyTo() {
  const replyTo = normalizeText(process.env.RESEND_REPLY_TO_EMAIL);
  return replyTo || undefined;
}

export function renderPropertyAlertEmail(
  listings: DigestListing[],
  options: SendEmailOptions = {},
): RenderedPropertyAlertEmail | null {
  const normalizedListings = listings.map((listing) => normalizeListing(listing, options)).filter((listing) => listing.id || listing.address);

  if (normalizedListings.length === 0) return null;

  return {
    subject: getSubject(normalizedListings.length),
    html: renderDigestHtml(normalizedListings, options),
    text: renderDigestText(normalizedListings, options),
    listingCount: normalizedListings.length,
  };
}

export async function sendEmail(
  to: string,
  listings: DigestListing[],
  options: SendEmailOptions = {},
): Promise<Awaited<ReturnType<Resend['emails']['send']>> | SendEmailSkippedResult> {
  const recipient = normalizeText(to);
  const rendered = renderPropertyAlertEmail(listings, options);

  if (!recipient || !rendered) {
    return { sent: false, reason: 'missing-recipient-or-listings' };
  }

  return getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'David Quinn Group <alerts@davidquinngroup.com>',
    to: recipient,
    replyTo: getReplyTo(),
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts
