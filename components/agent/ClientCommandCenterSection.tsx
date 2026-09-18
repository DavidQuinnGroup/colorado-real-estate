'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

import type { ClientCommandCenterSectionId } from './clientCommandCenterTypes';
import styles from './ClientCommandCenter.module.css';

export function ClientCommandCenterSection({ action, children, expanded, id, onToggle, summary, title }: {
  action?: ReactNode;
  children: ReactNode;
  expanded: boolean;
  id: ClientCommandCenterSectionId;
  onToggle: (id: ClientCommandCenterSectionId) => void;
  summary: string;
  title: string;
}) {
  const contentId = `client-command-center-section-${id}`;
  const headingId = `${contentId}-heading`;
  return (
    <section className={`${styles.section} ${expanded ? styles.sectionExpanded : ''}`} data-client-command-center-section={id}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionHeading} id={headingId}><button aria-controls={contentId} aria-expanded={expanded} className={styles.sectionToggle} onClick={() => onToggle(id)} type="button">
          <span><span className={styles.sectionTitle}>{title}</span><span className={styles.sectionSummary}>{summary}</span></span>
          <ChevronDown aria-hidden="true" className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`} size={20} />
        </button></h2>
        {action ? <div className={styles.sectionAction}>{action}</div> : null}
      </div>
      <div aria-labelledby={headingId} className={styles.sectionContent} hidden={!expanded} id={contentId}>{expanded ? children : null}</div>
    </section>
  );
}
