import type { ClientCaseContextSourcePosture, ClientCaseScenarioValueType, Prisma, PrismaClient } from '@prisma/client';

import { CRITERION_SEMANTICS, FACT_SEMANTICS } from './clientCaseContextSemanticRegistry';
import {
  CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION,
  EFFECTIVE_CONTEXT_RESOLUTION_RULESET_VERSION,
  scenarioCriterionResolutionRule,
  scenarioOnlyResolutionRule,
} from './clientCaseEffectiveContextResolutionRegistry';

export { CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION } from './clientCaseEffectiveContextResolutionRegistry';

export class ClientCaseEffectiveContextError extends Error {
  constructor(
    readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'INVALID_SCENARIO_VERSION' | 'INVALID_PERSISTED_STATE',
    message: string,
  ) {
    super(message);
  }
}

export type EffectiveContextRequest =
  | Readonly<{ mode: 'CANONICAL_BASELINE' }>
  | Readonly<{ mode: 'SCENARIO_VERSION'; scenarioVersionId: string }>;

export type EffectiveContextOrigin =
  | 'CANONICAL_FACT'
  | 'CANONICAL_CRITERION'
  | 'CANONICAL_OBJECTIVE'
  | 'CANONICAL_CASE_PROPERTY'
  | 'SCENARIO_ASSUMPTION'
  | 'SCENARIO_CRITERION'
  | 'SCENARIO_PROPERTY_DISPOSITION'
  | 'SCENARIO_OBJECTIVE_LINK'
  | 'EVIDENCE'
  | 'PROFESSIONAL_INPUT'
  | 'DERIVED';

export type EffectiveContextLimitationCode =
  | 'UNSUPPORTED_RESOLUTION_SEMANTIC'
  | 'CONFLICT_REQUIRES_CAPABILITY_RULE'
  | 'UNVERIFIED_SCENARIO_ASSUMPTION'
  | 'HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT';

type EffectiveContextDatabase = Pick<PrismaClient, 'clientCase' | 'clientCaseScenarioVersion'>;
type JsonValue = Prisma.JsonValue;
type TemporalPosture = Readonly<{ observedAt: Date | null; effectiveAt: Date | null; reviewAfter: Date | null }>;
type ProvenancePosture = Readonly<{
  sourcePosture: ClientCaseContextSourcePosture | null;
  evidenceAdmissionId: string | null;
  professionalInputId: string | null;
  verification: 'RECORDED' | 'EVIDENCE_SUPPORTED' | 'PROFESSIONAL_INPUT_SUPPORTED' | 'HYPOTHETICAL_UNVERIFIED';
}>;

type CanonicalFact = {
  id: string;
  semanticKey: string;
  scope: string;
  scopeReference: string;
  objectiveId: string | null;
  clientCasePropertyId: string | null;
  value: JsonValue;
  sourcePosture: ClientCaseContextSourcePosture;
  evidenceAdmissionId: string | null;
  professionalInputId: string | null;
  observedAt: Date | null;
  effectiveAt: Date | null;
  reviewAfter: Date | null;
  limitation: string | null;
};

type CanonicalCriterion = CanonicalFact;
type CanonicalObjective = { id: string; objectiveType: string; status: string; title: string; createdAt: Date; completedAt: Date | null; archivedAt: Date | null };
type CanonicalPropertyRelationshipRole = { id: string; clientCasePropertyId: string; role: string; status: string; startedAt: Date; endedAt: Date | null; createdBySubject: string };
type CanonicalProperty = { id: string; canonicalPropertyId: string; role: string; createdAt: Date; relationshipRoles: CanonicalPropertyRelationshipRole[] };
type ScenarioAssumption = { id: string; semanticKey: string; valueType: ClientCaseScenarioValueType; value: JsonValue };
type ScenarioCriterion = ScenarioAssumption;
type ScenarioPropertyDisposition = { id: string; clientCasePropertyId: string; disposition: string };
type ScenarioObjectiveLink = { id: string; clientCaseObjectiveId: string };

