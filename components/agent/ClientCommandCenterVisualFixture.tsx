import { ChevronDown, ExternalLink, Home } from 'lucide-react';

import styles from './ClientCommandCenter.module.css';

export function ClientCommandCenterVisualFixture() {
  const sections: Array<readonly [string, string, boolean]> = [
    ['Overview', '2 people · 2 properties · 2 transactions', true],
    ['People', 'Jordan Avery · Morgan Avery', false],
    ['Objectives and goals', 'Buyer decision · Financial strategy', false],
    ['Properties', '2 linked properties.', false],
    ['Current information', 'Boulder · Louisville · Context recorded', false],
    ['Readiness', 'Needs information · Ready for review', false],
    ['Buyer', 'Open the existing buyer workspace with this Client in context.', false],
    ['Seller', 'Open the existing seller workspace with this Client in context.', false],
    ['Financial strategy', 'Open the current strategy workspace with this Client in context.', false],
    ['Intelligence', 'Open the existing intelligence workspace with this Client in context.', false],
    ['Transactions', '2 recent transactions.', false],
    ['Outputs', '1 output.', false],
    ['Authorizations', 'Open authorization work with this Client in context.', false],
  ];
  return <main className={`atlas-ds-root atlas-ds-shell-agent ${styles.page}`} data-testid="client-command-center-visual-fixture"><div className={styles.container}>
    <header className={styles.commandHeader}><div className={styles.headerLinks}><a className={styles.utilityLink} href="#fixture"><Home aria-hidden="true" size={16} />Workspace Home</a></div><p className={styles.eyebrow}>Internal certification fixture</p><h1 className={styles.commandTitle}>Jordan Avery</h1><div className={styles.headerMeta}><span>Active</span><span>Jordan Avery · Morgan Avery</span><span>Updated Sep 18, 2026</span></div></header>
    <p className={styles.pageCopy}>Static synthetic interface only. No Client, Property, Transaction, Output, authorization, or request is accessed or created.</p>
    <div className={styles.sectionList}>{sections.map(([title, summary, expanded]) => <section className={`${styles.section} ${expanded ? styles.sectionExpanded : ''}`} key={title}><div className={styles.sectionHeader}><h2 className={styles.sectionHeading}><button aria-controls={`fixture-${title.toLowerCase().replaceAll(' ', '-')}`} aria-expanded={expanded} className={styles.sectionToggle} type="button"><span><span className={styles.sectionTitle}>{title}</span><span className={styles.sectionSummary}>{summary}</span></span><ChevronDown aria-hidden="true" className={styles.chevron} size={20} /></button></h2><a className="atlas-action atlas-action-secondary" href="#fixture">Open<ExternalLink aria-hidden="true" size={16} /></a></div>{expanded ? <div className={styles.sectionContent} id={`fixture-${title.toLowerCase().replaceAll(' ', '-')}`}><div className={styles.overviewGrid}><div><span>People</span><strong>2</strong></div><div><span>Properties</span><strong>2</strong></div><div><span>Transactions</span><strong>2</strong></div><div><span>Readiness</span><strong>Available below</strong></div></div></div> : null}</section>)}</div>
  </div></main>;
}
