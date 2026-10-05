import { PrismaClient } from '@prisma/client';

import { createClientCaseScenarioService } from '../lib/clientCaseScenarioFoundation';
import { createClientCaseScenarioFinancialContextTransportService } from '../lib/clientCaseScenarioFinancialContextTransport';
import { createClientFinancialPositionService } from '../lib/clientFinancialPositionFoundation';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required.');
const parsedDatabaseUrl = new URL(databaseUrl);
if (!['localhost', '127.0.0.1', '::1'].includes(parsedDatabaseUrl.hostname)) {
  throw new Error('C2C fixture seeding is restricted to a loopback PostgreSQL database.');
}

const owner = (() => {
  const value = process.env.REIE_AGENT_SUBJECT;
  if (!value) throw new Error('REIE_AGENT_SUBJECT is required so the fixture belongs to the local Agent session.');
  return value;
})();

const prisma = new PrismaClient();
const primaryCaseId = 'c2c_local_case_populated';
const noPositionCaseId = 'c2c_local_case_no_position';
const commonObservation = {
  sourcePosture: 'CLIENT_STATED',
  verificationState: 'CLIENT_CONFIRMED',
  asOf: '2026-09-15T18:00:00.000Z',
  observedAt: '2026-09-15T18:00:00.000Z',
  effectiveAt: '2026-09-15T18:00:00.000Z',
  reviewAfter: '2026-12-15T18:00:00.000Z',
};