export type ResolvedInput = Readonly<{
  stableKey: string;
  semanticKey: string;
  value: JsonValue | string;
  valueType: string;
  origin: EffectiveContextOrigin;
  sourceRecordId: string;
  sourceVersionId: string | null;
  scenarioVersionId: string | null;
  provenance: ProvenancePosture;
  temporal: TemporalPosture;
  contributingSourceRecordIds: readonly string[];
  limitations: readonly EffectiveContextLimitationCode[];
}>;

export type EffectiveContext = Readonly<{
  contractVersion: typeof CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION;
  resolutionRulesetVersion: typeof EFFECTIVE_CONTEXT_RESOLUTION_RULESET_VERSION;
  mode: EffectiveContextRequest['mode'];
  clientCase: Readonly<{ id: string; displayName: string; status: string }>;
  scenario: Readonly<{
    id: string;
    name: string;
    status: string;
    currentVersionId: string | null;
    resolvedVersionId: string;
    resolvedVersionNumber: number;
    isHistorical: boolean;
  }> | null;
  objectives: readonly CanonicalObjective[];
  facts: readonly CanonicalFact[];
  criteria: readonly CanonicalCriterion[];
  properties: readonly CanonicalProperty[];
  assumptions: readonly ScenarioAssumption[];
  scenarioCriteria: readonly ScenarioCriterion[];
  propertyDispositions: readonly ScenarioPropertyDisposition[];
  scenarioObjectiveLinks: readonly ScenarioObjectiveLink[];
  resolvedInputs: readonly ResolvedInput[];
  conflicts: readonly [];
  limitations: readonly Readonly<{ code: EffectiveContextLimitationCode; semanticKey: string | null; sourceRecordId: string | null }>[];
  provenanceSummary: Readonly<{ canonicalSourcePostures: readonly ClientCaseContextSourcePosture[]; scenarioVerification: 'HYPOTHETICAL_UNVERIFIED' | null }>;
}>;

function id(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160) {
    throw new ClientCaseEffectiveContextError('INVALID_REQUEST', `${field} is invalid.`);
  }
  return value.trim();
}

function request(value: EffectiveContextRequest): EffectiveContextRequest {
  if (!value || typeof value !== 'object' || !('mode' in value)) {
    throw new ClientCaseEffectiveContextError('INVALID_REQUEST', 'Effective Context request is invalid.');
  }
  if (value.mode === 'CANONICAL_BASELINE') return { mode: 'CANONICAL_BASELINE' };
  if (value.mode === 'SCENARIO_VERSION') return { mode: 'SCENARIO_VERSION', scenarioVersionId: id(value.scenarioVersionId, 'scenarioVersionId') };
  throw new ClientCaseEffectiveContextError('INVALID_REQUEST', 'Effective Context mode is invalid.');
}

function compare(...values: Array<string | number>) {
  return values.map(String).join('\u0000');
}

function temporal(record: Pick<CanonicalFact, 'observedAt' | 'effectiveAt' | 'reviewAfter'>): TemporalPosture {
  return { observedAt: record.observedAt, effectiveAt: record.effectiveAt, reviewAfter: record.reviewAfter };
}

function provenance(record: Pick<CanonicalFact, 'sourcePosture' | 'evidenceAdmissionId' | 'professionalInputId'>): ProvenancePosture {
  const verification = record.evidenceAdmissionId ? 'EVIDENCE_SUPPORTED' : record.professionalInputId ? 'PROFESSIONAL_INPUT_SUPPORTED' : 'RECORDED';
  return { sourcePosture: record.sourcePosture, evidenceAdmissionId: record.evidenceAdmissionId, professionalInputId: record.professionalInputId, verification };
}

function hypotheticalProvenance(): ProvenancePosture {
  return { sourcePosture: null, evidenceAdmissionId: null, professionalInputId: null, verification: 'HYPOTHETICAL_UNVERIFIED' };
}

