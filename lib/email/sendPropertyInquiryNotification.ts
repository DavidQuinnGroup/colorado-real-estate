import { Resend } from 'resend';

type PropertyInquiryNotificationInput = {
  inquiryId: string;
  crmTaskId: string;
  leadEmail: string;
  leadName?: string | null;
  leadPhone?: string | null;
  timelineLabel: string;
  leadTemperature: string;
  notes?: string | null;
  property: {
    id: string;
    mlsId?: string | null;
    slug?: string | null;
    address: string;
    city: string;
    state: string;
    zip?: string | null;
    price?: number | null;
    propertyType?: string | null;
    status?: string | null;
  };
};

type NotificationSkippedResult = {
  sent: false;
  reason: string;
};

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY for property inquiry notification delivery.');
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

function normalizeText(value: unknown, fallback = '') {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || fallback;
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

function getPropertyUrl(input: PropertyInquiryNotificationInput) {
  const identity = normalizeText(input.property.slug || input.property.id || input.property.mlsId);
  return identity ? `${getPublicBaseUrl()}/properties/${encodeURIComponent(identity)}` : `${getPublicBaseUrl()}/search`;
}

function getNotificationRecipient() {
  return normalizeText(process.env.PROPERTY_INQUIRY_NOTIFY_TO || process.env.REIE_INTERNAL_EMAIL);
}

function readBoolean(value: string | undefined) {
  const normalized = String(value || '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n'].includes(normalized)) return false;
  return false;
}

function isDryRunEnabled() {
  return readBoolean(process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN);
}

function getFromEmail() {
  return normalizeText(process.env.RESEND_FROM_EMAIL, 'David Quinn Group <alerts@davidquinngroup.com>');
}

function getReplyTo(input: PropertyInquiryNotificationInput) {
  return normalizeText(input.leadEmail) || normalizeText(process.env.RESEND_REPLY_TO_EMAIL) || undefined;
}

function formatCurrency(value: number | null | undefined) {
  if (!value || value <= 0) return 'Price not recorded';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderRow(label: string, value: unknown) {
  const normalizedValue = normalizeText(value, 'Not recorded');

  return `
    <tr>
      <td style="padding: 8px 0; color: #64748b; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; width: 150px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">
        ${escapeHtml(normalizedValue)}
      </td>
    </tr>
  `;
}

function renderHtml(input: PropertyInquiryNotificationInput) {
  const propertyUrl = getPropertyUrl(input);
  const location = [input.property.city, input.property.state, input.property.zip].filter(Boolean).join(', ');

  return `
    <div style="margin: 0; padding: 0; background: #020617; font-family: Arial, sans-serif; color: #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #020617; padding: 28px 0;">
        <tr>
          <td align="center">
            <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="width: 640px; max-width: 100%; background: #071017; border: 1px solid #1e293b; padding: 28px;">
              <tr>
                <td>
                  <div style="color: #67e8f9; font-size: 11px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase;">
                    REIE Property Inquiry
                  </div>
                  <h1 style="margin: 12px 0 0; color: #ffffff; font-size: 28px; line-height: 1.05; text-transform: uppercase;">
                    ${escapeHtml(input.property.address)}
                  </h1>
                  <p style="margin: 10px 0 0; color: #94a3b8; font-size: 14px;">
                    ${escapeHtml(location || 'Colorado')} / ${escapeHtml(formatCurrency(input.property.price))}
                  </p>

                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top: 24px; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b;">
                    ${renderRow('Lead', input.leadName || input.leadEmail)}
                    ${renderRow('Email', input.leadEmail)}
                    ${renderRow('Phone', input.leadPhone)}
                    ${renderRow('Timeline', input.timelineLabel)}
                    ${renderRow('Temperature', input.leadTemperature)}
                    ${renderRow('MLS', input.property.mlsId)}
                    ${renderRow('Type', input.property.propertyType)}
                    ${renderRow('Status', input.property.status)}
                  </table>

                  ${
                    input.notes
                      ? `<p style="margin: 22px 0 0; color: #cbd5e1; font-size: 14px; line-height: 1.7;">${escapeHtml(input.notes)}</p>`
                      : ''
                  }

                  <div style="margin-top: 26px;">
                    <a href="${escapeHtml(propertyUrl)}" style="display: inline-block; padding: 13px 18px; background: #67e8f9; color: #020617; font-size: 11px; font-weight: 900; letter-spacing: 0.18em; text-decoration: none; text-transform: uppercase;">
                      View Property
                    </a>
                  </div>

                  <p style="margin: 22px 0 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                    CRM task: ${escapeHtml(input.crmTaskId)}<br />
                    Lead interaction: ${escapeHtml(input.inquiryId)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function renderText(input: PropertyInquiryNotificationInput) {
  return [
    'REIE Property Inquiry',
    '',
    input.property.address,
    [input.property.city, input.property.state, input.property.zip].filter(Boolean).join(', '),
    `Price: ${formatCurrency(input.property.price)}`,
    `Lead: ${input.leadName || input.leadEmail}`,
    `Email: ${input.leadEmail}`,
    `Phone: ${input.leadPhone || 'Not recorded'}`,
    `Timeline: ${input.timelineLabel}`,
    `Temperature: ${input.leadTemperature}`,
    `MLS: ${input.property.mlsId || 'Not recorded'}`,
    `Type: ${input.property.propertyType || 'Not recorded'}`,
    `Status: ${input.property.status || 'Not recorded'}`,
    input.notes ? `Notes: ${input.notes}` : '',
    `View: ${getPropertyUrl(input)}`,
    `CRM task: ${input.crmTaskId}`,
    `Lead interaction: ${input.inquiryId}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendPropertyInquiryNotification(
  input: PropertyInquiryNotificationInput,
): Promise<Awaited<ReturnType<Resend['emails']['send']>> | NotificationSkippedResult> {
  const recipient = getNotificationRecipient();

  if (!recipient) {
    return { sent: false, reason: 'missing-property-inquiry-notification-recipient' };
  }

  if (isDryRunEnabled()) {
    return { sent: false, reason: 'property-inquiry-notification-dry-run' };
  }

  return getResendClient().emails.send({
    from: getFromEmail(),
    to: recipient,
    replyTo: getReplyTo(input),
    subject: `REIE ${input.timelineLabel}: ${input.property.address}`,
    html: renderHtml(input),
    text: renderText(input),
  });
}
