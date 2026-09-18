import styles from './AgentWorkspaceShell.module.css';

const workspaces = ['Buyer', 'Seller', 'Financial Strategy', 'Intelligence'] as const;

export function ClientContextVisualFixture() {
  return <main className="atlas-ds-root atlas-ds-shell-agent" data-testid="client-context-visual-fixture"><section className={styles.contextStrip} aria-label="Client Case context"><div className={styles.contextInner}><p className={styles.contextEyebrow}>Client context</p><h1 className={styles.contextTitle}>Jordan Avery</h1><p className={styles.contextStatus}>Status: ACTIVE · 1 participant</p><a className={styles.contextNavigationLink} href="#fixture">Back to Client</a></div></section><section id="fixture" className={styles.home}><div className={styles.homeInner}><p className={styles.homeEyebrow}>Internal certification fixture</p><h2 className={styles.homeSectionHeading}>Client-scoped workspaces</h2><div className={styles.launchGrid}>{workspaces.map((workspace) => <article className={styles.launchCard} key={workspace}><div><p className={styles.homeEyebrow}>Client context</p><h3 className={styles.launchCardTitle}>{workspace}</h3><p className={styles.launchCardDescription}>Jordan Avery</p></div><a className={styles.contextNavigationLink} href="#fixture">Back to Client</a></article>)}</div></div></section></main>;
}