function canonicalValueType(kind: 'fact' | 'criterion', semanticKey: string) {
  const registry = kind === 'fact' ? FACT_SEMANTICS : CRITERION_SEMANTICS;
  return (registry[semanticKey as keyof typeof registry] as { valueType: string } | undefined)?.valueType ?? null;
}

function assertValueType(value: JsonValue, valueType: string, sourceRecordId: string) {
  const valid =
    (valueType === 'INTEGER' && typeof value === 'number' && Number.isSafeInteger(value)) ||
    (valueType === 'STRING_SET' && Array.isArray(value) && value.every((entry) => typeof entry === 'string')) ||
    (valueType === 'RANGE_CENTS' && !!value && typeof value === 'object' && !Array.isArray(value)) ||
    (valueType === 'MONEY_CENTS' && typeof value === 'number' && Number.isSafeInteger(value)) ||
    (valueType === 'PERCENT_BPS' && typeof value === 'number' && Number.isSafeInteger(value)) ||
    (valueType === 'ENUM' && typeof value === 'string');
  if (!valid) throw new ClientCaseEffectiveContextError('INVALID_PERSISTED_STATE', `Effective Context source ${sourceRecordId} has an incompatible value type.`);
}

function sourceInput(record: CanonicalFact, origin: 'CANONICAL_FACT' | 'CANONICAL_CRITERION'): ResolvedInput | null {
  const valueType = canonicalValueType(origin === 'CANONICAL_FACT' ? 'fact' : 'criterion', record.semanticKey);
  if (!valueType) return null;
  assertValueType(record.value, valueType, record.id);
  return {
    stableKey: `${origin}:${record.semanticKey}:${record.scopeReference}`,
    semanticKey: record.semanticKey,
    value: record.value,
    valueType,
    origin,
    sourceRecordId: record.id,
    sourceVersionId: null,
    scenarioVersionId: null,
    provenance: provenance(record),
    temporal: temporal(record),
    contributingSourceRecordIds: [record.id],
    limitations: [],
  };
}

function canonicalInputs(records: CanonicalFact[], origin: 'CANONICAL_FACT' | 'CANONICAL_CRITERION', limitations: Array<{ code: EffectiveContextLimitationCode; semanticKey: string | null; sourceRecordId: string | null }>) {
  return records.flatMap((record) => {
    const resolved = sourceInput(record, origin);
    if (resolved) return [resolved];
    limitations.push({ code: 'UNSUPPORTED_RESOLUTION_SEMANTIC', semanticKey: record.semanticKey, sourceRecordId: record.id });
    return [];
  });
}

function scenarioInput(record: ScenarioAssumption | ScenarioCriterion, origin: 'SCENARIO_ASSUMPTION' | 'SCENARIO_CRITERION', scenarioVersionId: string, contributingSourceRecordIds: readonly string[] = [record.id]): ResolvedInput {
  assertValueType(record.value, record.valueType, record.id);
  return {
    stableKey: `${origin}:${record.semanticKey}`,
    semanticKey: record.semanticKey,
    value: record.value,
    valueType: record.valueType,
    origin,
    sourceRecordId: record.id,
    sourceVersionId: scenarioVersionId,
    scenarioVersionId,
    provenance: hypotheticalProvenance(),
    temporal: { observedAt: null, effectiveAt: null, reviewAfter: null },
    contributingSourceRecordIds,
    limitations: origin === 'SCENARIO_ASSUMPTION' ? ['UNVERIFIED_SCENARIO_ASSUMPTION'] : [],
  };
}

