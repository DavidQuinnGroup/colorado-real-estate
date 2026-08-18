import Link from 'next/link';

import { sanitizeAgentReturnPath } from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

type AgentLoginPageProps = {
  searchParams?: Promise<{ next?: string; error?: string }>;
};

export default async function AgentLoginPage({ searchParams }: AgentLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = sanitizeAgentReturnPath(resolvedSearchParams?.next);
  const hasError = resolvedSearchParams?.error === '1';

  return (
    <main className="min-h-screen bg-[#06080c] px-6 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <section className="w-full border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white">David Quinn Group</Link>
          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Internal Agent Preparation</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Agent sign in</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">Enter your individually assigned internal credential.</p>
          </div>
          {hasError ? <div className="mt-6 border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100" role="alert">Agent sign in failed. Check the credential and try again.</div> : null}
          <form action="/agent-auth/login" method="post" className="mt-6 space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div>
              <label htmlFor="agentCredential" className="text-sm font-medium text-white/80">Individual agent credential</label>
              <input id="agentCredential" name="agentCredential" type="password" autoComplete="current-password" required className="mt-2 w-full border border-white/15 bg-black/30 px-3 py-3 text-base text-white outline-none transition focus:border-cyan-300" />
            </div>
            <button type="submit" className="w-full bg-cyan-300 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-[#06080c]">Sign in</button>
          </form>
        </section>
      </div>
    </main>
  );
}
