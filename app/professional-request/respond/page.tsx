import { cookies } from 'next/headers';

import PropertyManagerRentEstimateResponseForm from '@/components/professional-request/PropertyManagerRentEstimateResponseForm';
import { createProfessionalExternalRequestService, EXTERNAL_REQUEST_SESSION_COOKIE } from '@/lib/professionalExternalRequestFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfessionalRequestResponsePage() {
  let context: Awaited<ReturnType<ReturnType<typeof createProfessionalExternalRequestService>['responseContext']>> | null = null;
  try {
    const cookieStore = await cookies();
    context = await createProfessionalExternalRequestService(prisma).responseContext(cookieStore.get(EXTERNAL_REQUEST_SESSION_COOKIE)?.value);
  } catch {}
  if (!context) return <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100"><section className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Project Atlas</p><h1 className="mt-3 text-3xl font-semibold text-white">Request unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-300">This secure request is unavailable or has expired.</p></section></main>;
  return <PropertyManagerRentEstimateResponseForm disclosure={(context.disclosure || {}) as Record<string, unknown>} csrfToken={context.csrfToken} alreadyResponded={context.alreadyResponded} />;
}