function baselineContext(clientCase: { id: string; displayName: string; status: string }, objectives: CanonicalObjective[], facts: CanonicalFact[], criteria: CanonicalCriterion[], properties: CanonicalProperty[]): EffectiveContext {
  const limitations: Array<{ code: EffectiveContextLimitationCode; semanticKey: string | null; sourceRecordId: string | null }> = [];
  const factInputs = canonicalInputs(facts, 'CANONICAL_FACT', limitations);
  const criterionInputs = canonicalInputs(criteria, 'CANONICAL_CRITERION', limitations);
  return {
    contractVersion: CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION,
    resolutionRulesetVersion: EFFECTIVE_CONTEXT_RESOLUTION_RULESET_VERSION,
    mode: 'CANONICAL_BASELINE',
    clientCase,
    scenario: null,
    objectives,
    facts,
    criteria,
    properties,
    assumptions: [],
    scenarioCriteria: [],
    propertyDispositions: [],
    scenarioObjectiveLinks: [],
    resolvedInputs: [...factInputs, ...criterionInputs].sort((left, right) => left.stableKey.localeCompare(right.stableKey)),
    conflicts: [],
    limitations,
    provenanceSummary: { canonicalSourcePostures: [...new Set([...facts, ...criteria].map((record) => record.sourcePosture))].sort(), scenarioVerification: null },
  };
}

