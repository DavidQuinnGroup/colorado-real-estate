import { getPrivateSiteAccessConfiguration, sanitizePrivateAccessReturnPath } from '@/lib/privateSiteAccess';

import { AtlasButton, AtlasField, AtlasSurface } from '@/components/design-system/AtlasDesignSystem';

export const dynamic = 'force-dynamic';

export default async function PrivateAccessPage({ searchParams }: { searchParams?: Promise<{ next?: string; error?: string; unavailable?: string }> }) {
  const params = await searchParams;
  const unavailable = params?.unavailable === '1' || getPrivateSiteAccessConfiguration().configurationState === 'MISSING_SECRET';
  const nextPath = sanitizePrivateAccessReturnPath(params?.next);
  return (
    <main className="atlas-ds-root atlas-ds-shell-public atlas-ds-access-page">
      <section className="atlas-ds-canvas atlas-ds-access-canvas">
        <AtlasSurface className="atlas-ds-access-panel" material="glass">
          <div className="atlas-ds-access-heading">
            <p className="atlas-ds-access-eyebrow">Project Atlas</p>
            <h1 className="atlas-ds-access-title" id="private-access-title">Private Development Access</h1>
            <p className="atlas-ds-access-copy">PROJECT ATLAS is currently in private development.</p>
          </div>
          {unavailable ? <p className="atlas-ds-access-alert" data-tone="warning" role="alert">Private access is temporarily unavailable.</p> : null}
          {params?.error === '1' && !unavailable ? <p className="atlas-ds-access-alert" role="alert">Access could not be verified. Please try again.</p> : null}
          {!unavailable ? (
            <form action="/private-access/login" aria-labelledby="private-access-title" className="atlas-ds-access-form" data-autofill-identity="atlas-public-access" id="atlas-public-access-form" method="post" name="atlas-public-access">
              <input type="hidden" name="next" value={nextPath} />
              <AtlasField htmlFor="atlas-public-access-password" label="Private access password">
                <input autoComplete="section-atlas-public-access current-password" className="atlas-ds-input" id="atlas-public-access-password" name="privateAccessSecret" required type="password" />
              </AtlasField>
              <AtlasButton type="submit">Enter PROJECT ATLAS</AtlasButton>
            </form>
          ) : null}
        </AtlasSurface>
      </section>
    </main>
  );
}
