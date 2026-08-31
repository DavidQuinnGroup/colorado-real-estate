import { Resend } from 'resend';

export const PROFESSIONAL_EXTERNAL_REQUEST_DELIVERY_GATE = 'PROFESSIONAL_EXTERNAL_REQUEST_CONTINUATION_REQUIRED: CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION' as const;

type ProfessionalExternalRequestEmail = Readonly<{
  recipientEmail: string;
  recipientDisplayName?: string | null;
  propertyLabel: string;
  capability: string;
  deliveryFingerprint: string;
}>;

let resendClient: Resend | null = null;

function baseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com').replace(/\/+$/, '');
}

function html(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function assertProfessionalExternalRequestDeliveryAuthorized() {
  if (!authorized()) throw new Error(PROFESSIONAL_EXTERNAL_REQUEST_DELIVERY_GATE);
}

function authorized() {
  return process.env.PROJECT_ATLAS_CONTROLLED_SYNTHETIC_EMAIL_DELIVERY_AUTHORIZATION === 'AUTHORIZED';
}

function sender() {
  const from = process.env.RESEND_PROFESSIONAL_REQUEST_FROM_EMAIL?.trim();
  if (!from || !process.env.RESEND_API_KEY) throw new Error('Professional external request Resend configuration is unavailable.');
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return { from, client: resendClient };
}

export async function sendProfessionalExternalRequestEmail(input: ProfessionalExternalRequestEmail) {
  assertProfessionalExternalRequestDeliveryAuthorized();
  const requestUrl = new URL('/professional-request/access', baseUrl());
  requestUrl.searchParams.set('token', input.capability);
  const { from, client } = sender();
  const recipient = input.recipientDisplayName ? `${input.recipientDisplayName} <${input.recipientEmail}>` : input.recipientEmail;
  const result = await client.emails.send({
    from,
    to: recipient,
    subject: 'Project Atlas | Property-manager rent estimate request',
    html: `<p>Hello${input.recipientDisplayName ? ` ${html(input.recipientDisplayName)}` : ''},</p><p>Please provide a professional monthly rent estimate for <strong>${html(input.propertyLabel)}</strong>.</p><p><a href="${html(requestUrl.toString())}">Open the secure request</a></p><p>This purpose-bound link expires and is intended only for this request. Do not include documents, account data, or client financial information.</p>`,
    text: `Please provide a professional monthly rent estimate for ${input.propertyLabel}. Open the secure request: ${requestUrl.toString()}\n\nThis purpose-bound link expires and is intended only for this request. Do not include documents, account data, or client financial information.`,
    tags: [{ name: 'project_atlas_type', value: 'professional_external_request' }],
  }, { idempotencyKey: input.deliveryFingerprint });
  if (result.error || !result.data?.id) throw new Error('Professional external request delivery failed.');
  return Object.freeze({ providerMessageId: result.data.id });
}
