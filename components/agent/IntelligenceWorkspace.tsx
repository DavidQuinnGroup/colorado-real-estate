import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, Building2, ChartNoAxesCombined, MapPinned, ShieldCheck } from 'lucide-react';

import { AtlasInformationClassLabel, AtlasSurface } from '@/components/design-system/AtlasDesignSystem';

import styles from './IntelligenceWorkspace.module.css';

const workAreas = [
  { key: 'property', href: '/agent/prepare/property', title: 'Property Intelligence', description: 'Research one supported property, its listing facts, comparative context, and verification needs.', action: 'Analyze property', icon: Building2 },
  { key: 'location', href: '/agent/prepare/place', title: 'Location Intelligence', description: 'Evaluate certified city context, local evidence, and the questions that require direct verification.', action: 'Explore location', icon: MapPinned },
  { key: 'market', href: '/agent/prepare/market', title: 'Market Intelligence', description: 'Review supported market conditions, current observations, evidence posture, and limitations.', action: 'Analyze market', icon: ChartNoAxesCombined },
] as const;

type IntelligenceArea = (typeof workAreas)[number]['key'];

export function IntelligenceContextNavigation({ current }: { current: IntelligenceArea }) {
  return (
    <nav aria-label="Intelligence work areas" className={styles.contextNavigation} data-testid="agent-intelligence-context-navigation">
      <div className={styles.contextNavigationHeading}>
        <Link className={styles.contextHubLink} href="/agent/prepare">Intelligence</Link>
        <p>Move between the distinct Property, Location, and Market analysis work areas.</p>
      </div>
      <div className={styles.contextNavigationLinks}>
        {workAreas.map((area) => (
          <Link aria-current={current === area.key ? 'page' : undefined} className={styles.contextNavigationLink} href={area.href} key={area.href}>
            {area.title.replace(' Intelligence', '')}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function IntelligenceChildPageHeader({ children, current }: { children: ReactNode; current: IntelligenceArea }) {
  return <>{children}<IntelligenceContextNavigation current={current} /></>;
}

export default function IntelligenceWorkspace() {
  return (
    <main className={styles.page} data-testid="agent-intelligence-workspace" data-agent-only="true" data-persistence="false" data-customer-data="false" data-provider-activity="false">
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Project Atlas / Agent Workspace</p>
            <h1 className={styles.title}>Intelligence</h1>
            <p className={styles.introduction}>Bring together property, location, market, comparative, and evidence-aware analysis without changing the underlying analytical contracts.</p>
          </div>
          <p className={styles.scope}>Each workspace stays session-only until its existing workflow explicitly says otherwise. Review evidence and limitations before relying on analytical context.</p>
        </header>

        <nav aria-label="Intelligence work areas" className={styles.contextNavigation} data-testid="agent-intelligence-context-navigation">
          <div className={styles.contextNavigationHeading}>
            <span className={styles.contextHubLink}>Intelligence</span>
            <p>Choose an analytical work area without relying on hidden route knowledge.</p>
          </div>
          <div className={styles.contextNavigationLinks}>
            {workAreas.map((area) => <Link className={styles.contextNavigationLink} href={area.href} key={area.href}>{area.title.replace(' Intelligence', '')}</Link>)}
          </div>
        </nav>

        <section aria-label="Intelligence work areas" className={styles.workAreaGrid}>
          {workAreas.map((area) => {
            const Icon = area.icon;
            return (
              <Link className={`atlas-ds-surface atlas-ds-surface-glass ${styles.workArea}`} href={area.href} key={area.href}>
                <div>
                  <Icon aria-hidden="true" className={styles.workAreaIcon} size={24} />
                  <h2 className={styles.workAreaTitle}>{area.title}</h2>
                  <p className={styles.workAreaCopy}>{area.description}</p>
                </div>
                <span className={styles.workAreaAction}>{area.action} <ArrowRight aria-hidden="true" size={16} /></span>
              </Link>
            );
          })}
        </section>

        <AtlasSurface className={styles.principles} material="reading">
          <div>
            <ShieldCheck aria-hidden="true" className={styles.workAreaIcon} size={20} />
            <h2 className={styles.principlesTitle}>Analytical context with visible provenance</h2>
          </div>
          <ul className={styles.principlesList}>
            <li><AtlasInformationClassLabel informationClass="governed-fact" /></li>
            <li><AtlasInformationClassLabel informationClass="editorial-context" /></li>
            <li><AtlasInformationClassLabel informationClass="warning-limitation" /></li>
          </ul>
        </AtlasSurface>
      </div>
    </main>
  );
}
