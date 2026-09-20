import {
  AtlasEmptyState,
  AtlasInformationClassLabel,
  AtlasNotice,
  AtlasSurface,
} from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientCaseInformationWorkspace.module.css';

export function ClientInformationPropertyBoundariesVisualFixture() {
  return (
    <main className="atlas-ds-root atlas-ds-shell-agent" data-testid="client-information-property-boundaries-visual-fixture">
      <div className={`atlas-ds-canvas ${styles.page}`}>
        <div className={styles.container}>
          <header className={styles.heading}>
            <div>
              <p className="atlas-ds-label">Project Atlas internal certification fixture</p>
              <h1 className="atlas-ds-page-title">Client Information</h1>
              <p className={styles.introduction}>Static synthetic interface only. No Client Case, Property, relationship, occupancy fact, Objective, Financial Position, or request is accessed or created.</p>
            </div>
            <AtlasInformationClassLabel informationClass="system-status" label="Synthetic visual fixture" />
          </header>

          <AtlasSurface material="floating" data-testid="client-case-information-properties">
            <div className={`${styles.panelHeading} ${styles.contentBoundaryHeading}`}>
              <div>
                <h2 className="atlas-ds-major-section">Properties</h2>
                <p className={styles.metadata}>Search existing PROJECT ATLAS property data and manage durable Case relationship roles. Off-market discovery, provider lookup, and provisional Property creation are deferred.</p>
              </div>
              <AtlasInformationClassLabel informationClass="governed-fact" label="Wave B" />
            </div>
            <AtlasNotice title="Property discovery boundary" tone="information">Stage 1 searches existing property records only. Some found listings may not yet be available to add to a Client Case.</AtlasNotice>
            <AtlasEmptyState title="No linked properties"><p>Add an existing canonical physical Property when a specific Property becomes part of the Client Case. Criteria such as target cities and bedrooms do not create Property anchors.</p></AtlasEmptyState>
          </AtlasSurface>

          <AtlasSurface material="glass" data-testid="client-case-information-property-occupancy">
            <div className={`${styles.panelHeading} ${styles.contentBoundaryHeading}`}>
              <div>
                <h2 className="atlas-ds-major-section">Property / Occupancy Facts</h2>
                <p className={styles.metadata}>Occupancy is property-scoped. Select an existing authorized Client Case property relationship.</p>
              </div>
              <AtlasInformationClassLabel informationClass="governed-fact" />
            </div>
            <AtlasEmptyState title="No property relationship"><p>Attach an authorized Client Case property before recording property-scoped occupancy facts.</p></AtlasEmptyState>
          </AtlasSurface>
        </div>
      </div>
    </main>
  );
}
