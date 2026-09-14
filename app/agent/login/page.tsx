import Link from 'next/link';

import { AtlasButton, AtlasField, AtlasSurface } from '@/components/design-system/AtlasDesignSystem';
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
    <main className="atlas-ds-root atlas-ds-shell-agent atlas-ds-access-page">
      <section className="atlas-ds-canvas atlas-ds-access-canvas">
        <AtlasSurface className="atlas-ds-access-panel" material="glass">
          <Link href="/" className="atlas-ds-access-brand">David Quinn Group</Link>
          <div className="atlas-ds-access-heading">
            <p className="atlas-ds-access-eyebrow">Internal Agent Preparation</p>
            <h1 className="atlas-ds-access-title" id="agent-login-title">Agent sign in</h1>
            <p className="atlas-ds-access-copy">Enter your individually assigned internal credential.</p>
          </div>
          {hasError ? <p className="atlas-ds-access-alert" role="alert">Agent sign in failed. Check the credential and try again.</p> : null}
          <form action="/agent-auth/login" aria-labelledby="agent-login-title" className="atlas-ds-access-form" data-autofill-identity="atlas-agent-access" id="atlas-agent-access-form" method="post" name="atlas-agent-access">
            <input type="hidden" name="next" value={nextPath} />
            <AtlasField htmlFor="atlas-agent-credential" label="Individual agent credential">
              <input autoComplete="section-atlas-agent-access current-password" className="atlas-ds-input" id="atlas-agent-credential" name="agentCredential" required type="password" />
            </AtlasField>
            <AtlasButton type="submit">Sign in</AtlasButton>
          </form>
        </AtlasSurface>
      </section>
    </main>
  );
}