async function main() {
  if (await prisma.clientCase.findUnique({ where: { id: primaryCaseId }, select: { id: true } })) {
    throw new Error('The C2C local fixture already exists. Recreate the disposable local database to reset it.');
  }

  const property = await prisma.canonicalPhysicalProperty.create({
    data: {
      id: 'c2c_local_property',
      sourceFormattedSitusAddress: '1847 Juniper Lane',
      normalizedSitusAddress: '1847 Juniper Lane',
      city: 'Boulder', state: 'CO', postalCode: '80302', county: 'Boulder',
    },
  });
  await prisma.clientCase.createMany({ data: [
    { id: primaryCaseId, ownerAgentSubject: owner, displayName: 'Morgan and Riley Sample', createdBySubject: owner, idempotencyKey: 'C2C_LOCAL_CASE_POPULATED_V1' },
    { id: noPositionCaseId, ownerAgentSubject: owner, displayName: 'Taylor Sample', createdBySubject: owner, idempotencyKey: 'C2C_LOCAL_CASE_NO_POSITION_V1' },
  ] });
  const [morgan, riley] = await Promise.all([
    prisma.clientCaseParty.create({ data: { id: 'c2c_local_party_morgan', clientCaseId: primaryCaseId, role: 'PRIMARY_CLIENT', displayLabel: 'Morgan Sample' } }),
    prisma.clientCaseParty.create({ data: { id: 'c2c_local_party_riley', clientCaseId: primaryCaseId, role: 'ADDITIONAL_CLIENT', displayLabel: 'Riley Sample' } }),
  ]);
  const caseProperty = await prisma.clientCaseProperty.create({ data: { id: 'c2c_local_case_property', clientCaseId: primaryCaseId, canonicalPropertyId: property.id, role: 'CURRENT_HOME' } });

  const financial = createClientFinancialPositionService(prisma);
  const asset = await financial.createAssetWithInitialObservation(owner, primaryCaseId, {
    entity: { category: 'CASH', label: 'Home purchase funds', clientCasePartyId: morgan.id },
    observation: { ...commonObservation, marketValueCents: 188_000_00, liquidValueCents: 180_000_00, availableAmountCents: 142_000_00 },
  });
  const income = await financial.createIncomeWithInitialObservation(owner, primaryCaseId, {
    entity: { category: 'SALARY', label: 'Morgan annual salary', clientCasePartyId: morgan.id },
    observation: { ...commonObservation, amountCents: 164_000_00, frequency: 'ANNUAL' },
  });
  const liability = await financial.createLiabilityWithInitialObservation(owner, primaryCaseId, {
    entity: { category: 'MORTGAGE', label: 'Current home mortgage', clientCasePartyId: riley.id, clientCasePropertyId: caseProperty.id },
    observation: { ...commonObservation, currentBalanceCents: 312_000_00, monthlyObligationCents: 2_480_00, rateBps: 385 },
  });
  await financial.createQualificationWithInitialObservation(owner, primaryCaseId, {
    entity: { qualificationType: 'PREAPPROVAL', label: 'Conventional loan preapproval' },
    observation: { ...commonObservation, maximumLoanAmountCents: 720_000_00, maximumPurchaseAmountCents: 900_000_00, rateBps: 612, programLabel: '30-year conventional', expiresAt: '2026-11-30T18:00:00.000Z' },
  });
  const constraint = await financial.createConstraintWithInitialObservation(owner, primaryCaseId, {
    entity: { constraintType: 'MINIMUM_RETAINED_LIQUIDITY' },
    observation: { ...commonObservation, amountCents: 75_000_00 },
  });

  const scenarios = createClientCaseScenarioService(prisma);
  const populated = await scenarios.create(owner, primaryCaseId, {
    name: 'Boulder move with liquidity reserve',
    description: 'Evaluate a primary-home move while preserving a deliberate liquidity reserve.',
    initialDefinition: {
      assumptions: [
        { semanticKey: 'TARGET_ACQUISITION_PRICE_CENTS', value: 875_000_00 },
        { semanticKey: 'DOWN_PAYMENT_BPS', value: 2000 },
        { semanticKey: 'HOLDING_PERIOD_MONTHS', value: 84 },
      ],
      criteria: [{ semanticKey: 'TARGET_CITIES', value: ['Boulder', 'Louisville'] }],
      propertyDispositions: [{ clientCasePropertyId: caseProperty.id, disposition: 'SELL' }],
      objectiveIds: [],
    },
  });
  const empty = await scenarios.create(owner, primaryCaseId, {
    name: 'Empty-selection review', description: 'Review a valid Scenario with no selected financial facts.',
    initialDefinition: { assumptions: [{ semanticKey: 'TARGET_ACQUISITION_PRICE_CENTS', value: 760_000_00 }], criteria: [], propertyDispositions: [], objectiveIds: [] },
  });
  const legacy = await scenarios.create(owner, primaryCaseId, {
    name: 'Earlier planning baseline', description: 'An earlier Scenario Version created before Financial Context capture.',
    initialDefinition: { assumptions: [{ semanticKey: 'HOLDING_PERIOD_MONTHS', value: 60 }], criteria: [], propertyDispositions: [], objectiveIds: [] },
  });
  const noPosition = await scenarios.create(owner, noPositionCaseId, {
    name: 'Initial affordability conversation', description: 'A Scenario before a Client Financial Position has been added.',
    initialDefinition: { assumptions: [], criteria: [], propertyDispositions: [], objectiveIds: [] },
  });

  const transport = createClientCaseScenarioFinancialContextTransportService(prisma);
  let context = await transport.readWorkingContext(owner, primaryCaseId, populated.id);
  for (const selection of [
    { domain: 'ASSET', entityId: asset.asset.id, observationId: asset.observation.id },
    { domain: 'INCOME', entityId: income.income.id, observationId: income.observation.id },
    { domain: 'FINANCIAL_CONSTRAINT', entityId: constraint.constraint.id, observationId: constraint.observation.id },
  ]) {
    context = await transport.mutateDraft(owner, primaryCaseId, populated.id, 'SELECT', { expectedRevision: context.draft?.revision ?? null, selection });
  }
  const freeze = await transport.createAnalysisVersion(owner, primaryCaseId, populated.id, {
    expectedDraftRevision: context.draft?.revision ?? null,
    expectedCurrentVersionId: context.scenario.currentVersionId,
    clientMutationKey: 'C2C_LOCAL_FIXTURE_FREEZE_V1',
  });

  await financial.recordAssetObservation(owner, primaryCaseId, asset.asset.id, {
    ...commonObservation,
    asOf: '2026-09-20T18:00:00.000Z', observedAt: '2026-09-20T18:00:00.000Z', effectiveAt: '2026-09-20T18:00:00.000Z',
    marketValueCents: 176_000_00, liquidValueCents: 170_000_00, availableAmountCents: 132_000_00,
    observationKind: 'CORRECTION', supersedesObservationId: asset.observation.id,
  });
  await prisma.clientFinancialConstraintObservation.update({ where: { id: constraint.observation.id }, data: { supersededAt: new Date('2026-09-20T18:00:00.000Z') } });

  const urls = {
    clientCase: `/agent/clients/${primaryCaseId}`,
    scenarioIndex: `/agent/clients/${primaryCaseId}/scenarios`,
    workingPopulated: `/agent/clients/${primaryCaseId}/scenarios/${populated.id}`,
    emptySelection: `/agent/clients/${primaryCaseId}/scenarios/${empty.id}`,
    noFinancialPosition: `/agent/clients/${noPositionCaseId}/scenarios/${noPosition.id}`,
    fixed: `/agent/clients/${primaryCaseId}/scenarios/${populated.id}/versions/${freeze.scenarioVersion.id}`,
    legacy: `/agent/clients/${primaryCaseId}/scenarios/${legacy.id}/versions/${legacy.currentVersionId}`,
  };
  console.log(JSON.stringify({ fixture: 'C2C_LOCAL_SYNTHETIC_V1', owner, urls, comparison: `${urls.fixed} then choose Compare with Current Financial Position`, preFreeze: `${urls.workingPopulated} then choose Create analysis version` }, null, 2));
}

main().finally(() => prisma.$disconnect());
