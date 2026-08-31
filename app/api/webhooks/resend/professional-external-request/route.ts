import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

import { createProfessionalExternalRequestService } from '@/lib/professionalExternalRequestFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

function verifiedSignature(request: NextRequest, payload: string) {
  const secret = process.env.RESEND_PROFESSIONAL_REQUEST_WEBHOOK_SECRET?.trim();
  const id = request.headers.get('svix-id');
  const timestamp = request.headers.get('svix-timestamp');
  const signatures = request.headers.get('svix-signature');
  if (!secret || !id || !timestamp || !signatures || !/^\d+$/.test(timestamp)) return false;
  const age = Math.abs(Date.now() - Number(timestamp) * 1000);
  if (age > 5 * 60 * 1000) return false;
  const secretBytes = secret.startsWith('whsec_') ? Buffer.from(secret.slice(6), 'base64') : Buffer.from(secret, 'utf8');
  const expected = createHmac('sha256', secretBytes).update(`${id}.${timestamp}.${payload}`).digest('base64');
  return signatures.split(' ').some((entry) => {
    const [, candidate] = entry.split(',');
    if (!candidate) return false;
    const expectedBytes = Buffer.from(expected);
    const candidateBytes = Buffer.from(candidate);
    return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
  });
}

export async function POST(request: NextRequest) {
  const rawPayload = await request.text();
  if (!verifiedSignature(request, rawPayload)) return NextResponse.json({ error: 'Webhook signature rejected.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const payload = JSON.parse(rawPayload) as { type?: string; data?: { email_id?: string } };
    const messageId = payload.data?.email_id;
    if (typeof messageId === 'string' && typeof payload.type === 'string') await createProfessionalExternalRequestService(prisma).applyProviderLifecycle(messageId, payload.type);
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Webhook payload rejected.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }
}
