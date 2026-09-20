import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

import { createClientCaseGovernedSourceService } from '../lib/clientCaseGovernedSourceFoundation';
import { createClientFinancialPositionService } from '../lib/clientFinancialPositionFoundation';
import { CANONICAL_DATABASE_BASELINE } from '../lib/schema/canonicalDatabaseBaseline';
import {
  bootstrapCanonicalDatabaseBaseline,
  disposeCanonicalDatabaseBaseline,
  localBaselineSql,
  localBaselineTarget,
  localHarnessUrl,
  prismaLocalEnvironment,
  runLocalCommand,
} from './canonicalDatabaseBaselineLocal';

const migrationName = '20260920000000_client_financial_position_foundation_v1';

function assertEmptyMigrationDiff(output: string, message: string) {
  assert.ok(output.trim() === '' || output.trim() === '-- This is an empty migration.', message);
}

function historicalLedger(targetDatabase: string) {
  const migrations = readdirSync('prisma/migrations', { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name <= CANONICAL_DATABASE_BASELINE.historicalMigrationCutoff)
    .map((entry) => entry.name)
    .sort();
  const values = migrations.map((name) => {
    const checksum = createHash('sha256').update(readFileSync(`prisma/migrations/${name}/migration.sql`)).digest('hex');
    return `(gen_random_uuid(), '${checksum}', CURRENT_TIMESTAMP, '${name}', '', CURRENT_TIMESTAMP, 0)`;
  });
  localBaselineSql(targetDatabase, `
CREATE TABLE "_prisma_migrations" (
  "id" VARCHAR(36) NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count") VALUES ${values.join(',')};
`);
}

function client(url: string) {
  return new PrismaClient({ datasources: { db: { url } } });
}

async function reject(action: () => Promise<unknown>) {
  await assert.rejects(action);
}

async function seed(prisma: PrismaClient) {
  await prisma.canonicalPhysicalProperty.createMany({ data: [{ id: 'property-a' }, { id: 'property-c' }] });
  await prisma.clientCase.createMany({ data: [
    { id: 'case-a', ownerAgentSubject: 'agent-a', displayName: 'Synthetic A', createdBySubject: 'agent-a', idempotencyKey: 'case-a' },
    { id: 'case-c', ownerAgentSubject: 'agent-a', displayName: 'Synthetic C', createdBySubject: 'agent-a', idempotencyKey: 'case-c' },
    { id: 'case-b', ownerAgentSubject: 'agent-b', displayName: 'Synthetic B', createdBySubject: 'agent-b', idempotencyKey: 'case-b' },
  ] });
  await prisma.clientCaseParty.createMany({ data: [
    { id: 'party-a', clientCaseId: 'case-a', role: 'PRIMARY_CLIENT', displayLabel: 'Synthetic A' },
    { id: 'party-c', clientCaseId: 'case-c', role: 'PRIMARY_CLIENT', displayLabel: 'Synthetic C' },
  ] });
  await prisma.clientCaseProperty.createMany({ data: [
    { id: 'case-property-a', clientCaseId: 'case-a', canonicalPropertyId: 'property-a', role: 'CURRENT_HOME' },
    { id: 'case-property-c', clientCaseId: 'case-c', canonicalPropertyId: 'property-c', role: 'CURRENT_HOME' },
  ] });
  await prisma.evidenceCandidate.create({ data: {
    id: 'evidence-candidate-a', ownerAgentSubject: 'agent-a', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence', claimKind: 'PAYOFF_AMOUNT', candidatePayload: {}, receivedAt: new Date(), provenance: {}, fingerprint: 'evidence-candidate-a', admissionPolicyContext: {},
  } });
  await prisma.evidenceAdmission.create({ data: {
    id: 'evidence-a', ownerAgentSubject: 'agent-a', candidateId: 'evidence-candidate-a', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence', claimKind: 'PAYOFF_AMOUNT', admittedValue: {}, provenance: {}, admissionPolicy: 'AGENT_REVIEWED_MANUAL_EVIDENCE', admittedBySubject: 'agent-a', fingerprint: 'evidence-a',
  } });
  await prisma.evidenceCandidate.create({ data: {
    id: 'evidence-candidate-stale', ownerAgentSubject: 'agent-a', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence-stale', claimKind: 'PAYOFF_AMOUNT', candidatePayload: {}, receivedAt: new Date(), provenance: {}, fingerprint: 'evidence-candidate-stale', admissionPolicyContext: {},
  } });
  await prisma.evidenceAdmission.create({ data: {
    id: 'evidence-stale', ownerAgentSubject: 'agent-a', candidateId: 'evidence-candidate-stale', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence-stale', claimKind: 'PAYOFF_AMOUNT', admittedValue: {}, provenance: {}, admissionPolicy: 'AGENT_REVIEWED_MANUAL_EVIDENCE', admittedBySubject: 'agent-a', fingerprint: 'evidence-stale',
  } });
  await prisma.evidenceCandidate.create({ data: {
    id: 'evidence-candidate-b', ownerAgentSubject: 'agent-b', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence-b', claimKind: 'PAYOFF_AMOUNT', candidatePayload: {}, receivedAt: new Date(), provenance: {}, fingerprint: 'evidence-candidate-b', admissionPolicyContext: {},
  } });
  await prisma.evidenceAdmission.create({ data: {
    id: 'evidence-b', ownerAgentSubject: 'agent-b', candidateId: 'evidence-candidate-b', sourceKind: 'PROFESSIONAL_DOCUMENT', sourceRef: 'synthetic-evidence-b', claimKind: 'PAYOFF_AMOUNT', admittedValue: {}, provenance: {}, admissionPolicy: 'AGENT_REVIEWED_MANUAL_EVIDENCE', admittedBySubject: 'agent-b', fingerprint: 'evidence-b',
  } });
  await prisma.evidenceCandidate.create({ data: {
    id: 'professional-candidate-a', ownerAgentSubject: 'agent-a', sourceKind: 'PROFESSIONAL_REPORTED', sourceRef: 'synthetic-professional', claimKind: 'LENDER_TERM', candidatePayload: {}, receivedAt: new Date(), provenance: {}, fingerprint: 'professional-candidate-a', admissionPolicyContext: {},
  } });
  await prisma.evidenceAdmission.create({ data: {
    id: 'professional-admission-a', ownerAgentSubject: 'agent-a', candidateId: 'professional-candidate-a', sourceKind: 'PROFESSIONAL_REPORTED', sourceRef: 'synthetic-professional', claimKind: 'LENDER_TERM', admittedValue: {}, provenance: {}, admissionPolicy: 'AGENT_REVIEWED_PROFESSIONAL_INPUT', admittedBySubject: 'agent-a', fingerprint: 'professional-admission-a',
  } });
  await prisma.professionalInput.create({ data: { id: 'professional-input-a', ownerAgentSubject: 'agent-a', claimKind: 'LENDER_TERM', versionOrdinal: 1, value: {}, evidenceAdmissionId: 'professional-admission-a', provenance: {}, fingerprint: 'professional-input-a' } });
}

export async function certifyClientFinancialPositionFoundationLocal() {
  assert.equal(process.env.ATLAS_BASELINE_LOCAL_MODE, '1', 'Set ATLAS_BASELINE_LOCAL_MODE=1 to authorize disposable local certification.');
  assert.equal(process.env.ATLAS_BASELINE_RESET, '1', 'Set ATLAS_BASELINE_RESET=1 to authorize disposable local certification.');
  const pathA = localBaselineTarget('atlas_canonical_baseline_path_a', localHarnessUrl('atlas_canonical_baseline_path_a'));
  const pathB = localBaselineTarget('atlas_canonical_baseline_path_b', localHarnessUrl('atlas_canonical_baseline_path_b'));
  let prismaA: PrismaClient | undefined;
  let prismaB: PrismaClient | undefined;
  try {
    bootstrapCanonicalDatabaseBaseline(pathA, { resolveHistoricalMigrations: false });
    historicalLedger(pathA.database);
    prismaA = client(pathA.url);
    await seed(prismaA);
    await prismaA.$disconnect();
    prismaA = undefined;

    const deployA = runLocalCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathA.url));
    assert.match(deployA, new RegExp(`Applying migration[\\s\\S]*${migrationName}`));
    prismaA = client(pathA.url);
    assert.equal(await prismaA.clientFinancialPosition.count(), 0, 'The Path A migration must not create financial business rows.');
    assert.equal(await prismaA.clientCaseGovernedSource.count(), 0, 'The Path A migration must not create governed-source associations.');

    bootstrapCanonicalDatabaseBaseline(pathB, { resolveHistoricalMigrations: false });
    historicalLedger(pathB.database);
    const deployB = runLocalCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathB.url));
    assert.match(deployB, new RegExp(`Applying migration[\\s\\S]*${migrationName}`));
    prismaB = client(pathB.url);
    const freshCounts = await Promise.all([
      prismaB.clientFinancialPosition.count(), prismaB.clientFinancialAsset.count(), prismaB.clientFinancialAssetObservation.count(),
      prismaB.clientFinancialLiability.count(), prismaB.clientFinancialLiabilityObservation.count(), prismaB.clientFinancialIncomeSource.count(),
      prismaB.clientFinancialIncomeObservation.count(), prismaB.clientFinancialQualification.count(), prismaB.clientFinancialQualificationObservation.count(),
      prismaB.clientFinancialConstraint.count(), prismaB.clientFinancialConstraintObservation.count(), prismaB.clientFinancialSource.count(), prismaB.clientCaseGovernedSource.count(),
    ]);
    assert.deepEqual(freshCounts, Array.from({ length: freshCounts.length }, () => 0), 'Fresh Path B Financial Position tables must begin empty.');
    await prismaB.$disconnect();
    prismaB = undefined;

    const convergence = runLocalCommand('npx', ['prisma', 'migrate', 'diff', '--from-url', pathA.url, '--to-url', pathB.url, '--script'], prismaLocalEnvironment(pathA.url));
    assertEmptyMigrationDiff(convergence, 'The existing-data and fresh baseline paths must converge.');

    const governedSources = createClientCaseGovernedSourceService(prismaA);
    const service = createClientFinancialPositionService(prismaA);
    const evidenceAssociation = await governedSources.associateEvidenceToClientCase('agent-a', 'case-a', { evidenceAdmissionId: 'evidence-a' });
    const professionalAssociation = await governedSources.associateProfessionalInputToClientCase('agent-a', 'case-a', { professionalInputId: 'professional-input-a' });
    const caseCEvidenceAssociation = await governedSources.associateEvidenceToClientCase('agent-a', 'case-c', { evidenceAdmissionId: 'evidence-a' });
    assert.deepEqual((await governedSources.listClientCaseGovernedSources('agent-a', 'case-a')).map((source) => source.id).sort(), [evidenceAssociation.id, professionalAssociation.id].sort(), 'Case-scoped source listing must return only explicit eligible associations.');
    assert.equal('admittedValue' in (await governedSources.listClientCaseGovernedSources('agent-a', 'case-a'))[0]!.source, false, 'The governed-source candidate list must not expose Evidence payloads.');
    await reject(() => governedSources.associateEvidenceToClientCase('agent-a', 'case-a', { evidenceAdmissionId: 'evidence-b' }));
    const staleAssociation = await governedSources.associateEvidenceToClientCase('agent-a', 'case-a', { evidenceAdmissionId: 'evidence-stale' });
    await prismaA.evidenceAdmission.update({ where: { id: 'evidence-stale' }, data: { expiresAt: new Date(Date.now() - 1_000) } });
    await reject(() => service.bindFinancialSource('agent-a', 'case-a', { clientCaseGovernedSourceId: staleAssociation.id }));
    await reject(() => service.createAssetWithInitialObservation('agent-b', 'case-b', {
      entity: { category: 'CASH', label: 'Rejected root' },
      observation: { marketValueCents: 1, sourcePosture: 'DOCUMENT_SUPPORTED', verificationState: 'DOCUMENT_SUPPORTED', asOf: '2026-09-20T00:00:00.000Z' },
    }));
    assert.equal(await prismaA.clientFinancialPosition.count({ where: { clientCaseId: 'case-b' } }), 0, 'A failed first save must not leave an empty Financial Position root.');
    const atomicAsset = await service.createAssetWithInitialObservation('agent-a', 'case-c', {
      entity: { category: 'CASH', label: 'Atomic resource', clientCasePartyId: 'party-c' },
      observation: { availableAmountCents: 100, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' },
    });
    const atomicLiability = await service.createLiabilityWithInitialObservation('agent-a', 'case-c', {
      entity: { category: 'MORTGAGE', label: 'Atomic debt', clientCasePropertyId: 'case-property-c' },
      observation: { currentBalanceCents: 100, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' },
    });
    const atomicIncome = await service.createIncomeWithInitialObservation('agent-a', 'case-c', {
      entity: { category: 'SALARY', label: 'Atomic income', clientCasePartyId: 'party-c' },
      observation: { amountCents: 100, frequency: 'MONTHLY', sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' },
    });
    const atomicQualification = await service.createQualificationWithInitialObservation('agent-a', 'case-c', {
      entity: { qualificationType: 'PREAPPROVAL', label: 'Atomic qualification' },
      observation: { maximumLoanAmountCents: 100, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' },
    });
    const atomicConstraint = await service.createConstraintWithInitialObservation('agent-a', 'case-c', {
      entity: { constraintType: 'MINIMUM_RETAINED_LIQUIDITY' },
      observation: { amountCents: 100, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' },
    });
    assert.ok(atomicAsset.asset.id && atomicLiability.liability.id && atomicIncome.income.id && atomicQualification.qualification.id && atomicConstraint.constraint.id, 'Atomic first-save commands must create their typed entity and first observation together.');
    assert.equal(await prismaA.clientFinancialPosition.count({ where: { clientCaseId: 'case-c' } }), 1, 'Atomic first saves must establish one stable Case root.');
    const positionA = await service.ensureClientFinancialPosition('agent-a', 'case-a');
    assert.equal((await service.ensureClientFinancialPosition('agent-a', 'case-a')).id, positionA.id, 'Root ensure must be idempotent.');
    const asset = await service.createAsset('agent-a', 'case-a', { category: 'CASH', label: 'Joint liquid resource' });
    const firstAsset = await service.recordAssetObservation('agent-a', 'case-a', asset.id, { marketValueCents: 50000000, liquidValueCents: 30000000, availableAmountCents: 25000000, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' });
    const secondAsset = await service.recordAssetObservation('agent-a', 'case-a', asset.id, { marketValueCents: 52500000, liquidValueCents: 32500000, availableAmountCents: 25000000, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-21T00:00:00.000Z', supersedesObservationId: firstAsset.id });
    assert.equal((await service.listAssetHistory('agent-a', 'case-a', asset.id)).length, 2);
    assert.equal((await service.getCurrentFinancialPosition('agent-a', 'case-a'))?.assets[0].observations[0].id, secondAsset.id);

    const liability = await service.createLiability('agent-a', 'case-a', { category: 'MORTGAGE', label: 'Current-home mortgage', clientCasePartyId: 'party-a', clientCasePropertyId: 'case-property-a' });
    await service.recordLiabilityObservation('agent-a', 'case-a', liability.id, { currentBalanceCents: 45000000, monthlyObligationCents: 250000, rateBps: 650, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' });
    const income = await service.createIncomeSource('agent-a', 'case-a', { category: 'SALARY', label: 'Primary salary', clientCasePartyId: 'party-a' });
    await service.recordIncomeObservation('agent-a', 'case-a', income.id, { amountCents: 1500000, frequency: 'MONTHLY', sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' });
    const evidenceSource = await service.bindFinancialSource('agent-a', 'case-a', { clientCaseGovernedSourceId: evidenceAssociation.id });
    const qualificationSource = await service.bindFinancialSource('agent-a', 'case-a', { clientCaseGovernedSourceId: professionalAssociation.id });
    const qualification = await service.createQualification('agent-a', 'case-a', { qualificationType: 'PREAPPROVAL', label: 'Synthetic lender qualification' });
    await service.recordQualificationObservation('agent-a', 'case-a', qualification.id, { maximumLoanAmountCents: 70000000, financialSourceId: qualificationSource.id, sourcePosture: 'PROFESSIONAL_PROVIDED', verificationState: 'PROFESSIONAL_CONFIRMED', asOf: '2026-09-20T00:00:00.000Z', effectiveAt: '2026-09-20T00:00:00.000Z', expiresAt: '2026-10-20T00:00:00.000Z' });
    const constraint = await service.createConstraint('agent-a', 'case-a', { constraintType: 'MINIMUM_RETAINED_LIQUIDITY' });
    await service.recordConstraintObservation('agent-a', 'case-a', constraint.id, { amountCents: 10000000, financialSourceId: evidenceSource.id, sourcePosture: 'DOCUMENT_SUPPORTED', verificationState: 'DOCUMENT_SUPPORTED', asOf: '2026-09-20T00:00:00.000Z' });

    await reject(() => service.createAsset('agent-a', 'case-a', { category: 'CASH', label: 'Cross-case party', clientCasePartyId: 'party-c' }));
    await reject(() => service.createLiability('agent-a', 'case-a', { category: 'MORTGAGE', label: 'Cross-case property', clientCasePropertyId: 'case-property-c' }));
    await reject(() => service.recordAssetObservation('agent-a', 'case-c', asset.id, { marketValueCents: 1, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' }));
    await reject(() => service.bindFinancialSource('agent-a', 'case-c', { clientCaseGovernedSourceId: evidenceAssociation.id }));
    await reject(() => service.recordAssetObservation('agent-a', 'case-a', asset.id, { marketValueCents: 1.5, sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' }));
    await reject(() => service.recordAssetObservation('agent-a', 'case-a', asset.id, { marketValueCents: 1, currencyCode: 'CAD', sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', asOf: '2026-09-20T00:00:00.000Z' }));
    await reject(() => service.bindFinancialSource('agent-a', 'case-a', { evidenceAdmissionId: 'evidence-a' }));
    await prismaA.clientCase.update({ where: { id: 'case-c' }, data: { status: 'ARCHIVED' } });
    await reject(() => governedSources.associateEvidenceToClientCase('agent-a', 'case-c', { evidenceAdmissionId: 'evidence-stale' }));

    await assert.rejects(() => prismaA!.$executeRawUnsafe(`INSERT INTO "ClientFinancialLiability" ("id", "clientCaseId", "financialPositionId", "clientCasePropertyId", "category", "label", "createdBySubject") VALUES ('cross-property-sql', 'case-a', '${positionA.id}', 'case-property-c', 'MORTGAGE', 'Cross property', 'agent-a')`));
    await assert.rejects(() => prismaA!.$executeRawUnsafe(`INSERT INTO "ClientCaseGovernedSource" ("id", "clientCaseId", "ownerAgentSubject", "sourceKind", "evidenceAdmissionId", "professionalInputId", "createdBySubject") VALUES ('invalid-governed-source-sql', 'case-a', 'agent-a', 'EVIDENCE', 'evidence-a', 'professional-input-a', 'agent-a')`));
    await assert.rejects(() => prismaA!.$executeRawUnsafe(`INSERT INTO "ClientCaseGovernedSource" ("id", "clientCaseId", "ownerAgentSubject", "sourceKind", "evidenceAdmissionId", "createdBySubject") VALUES ('cross-owner-governed-source-sql', 'case-a', 'agent-a', 'EVIDENCE', 'evidence-b', 'agent-a')`));
    await assert.rejects(() => prismaA!.$executeRawUnsafe(`INSERT INTO "ClientFinancialSource" ("id", "clientCaseId", "financialPositionId", "clientCaseGovernedSourceId", "createdBySubject") VALUES ('cross-case-financial-source-sql', 'case-a', '${positionA.id}', '${caseCEvidenceAssociation.id}', 'agent-a')`));

    const status = runLocalCommand('npx', ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathA.url));
    assert.match(status, /Database schema is up to date!/);
    console.log('[client-financial-position-local] ok: dual-path governed-source reconciliation, zero-backfill, atomic first-save rollback and typed creation, Case/owner/type source integrity, stale and archived rejection, bounded source listing, observation provenance, history/current resolution, and synthetic-only data are certified.');
  } finally {
    await prismaA?.$disconnect();
    await prismaB?.$disconnect();
    disposeCanonicalDatabaseBaseline(pathA);
    disposeCanonicalDatabaseBaseline(pathB);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  certifyClientFinancialPositionFoundationLocal().catch((error) => { console.error(error); process.exitCode = 1; });
}
