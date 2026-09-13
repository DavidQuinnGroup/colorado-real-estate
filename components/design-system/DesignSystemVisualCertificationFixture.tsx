'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Download, ExternalLink, Info, LockKeyhole, LoaderCircle, ShieldCheck, Trash2 } from 'lucide-react';

import {
  AtlasButton,
  AtlasEmptyState,
  AtlasErrorState,
  AtlasField,
  AtlasInformationClassLabel,
  AtlasLink,
  AtlasLoadingState,
  AtlasNotice,
  AtlasStatusLabel,
  AtlasSurface,
  type AtlasInformationClass,
  type AtlasNoticeTone,
  type AtlasStatus,
} from './AtlasDesignSystem';
import styles from './DesignSystemVisualCertificationFixture.module.css';

type ShellProfile = 'public' | 'agent' | 'client' | 'admin';

const profileLabels: Record<ShellProfile, string> = {
  public: 'Public', agent: 'Agent', client: 'Client', admin: 'Admin',
};

const informationExamples: Array<{ informationClass: AtlasInformationClass; copy: string }> = [
  { informationClass: 'governed-fact', copy: 'Example source record: 3 bedrooms.' },
  { informationClass: 'assumption', copy: 'Illustrative down payment assumption: 20%.' },
  { informationClass: 'modeled-result', copy: 'Illustrative modeled monthly housing cost.' },
  { informationClass: 'professional-input', copy: 'Example inspection professional input received.' },
  { informationClass: 'editorial-context', copy: 'Example local-context explanation.' },
  { informationClass: 'agent-opinion', copy: 'Example Agent recommendation for discussion.' },
  { informationClass: 'system-status', copy: 'Example analysis status: ready for review.' },
  { informationClass: 'warning-limitation', copy: 'Example source limitation: verification required.' },
];

const statuses: AtlasStatus[] = ['active', 'pending', 'draft', 'complete', 'review-required', 'expired', 'superseded', 'error', 'blocked', 'archived'];

const notices: Array<{ tone: AtlasNoticeTone; title: string; copy: string }> = [
  { tone: 'information', title: 'Information', copy: 'A concise orientation message for an illustrative section.' },
  { tone: 'success', title: 'Success', copy: 'A synthetic review step is complete.' },
  { tone: 'attention', title: 'Attention', copy: 'An illustrative item needs a brief review.' },
  { tone: 'warning', title: 'Warning', copy: 'An illustrative limitation needs verification.' },
  { tone: 'error', title: 'Error', copy: 'An illustrative section could not be loaded.' },
  { tone: 'blocking', title: 'Blocking', copy: 'An illustrative condition prevents the next step.' },
];

function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className={styles.section} id={id}>
      <h2 className="atlas-ds-major-section" id={`${id}-title`}>{title}</h2>
      {children}
    </section>
  );
}

function ProfileSample({ profile }: { profile: ShellProfile }) {
  return (
    <AtlasSurface className={`atlas-ds-shell-${profile} ${styles.profileSample}`} data-profile-sample={profile} material="glass">
      <p className="atlas-ds-label">{profileLabels[profile]} material profile</p>
      <p className="atlas-ds-panel-title">Synthetic review context</p>
      <p className="atlas-ds-metadata">The same primitives expose this profile&apos;s density, material strength, and boundary treatment.</p>
      <AtlasField htmlFor={`fixture-profile-${profile}`} label="Illustrative scope"><input className="atlas-ds-input" id={`fixture-profile-${profile}`} readOnly value="Synthetic only" /></AtlasField>
      <AtlasStatusLabel status="review-required" />
      <AtlasButton tone="primary">Primary action</AtlasButton>
    </AtlasSurface>
  );
}

