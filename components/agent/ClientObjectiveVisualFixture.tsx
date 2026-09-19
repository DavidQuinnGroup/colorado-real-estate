import { Archive, CheckCircle2, Plus } from 'lucide-react';

import { AtlasButton, AtlasField, AtlasInformationClassLabel, AtlasStatusLabel, AtlasSurface } from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientObjectiveVisualFixture.module.css';

const fixtures = [
  { title: 'O0 - No current Objectives', current: [], historical: [] },
  { title: 'O1 - One Buy Objective', current: ['Buy: Replacement primary home'], historical: [] },
  { title: 'O3 - Sell, Buy, Invest', current: ['Sell: Current residence', 'Buy: Replacement primary home', 'Invest: Long-term acquisition'], historical: [] },
  { title: 'O4 - Two Buy Objectives', current: ['Buy: Replacement primary home', 'Buy: Mountain residence'], historical: [] },
  { title: 'OH - Current and historical', current: ['Sell: Current residence'], historical: ['Buy: Prior relocation search - Completed'] },
  { title: 'OL - Legacy Financial Strategy', current: ['Financial Strategy: Existing strategy context'], historical: [] },
] as const;

export function ClientObjectiveVisualFixture() {
  return <main className={`atlas-ds-root atlas-ds-shell-agent ${styles.fixture}`} data-testid="client-objective-visual-fixture"><div className="atlas-ds-canvas">
    <header className={styles.header}><div><p className="atlas-ds-label">Project Atlas internal certification fixture</p><h1 className="atlas-ds-page-title">Client Objectives</h1><p>Static synthetic interface only. No Client Case, Objective, Property, Scenario, Transaction, Output, or request is accessed or created.</p></div><AtlasInformationClassLabel informationClass="system-status" label="Synthetic visual fixture" /></header>
    <AtlasSurface className={styles.createPanel} material="glass"><div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Add Objective</h2><p className="atlas-ds-metadata">Buy, Sell, and Invest are available as new pursuits. Financial Strategy remains an existing capability context.</p></div><AtlasStatusLabel status="pending" label="Synthetic control" /></div><div className={styles.createGrid}><AtlasField htmlFor="fixture-objective-type" label="Pursuit type"><select className="atlas-ds-select" defaultValue="BUY_PRIMARY_HOME" id="fixture-objective-type"><option value="BUY_PRIMARY_HOME">Buy</option><option value="SELL_CURRENT_HOME">Sell</option><option value="INVESTMENT_ACQUISITION">Invest</option></select></AtlasField><AtlasField htmlFor="fixture-objective-label" label="Objective label"><input className="atlas-ds-input" id="fixture-objective-label" placeholder="Describe this pursuit" /></AtlasField><AtlasButton tone="primary"><Plus aria-hidden="true" size={16} />Add Objective</AtlasButton></div></AtlasSurface>
    <div className={styles.fixtureGrid}>{fixtures.map((fixture) => <AtlasSurface className={styles.case} key={fixture.title} material="glass"><div className={styles.panelHeading}><h2 className="atlas-ds-panel-title">{fixture.title}</h2><span className={styles.count}>{fixture.current.length} current</span></div><div className={styles.objectiveGroup}><h3>Current Objectives</h3>{fixture.current.length ? <ul>{fixture.current.map((objective) => <li key={objective}><span>{objective}</span>{objective.startsWith('Financial Strategy') ? <small>Legacy, not creatable</small> : <div><AtlasButton tone="ghost"><CheckCircle2 aria-hidden="true" size={15} />Complete</AtlasButton><AtlasButton tone="ghost"><Archive aria-hidden="true" size={15} />Archive</AtlasButton></div>}</li>)}</ul> : <p>No current Objectives are recorded for this Client.</p>}</div><div className={styles.objectiveGroup}><h3>Historical Objectives</h3>{fixture.historical.length ? <ul>{fixture.historical.map((objective) => <li key={objective}><span>{objective}</span></li>)}</ul> : <p>No historical Objectives are recorded.</p>}</div></AtlasSurface>)}</div>
  </div></main>;
}