export function createClientCaseEffectiveContextResolver(prisma: EffectiveContextDatabase) {
  async function canonical(ownerAgentSubject: string, clientCaseId: string) {
    const clientCase = await prisma.clientCase.findFirst({
      where: { id: clientCaseId, ownerAgentSubject },
      select: {
        id: true,
        displayName: true,
        status: true,
        objectives: { select: { id: true, objectiveType: true, status: true, title: true, createdAt: true, completedAt: true, archivedAt: true }, orderBy: { createdAt: 'asc' } },
        facts: { where: { supersededAt: null }, select: { id: true, semanticKey: true, scope: true, scopeReference: true, objectiveId: true, clientCasePropertyId: true, value: true, sourcePosture: true, evidenceAdmissionId: true, professionalInputId: true, observedAt: true, effectiveAt: true, reviewAfter: true, limitation: true }, orderBy: [{ semanticKey: 'asc' }, { scopeReference: 'asc' }, { id: 'asc' }] },
        criteria: { where: { supersededAt: null }, select: { id: true, semanticKey: true, scope: true, scopeReference: true, objectiveId: true, clientCasePropertyId: true, value: true, sourcePosture: true, evidenceAdmissionId: true, professionalInputId: true, observedAt: true, effectiveAt: true, reviewAfter: true, limitation: true }, orderBy: [{ semanticKey: 'asc' }, { scopeReference: 'asc' }, { id: 'asc' }] },
        properties: {
          select: {
            id: true,
            canonicalPropertyId: true,
            role: true,
            createdAt: true,
            relationshipRoles: {
              where: { status: 'ACTIVE' },
              select: { id: true, clientCasePropertyId: true, role: true, status: true, startedAt: true, endedAt: true, createdBySubject: true },
              orderBy: [{ role: 'asc' }, { startedAt: 'asc' }, { id: 'asc' }],
            },
          },
          orderBy: [{ role: 'asc' }, { canonicalPropertyId: 'asc' }, { id: 'asc' }],
        },
      },
    });
    if (!clientCase) throw new ClientCaseEffectiveContextError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    return {
      clientCase: { id: clientCase.id, displayName: clientCase.displayName, status: clientCase.status },
      objectives: [...clientCase.objectives].sort((left, right) => compare(left.createdAt.toISOString(), left.id).localeCompare(compare(right.createdAt.toISOString(), right.id))) as CanonicalObjective[],
      facts: clientCase.facts as CanonicalFact[],
      criteria: clientCase.criteria as CanonicalCriterion[],
      properties: clientCase.properties as CanonicalProperty[],
    };
  }

  return {
    async resolve(ownerAgentSubject: string, clientCaseId: string, rawRequest: EffectiveContextRequest): Promise<EffectiveContext> {
      const parsed = request(rawRequest);
      const base = await canonical(ownerAgentSubject, id(clientCaseId, 'clientCaseId'));
      if (parsed.mode === 'CANONICAL_BASELINE') return baselineContext(base.clientCase, base.objectives, base.facts, base.criteria, base.properties);

      const version = await prisma.clientCaseScenarioVersion.findFirst({
        where: { id: parsed.scenarioVersionId, scenario: { clientCaseId, clientCase: { ownerAgentSubject } } },
        select: {
          id: true,
          versionNumber: true,
          scenarioId: true,
          scenario: { select: { id: true, name: true, status: true, currentVersionId: true, clientCaseId: true } },
          assumptions: { select: { id: true, semanticKey: true, valueType: true, value: true }, orderBy: [{ semanticKey: 'asc' }, { id: 'asc' }] },
          criteria: { select: { id: true, semanticKey: true, valueType: true, value: true }, orderBy: [{ semanticKey: 'asc' }, { id: 'asc' }] },
          propertyDispositions: { select: { id: true, clientCasePropertyId: true, disposition: true }, orderBy: [{ clientCasePropertyId: 'asc' }, { id: 'asc' }] },
          objectiveLinks: { select: { id: true, clientCaseObjectiveId: true }, orderBy: [{ clientCaseObjectiveId: 'asc' }, { id: 'asc' }] },
        },
      });
      if (!version || version.scenario.clientCaseId !== clientCaseId || version.scenarioId !== version.scenario.id) {
        throw new ClientCaseEffectiveContextError('NOT_FOUND', 'The Scenario Version is unavailable to this Agent.');
      }

      const assumptions = version.assumptions as ScenarioAssumption[];
      const scenarioCriteria = version.criteria as ScenarioCriterion[];
      const propertyDispositions = version.propertyDispositions as ScenarioPropertyDisposition[];
      const scenarioObjectiveLinks = version.objectiveLinks as ScenarioObjectiveLink[];
      const propertyIds = new Set(base.properties.map((property) => property.id));
      const objectiveIds = new Set(base.objectives.map((objective) => objective.id));
      if (propertyDispositions.some((entry) => !propertyIds.has(entry.clientCasePropertyId)) || scenarioObjectiveLinks.some((entry) => !objectiveIds.has(entry.clientCaseObjectiveId))) {
        throw new ClientCaseEffectiveContextError('INVALID_PERSISTED_STATE', 'The selected Scenario Version has an invalid Client Case relationship.');
      }

      const limitations: Array<{ code: EffectiveContextLimitationCode; semanticKey: string | null; sourceRecordId: string | null }> = [];
      if (version.scenario.currentVersionId !== version.id) {
        limitations.push({ code: 'HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT', semanticKey: null, sourceRecordId: version.id });
      }
      const resolvedInputs: ResolvedInput[] = canonicalInputs(base.facts, 'CANONICAL_FACT', limitations);
      const scenarioCriteriaByKey = new Map(scenarioCriteria.map((entry) => [entry.semanticKey, entry]));
      for (const canonicalCriterion of base.criteria) {
        const scenarioCriterion = scenarioCriteriaByKey.get(canonicalCriterion.semanticKey);
        const rule = scenarioCriterion ? scenarioCriterionResolutionRule(scenarioCriterion.semanticKey) : null;
        if (!scenarioCriterion || !rule) {
          const resolved = sourceInput(canonicalCriterion, 'CANONICAL_CRITERION');
          if (resolved) resolvedInputs.push(resolved);
          else limitations.push({ code: 'UNSUPPORTED_RESOLUTION_SEMANTIC', semanticKey: canonicalCriterion.semanticKey, sourceRecordId: canonicalCriterion.id });
          continue;
        }
        const canonicalType = canonicalValueType('criterion', canonicalCriterion.semanticKey);
        if (canonicalType !== rule.canonicalValueType || scenarioCriterion.valueType !== rule.scenarioValueType) {
          throw new ClientCaseEffectiveContextError('INVALID_PERSISTED_STATE', 'Scenario Criterion value type is incompatible with its registered resolution rule.');
        }
        const matchingCanonical = base.criteria.filter((entry) => entry.semanticKey === canonicalCriterion.semanticKey);
        if (matchingCanonical.length !== 1) {
          limitations.push({ code: 'CONFLICT_REQUIRES_CAPABILITY_RULE', semanticKey: canonicalCriterion.semanticKey, sourceRecordId: scenarioCriterion.id });
          const resolved = sourceInput(canonicalCriterion, 'CANONICAL_CRITERION');
          if (resolved) resolvedInputs.push(resolved);
          else limitations.push({ code: 'UNSUPPORTED_RESOLUTION_SEMANTIC', semanticKey: canonicalCriterion.semanticKey, sourceRecordId: canonicalCriterion.id });
          continue;
        }
        if (!resolvedInputs.some((entry) => entry.stableKey === `SCENARIO_CRITERION:${scenarioCriterion.semanticKey}`)) {
          resolvedInputs.push(scenarioInput(scenarioCriterion, 'SCENARIO_CRITERION', version.id, [canonicalCriterion.id, scenarioCriterion.id]));
        }
      }
      for (const scenarioCriterion of scenarioCriteria) {
        const criterionRule = scenarioCriterionResolutionRule(scenarioCriterion.semanticKey);
        const scenarioOnlyRule = scenarioOnlyResolutionRule(scenarioCriterion.semanticKey);
        if (scenarioOnlyRule) {
          if (!resolvedInputs.some((entry) => entry.stableKey === `SCENARIO_CRITERION:${scenarioCriterion.semanticKey}`)) {
            resolvedInputs.push(scenarioInput(scenarioCriterion, 'SCENARIO_CRITERION', version.id));
          }
          continue;
        }
        if (!criterionRule) {
          limitations.push({ code: 'UNSUPPORTED_RESOLUTION_SEMANTIC', semanticKey: scenarioCriterion.semanticKey, sourceRecordId: scenarioCriterion.id });
          continue;
        }
        if (!resolvedInputs.some((entry) => entry.stableKey === `SCENARIO_CRITERION:${scenarioCriterion.semanticKey}`)) {
          limitations.push({ code: 'CONFLICT_REQUIRES_CAPABILITY_RULE', semanticKey: scenarioCriterion.semanticKey, sourceRecordId: scenarioCriterion.id });
        }
      }
      for (const assumption of assumptions) {
        if (scenarioOnlyResolutionRule(assumption.semanticKey)) {
          resolvedInputs.push(scenarioInput(assumption, 'SCENARIO_ASSUMPTION', version.id));
        } else {
          limitations.push({ code: 'UNSUPPORTED_RESOLUTION_SEMANTIC', semanticKey: assumption.semanticKey, sourceRecordId: assumption.id });
        }
      }

      return {
        contractVersion: CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION,
        resolutionRulesetVersion: EFFECTIVE_CONTEXT_RESOLUTION_RULESET_VERSION,
        mode: 'SCENARIO_VERSION',
        clientCase: base.clientCase,
        scenario: { id: version.scenario.id, name: version.scenario.name, status: version.scenario.status, currentVersionId: version.scenario.currentVersionId, resolvedVersionId: version.id, resolvedVersionNumber: version.versionNumber, isHistorical: version.scenario.currentVersionId !== version.id },
        objectives: base.objectives,
        facts: base.facts,
        criteria: base.criteria,
        properties: base.properties,
        assumptions,
        scenarioCriteria,
        propertyDispositions,
        scenarioObjectiveLinks,
        resolvedInputs: resolvedInputs.sort((left, right) => left.stableKey.localeCompare(right.stableKey)),
        conflicts: [],
        limitations: limitations.sort((left, right) => compare(left.code, left.semanticKey ?? '', left.sourceRecordId ?? '').localeCompare(compare(right.code, right.semanticKey ?? '', right.sourceRecordId ?? ''))),
        provenanceSummary: { canonicalSourcePostures: [...new Set([...base.facts, ...base.criteria].map((record) => record.sourcePosture))].sort(), scenarioVerification: assumptions.length || scenarioCriteria.length ? 'HYPOTHETICAL_UNVERIFIED' : null },
      };
    },
  };
}
