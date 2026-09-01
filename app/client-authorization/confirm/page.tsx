import { cookies } from 'next/headers';

import ClientAuthorizationConfirmationForm from '@/components/client-authorization/ClientAuthorizationConfirmationForm';
import { CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE, createClientAuthorizationSecureConfirmationService } from '@/lib/clientAuthorizationSecureConfirmation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = { robots: { index: false, follow: false } };

export default async function ClientAuthorizationConfirmationPage() {
  let context: Awaited<ReturnType<ReturnType<typeof createClientAuthorizationSecureConfirmationService>['context']>> | null = null;
  try {
    const cookieStore = await cookies();
    context = await createClientAuthorizationSecureConfirmationService(prisma).context(cookieStore.get(CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE)?.value);
  } catch {
    context = null;
  }
  if (context) return <ClientAuthorizationConfirmationForm snapshot={context.snapshot} csrfToken={context.csrfToken} completed={context.completed} />;
  return <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100"><section className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group</p><h1 className="mt-3 text-3xl font-semibold">Confirmation unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-300">This secure confirmation link is unavailable or has expired.</p></section></main>;
}