export function DesignSystemVisualCertificationFixture() {
  const [profile, setProfile] = useState<ShellProfile>('agent');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | null>(null);
  const [motionReduced, setMotionReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setSystemTheme(themeQuery.matches ? 'dark' : 'light');
      setMotionReduced(motionQuery.matches);
    };
    update();
    themeQuery.addEventListener('change', update);
    motionQuery.addEventListener('change', update);
    return () => {
      themeQuery.removeEventListener('change', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return (
    <main className={`atlas-ds-root atlas-ds-shell-${profile} ${styles.fixture}`} data-testid="atlas-visual-certification-fixture">
      <div className="atlas-ds-canvas">
        <header className={styles.header}>
          <div>
            <p className="atlas-ds-label">Project Atlas internal certification fixture</p>
            <h1 className="atlas-ds-page-title">Liquid Glass Design System V1</h1>
            <p className={styles.introduction}>Static synthetic UI only. This route has no data access, workflows, submissions, or external requests.</p>
          </div>
          <AtlasSurface className={styles.statePanel} material="floating">
            <p className="atlas-ds-label">Inspection state</p>
            <p className="atlas-ds-panel-title">{systemTheme ? `System ${systemTheme} theme` : 'System theme'}</p>
            <p className="atlas-ds-metadata">Motion preference: {motionReduced === null ? 'detecting' : motionReduced ? 'reduced' : 'standard'}.</p>
            <p className="atlas-ds-metadata">Use operating-system appearance and motion preferences to inspect actual foundation behavior.</p>
          </AtlasSurface>
        </header>

        <nav aria-label="Fixture sections" className={styles.sectionNavigation}>
          {[
            ['profiles', 'Profiles'], ['typography', 'Type'], ['surfaces', 'Surfaces'], ['actions', 'Actions'],
            ['forms', 'Forms'], ['status', 'Status'], ['information', 'Information'], ['states', 'States'],
            ['analytical', 'Analytical'], ['accessibility', 'Access'],
          ].map(([id, label]) => <AtlasLink href={`#${id}`} key={id}>{label}</AtlasLink>)}
        </nav>

        <div className={styles.content}>
          <Section id="profiles" title="Shell profile comparison">
            <p className={styles.supportingCopy}>Each sample uses the same canonical primitives and profile class so material, density, and spacing differences can be compared directly.</p>
            <div className={styles.controlRow} data-testid="atlas-fixture-profile-controls">
              {(Object.keys(profileLabels) as ShellProfile[]).map((candidate) => (
                <AtlasButton aria-pressed={profile === candidate} key={candidate} onClick={() => setProfile(candidate)} tone={profile === candidate ? 'primary' : 'secondary'}>
                  {profileLabels[candidate]}
                </AtlasButton>
              ))}
            </div>
            <div className={styles.profileGrid}>{(Object.keys(profileLabels) as ShellProfile[]).map((candidate) => <ProfileSample key={candidate} profile={candidate} />)}</div>
          </Section>

          <Section id="typography" title="Typography hierarchy">
            <AtlasSurface className={styles.typeSpecimen} material="reading">
              <p className="atlas-ds-page-title">Illustrative decision workspace</p>
              <p className="atlas-ds-major-section">Major review section</p>
              <p className="atlas-ds-subsection">Evidence and assumptions</p>
              <p className="atlas-ds-panel-title">Panel title remains distinct from context</p>
              <p className={styles.bodyCopy}>This is synthetic design-system content used to compare hierarchy, reading rhythm, and density without implying a real property, client, transaction, or recommendation.</p>
              <p className="atlas-ds-label">Persistent field label</p>
              <p className="atlas-ds-metadata">Metadata remains subordinate to the primary task.</p>
            </AtlasSurface>
          </Section>

          <Section id="surfaces" title="Surface and material hierarchy">
            <div aria-label="Canonical material comparison" className={styles.surfaceGrid} data-testid="atlas-fixture-material-matrix">
              <div className={styles.canvasSample}><p className="atlas-ds-label">Base canvas</p><p className="atlas-ds-metadata">Foundation layer</p></div>
              <AtlasSurface material="glass"><p className="atlas-ds-label">Primary glass</p><p className="atlas-ds-metadata">Spatial context</p></AtlasSurface>
              <AtlasSurface material="glass"><AtlasSurface material="glass"><p className="atlas-ds-label">Secondary glass</p><p className="atlas-ds-metadata">Nested glass removes additional blur.</p></AtlasSurface></AtlasSurface>
              <AtlasSurface material="elevated"><p className="atlas-ds-label">Elevated panel</p><p className="atlas-ds-metadata">Stronger decision grouping</p></AtlasSurface>
              <AtlasSurface material="floating"><p className="atlas-ds-label">Floating / popover surface</p><p className="atlas-ds-metadata">Highest non-modal emphasis</p></AtlasSurface>
              <AtlasSurface material="data"><p className="atlas-ds-label">Solid data surface</p><p className="atlas-ds-metadata">Stable analytical contrast</p></AtlasSurface>
              <AtlasSurface material="reading"><p className="atlas-ds-label">Solid reading surface</p><p className="atlas-ds-metadata">Long-form context</p></AtlasSurface>
              <AtlasSurface material="critical"><p className="atlas-ds-label">Critical high-contrast surface</p><p className="atlas-ds-metadata">Clear exception treatment</p></AtlasSurface>
            </div>
          </Section>

          <Section id="actions" title="Actions and links">
            <div className={styles.actionGrid}>
              <AtlasButton><Check aria-hidden="true" size={16} />Primary action</AtlasButton>
              <AtlasButton tone="secondary">Secondary action</AtlasButton>
              <AtlasButton tone="ghost">Ghost action</AtlasButton>
              <AtlasButton tone="secure"><LockKeyhole aria-hidden="true" size={16} />Secure action</AtlasButton>
              <AtlasButton tone="destructive"><Trash2 aria-hidden="true" size={16} />Destructive action</AtlasButton>
              <AtlasButton aria-label="Illustrative icon action" title="Illustrative icon action"><Info aria-hidden="true" size={18} /></AtlasButton>
              <AtlasButton loading><LoaderCircle aria-hidden="true" size={16} />Loading action</AtlasButton>
              <AtlasButton disabled>Disabled action</AtlasButton>
              <AtlasButton><Download aria-hidden="true" size={16} />Download example</AtlasButton>
            </div>
            <div className={styles.linkRow}>
              <AtlasLink href="#typography">Inline link</AtlasLink>
              <AtlasLink href="#profiles">Navigation link</AtlasLink>
              <AtlasLink href="#external-link-example"><ExternalLink aria-hidden="true" size={15} />External link example</AtlasLink>
              <AtlasLink href="#secure-link-example"><LockKeyhole aria-hidden="true" size={15} />Secure link example</AtlasLink>
            </div>
          </Section>

          <Section id="forms" title="Forms and field states">
            <div className={styles.formGrid}>
              <AtlasField description="Persistent labels and helper text remain available." htmlFor="fixture-empty" label="Purchase price"><input className="atlas-ds-input" id="fixture-empty" placeholder="Enter illustrative amount" /></AtlasField>
              <AtlasField htmlFor="fixture-filled" label="Down payment" unit="%"><input className="atlas-ds-input" id="fixture-filled" defaultValue="20" /></AtlasField>
              <AtlasField htmlFor="fixture-error" label="Holding period" message="Enter an illustrative whole number." messageTone="error" unit="years"><input aria-invalid="true" className="atlas-ds-input" id="fixture-error" defaultValue="" /></AtlasField>
              <AtlasField htmlFor="fixture-read-only" label="Living area" unit="sq ft"><input className="atlas-ds-input" id="fixture-read-only" readOnly value="2,140" /></AtlasField>
              <AtlasField htmlFor="fixture-disabled" label="Review state"><select className="atlas-ds-select" disabled id="fixture-disabled" value="review-required" onChange={() => undefined}><option value="review-required">Review required</option></select></AtlasField>
              <AtlasField htmlFor="fixture-focus" label="Focus inspection"><input className="atlas-ds-input" id="fixture-focus" defaultValue="Tab to inspect actual focus" /></AtlasField>
            </div>
          </Section>

          <Section id="status" title="Status and notice semantics">
            <div className={styles.statusGrid}>{statuses.map((status) => <AtlasStatusLabel key={status} status={status} />)}</div>
            <div className={styles.noticeGrid}>{notices.map((notice) => <AtlasNotice key={notice.tone} title={notice.title} tone={notice.tone}>{notice.copy}</AtlasNotice>)}</div>
          </Section>

          <Section id="information" title="Information classes">
            <p className={styles.syntheticLabel}>Synthetic design-system data</p>
            <div className={styles.informationGrid} data-testid="atlas-fixture-information-classes">
              {informationExamples.map((example) => <AtlasSurface key={example.informationClass} material="data"><AtlasInformationClassLabel informationClass={example.informationClass} /><p className={styles.bodyCopy}>{example.copy}</p></AtlasSurface>)}
            </div>
          </Section>

          <Section id="states" title="Loading, empty, and error states">
            <div className={styles.stateGrid}>
              <AtlasSurface material="data"><p className="atlas-ds-label">Inline action loading</p><AtlasButton loading><LoaderCircle aria-hidden="true" size={16} />Preparing example</AtlasButton></AtlasSurface>
              <AtlasLoadingState><p className="atlas-ds-panel-title">Loading comparison context</p><p className="atlas-ds-metadata">The panel retains its purpose while illustrative content is loading.</p></AtlasLoadingState>
              <AtlasEmptyState title="No comparison scenarios yet"><p className="atlas-ds-metadata">This illustrative area is empty because no synthetic scenarios have been selected.</p><AtlasButton tone="secondary">Illustrative next step</AtlasButton></AtlasEmptyState>
              <AtlasErrorState title="Example analysis could not be loaded"><p className="atlas-ds-metadata">The error describes impact and offers a harmless recovery treatment.</p><AtlasButton tone="secondary"><ArrowUpRight aria-hidden="true" size={16} />Review example</AtlasButton></AtlasErrorState>
            </div>
          </Section>

          <Section id="analytical" title="Analytical primitives">
            <p className={styles.syntheticLabel}>Synthetic design-system data</p>
            <AtlasSurface material="data">
              <div className={styles.metricGrid}>
                <div className="atlas-ds-metric"><p className="atlas-ds-label">Illustrative list price</p><p className="atlas-ds-panel-title">$725,000</p></div>
                <div className="atlas-ds-metric"><p className="atlas-ds-label">Illustrative review state</p><p className="atlas-ds-panel-title">Ready for review</p></div>
                <div className="atlas-ds-metric"><p className="atlas-ds-label">Illustrative scope</p><p className="atlas-ds-panel-title">Synthetic only</p></div>
              </div>
              <div className="atlas-ds-table-wrap"><table><caption className="sr-only">Synthetic material comparison</caption><thead><tr><th>Surface</th><th>Use</th><th>Readability target</th></tr></thead><tbody><tr><td>Glass</td><td>Spatial grouping</td><td>Context remains visible</td></tr><tr><td>Data</td><td>Dense analysis</td><td>Stable contrast</td></tr><tr><td>Reading</td><td>Long explanation</td><td>Comfortable rhythm</td></tr></tbody></table></div>
            </AtlasSurface>
          </Section>

          <Section id="accessibility" title="Accessibility, focus, and motion">
            <AtlasSurface material="reading">
              <p className="atlas-ds-panel-title">Direct inspection sequence</p>
              <ol className={styles.inspectionList}><li>Use the operating system to compare light and dark themes.</li><li>Tab through the profile selector, links, actions, and fields. Focus must remain visible on glass and solid surfaces.</li><li>Use the operating system reduced-motion preference to confirm that nonessential transitions stop without hiding information.</li><li>Resize to approximately 390px wide. Controls should stack, labels remain visible, and the synthetic table remains intentionally scrollable.</li></ol>
              <AtlasButton data-testid="atlas-fixture-focus-target" tone="secondary">Keyboard focus target</AtlasButton>
              <div className={styles.accessibilityRow}><ShieldCheck aria-hidden="true" size={20} /><span>Labels, text, borders, shapes, and semantics support state recognition beyond color alone.</span></div>
            </AtlasSurface>
          </Section>
        </div>
      </div>
    </main>
  );
}
