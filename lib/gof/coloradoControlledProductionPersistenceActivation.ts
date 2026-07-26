import {
  GOF_WAVE_3_AUTHORIZATION_SCOPE,
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
  type GofWave3ColoradoPersistenceContract,
  type GofWave3PlannedWriteCounts,
  type GofWave3ProductionState,
} from "./coloradoControlledProductionPersistence.js";

export const GOF_WAVE_3A_VERSION = "GOF_1.0_WAVE_3A_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION_V1";
export const GOF_WAVE_3A_REQUIRED_HEAD = "0ab48fbf680839d024849c89e4ee646fbda5f8f8";
export const GOF_WAVE_3A_REQUIRED_BRANCH = "main";

export type GofWave3aExecutionEnvironment = "production";

export type GofWave3aOperatorAuthorization = Readonly<{
  authorized: true;
  authorizationId: string;
  operatorId: string;
  authorizedAt: string;
  acknowledgesPersistenceNotRetrieval: true;
  acknowledgesNoRelationships: true;
  acknowledgesNoCustomerVisibility: true;
}>;

export type GofWave3aExecutionRequest = Readonly<{
  dryRun: boolean;
  executionScope: typeof GOF_WAVE_3_AUTHORIZATION_SCOPE;
  environment: GofWave3aExecutionEnvironment;
  operatorAuthorization?: GofWave3aOperatorAuthorization | null;
  certifiedCandidateFingerprint: string;
  repository: Readonly<{
    branch: typeof GOF_WAVE_3A_REQUIRED_BRANCH;
    head: typeof GOF_WAVE_3A_REQUIRED_HEAD;
    originMain: typeof GOF_WAVE_3A_REQUIRED_HEAD;
    workingTreeClean: true;
  }>;
}>;

export type GofWave3aPreflightSnapshot = GofWave3ProductionState & Readonly<{
  environment: GofWave3aExecutionEnvironment;
  migrationStatus: "UP_TO_DATE";
  repositoryBaselineMatched: true;
  workingTreeClean: true;
  sprint7ColoradoRetrievalEnabled: boolean;
  existingRecordSetFingerprint: string | null;
  companionConflictCount: number;
}>;

export type GofWave3aTransactionContext = Readonly<{
  contract: GofWave3ColoradoPersistenceContract;
}>;

export type GofWave3aTransactionalPersistencePort = Readonly<{
  readImmediatePreflight(): Promise<GofWave3aPreflightSnapshot>;
  transaction<T>(operation: (tx: GofWave3aTransactionWriter) => Promise<T>): Promise<T>;
}>;

export type GofWave3aTransactionWriter = Readonly<{
  createColoradoObject(context: GofWave3aTransactionContext): Promise<{ id: string }>;
  createAlias(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void>;
  createSource(context: GofWave3aTransactionContext, index: number): Promise<void>;
  createObservation(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void>;
  createEligibility(context: GofWave3aTransactionContext, objectId: string): Promise<void>;
}>;

export type GofWave3aExecutionStatus =
  | "DRY_RUN_READY"
  | "EXECUTED_CREATED"
  | "EXECUTED_IDEMPOTENT_NOOP";

export type GofWave3aExecutionResult = Readonly<{
  version: typeof GOF_WAVE_3A_VERSION;
  status: GofWave3aExecutionStatus;
  dryRun: boolean;
  contract: GofWave3ColoradoPersistenceContract;
  created: GofWave3PlannedWriteCounts;
  deduplicated: GofWave3PlannedWriteCounts;
  relationshipsCreated: 0;
  propertyRelationshipsCreated: 0;
  retrievalEnabled: false;
  customerVisibilityEnabled: false;
  thorntonFingerprintBefore: string | null;
  thorntonFingerprintAfter: string | null;
}>;

const ZERO_COUNTS: GofWave3PlannedWriteCounts = Object.freeze({
  geographicObjects: 0,
  aliases: 0,
  sources: 0,
  observations: 0,
  eligibilityRows: 0,
  relationships: 0,
  propertyRelationships: 0,
});

export function getGofWave3aCertifiedCandidateFingerprint(): string {
  return buildGofWave3ColoradoPersistenceContract().evidenceFingerprint;
}

export async function executeGofWave3aControlledColoradoProductionPersistence(
  request: GofWave3aExecutionRequest,
  port: GofWave3aTransactionalPersistencePort,
): Promise<GofWave3aExecutionResult> {
  const contract = buildGofWave3ColoradoPersistenceContract();
  assertRequestBoundary(request, contract);

  const preflight = await port.readImmediatePreflight();
  assertPreflightBoundary(preflight);

  const dryRun = evaluateGofWave3DryRun(preflight);
  if (request.dryRun) {
    return Object.freeze({
      version: GOF_WAVE_3A_VERSION,
      status: "DRY_RUN_READY",
      dryRun: true,
      contract,
      created: ZERO_COUNTS,
      deduplicated: ZERO_COUNTS,
      relationshipsCreated: 0,
      propertyRelationshipsCreated: 0,
      retrievalEnabled: false,
      customerVisibilityEnabled: false,
      thorntonFingerprintBefore: preflight.thorntonFingerprint,
      thorntonFingerprintAfter: preflight.thorntonFingerprint,
    });
  }

  assertExecutionControls(request);

  if (dryRun.status === "BLOCKED_SCHEMA_OR_DATA_MISMATCH") {
    throw new Error(`GOF Wave 3A preflight blocked: ${dryRun.blockingFailures.join("; ")}`);
  }
  if (dryRun.status === "DRY_RUN_IDEMPOTENT_NOOP") {
    return Object.freeze({
      version: GOF_WAVE_3A_VERSION,
      status: "EXECUTED_IDEMPOTENT_NOOP",
      dryRun: false,
      contract,
      created: ZERO_COUNTS,
      deduplicated: GOF_WAVE_3_WRITE_CEILING,
      relationshipsCreated: 0,
      propertyRelationshipsCreated: 0,
      retrievalEnabled: false,
      customerVisibilityEnabled: false,
      thorntonFingerprintBefore: preflight.thorntonFingerprint,
      thorntonFingerprintAfter: preflight.thorntonFingerprint,
    });
  }

  const context: GofWave3aTransactionContext = Object.freeze({ contract });
  await port.transaction(async (tx) => {
    const object = await tx.createColoradoObject(context);
    for (let index = 0; index < contract.sources.length; index += 1) {
      await tx.createSource(context, index);
    }
    for (let index = 0; index < contract.aliases.length; index += 1) {
      await tx.createAlias(context, object.id, index);
    }
    for (let index = 0; index < contract.observations.length; index += 1) {
      await tx.createObservation(context, object.id, index);
    }
    await tx.createEligibility(context, object.id);
  });

  const postflight = await port.readImmediatePreflight();
  assertPostWriteState(postflight);

  return Object.freeze({
    version: GOF_WAVE_3A_VERSION,
    status: "EXECUTED_CREATED",
    dryRun: false,
    contract,
    created: GOF_WAVE_3_WRITE_CEILING,
    deduplicated: ZERO_COUNTS,
    relationshipsCreated: 0,
    propertyRelationshipsCreated: 0,
    retrievalEnabled: false,
    customerVisibilityEnabled: false,
    thorntonFingerprintBefore: preflight.thorntonFingerprint,
    thorntonFingerprintAfter: postflight.thorntonFingerprint,
  });
}

function assertRequestBoundary(request: GofWave3aExecutionRequest, contract: GofWave3ColoradoPersistenceContract): void {
  if (request.executionScope !== GOF_WAVE_3_AUTHORIZATION_SCOPE) {
    throw new Error("GOF Wave 3A execution scope mismatch.");
  }
  if (request.environment !== "production") {
    throw new Error("GOF Wave 3A requires confirmed production environment.");
  }
  if (request.certifiedCandidateFingerprint !== contract.evidenceFingerprint) {
    throw new Error("GOF Wave 3A certified candidate fingerprint mismatch.");
  }
  if (request.repository.branch !== GOF_WAVE_3A_REQUIRED_BRANCH) {
    throw new Error("GOF Wave 3A repository branch mismatch.");
  }
  if (request.repository.head !== GOF_WAVE_3A_REQUIRED_HEAD || request.repository.originMain !== GOF_WAVE_3A_REQUIRED_HEAD) {
    throw new Error("GOF Wave 3A repository baseline mismatch.");
  }
  if (!request.repository.workingTreeClean) {
    throw new Error("GOF Wave 3A requires a clean working tree.");
  }
  if (contract.object.objectType !== "STATE" || contract.object.canonicalSlug !== "colorado") {
    throw new Error("GOF Wave 3A contract identity mismatch.");
  }
  if (contract.object.lifecycleStatus !== "DRAFT" || contract.object.visibility !== "INTERNAL_ONLY") {
    throw new Error("GOF Wave 3A contract lifecycle or visibility mismatch.");
  }
  if (contract.relationshipsAuthorized || contract.productionRetrievalAuthorized || contract.runtimeActivationAuthorized || contract.customerVisibilityAuthorized) {
    throw new Error("GOF Wave 3A contract contains unauthorized activation boundary.");
  }
}

function assertExecutionControls(request: GofWave3aExecutionRequest): void {
  const authorization = request.operatorAuthorization;
  if (!authorization?.authorized) {
    throw new Error("GOF Wave 3A execution requires explicit operator authorization.");
  }
  if (!authorization.authorizationId.trim() || !authorization.operatorId.trim() || !authorization.authorizedAt.trim()) {
    throw new Error("GOF Wave 3A operator authorization is incomplete.");
  }
  if (!authorization.acknowledgesPersistenceNotRetrieval || !authorization.acknowledgesNoRelationships || !authorization.acknowledgesNoCustomerVisibility) {
    throw new Error("GOF Wave 3A operator did not acknowledge retained prohibitions.");
  }
}

function assertPreflightBoundary(snapshot: GofWave3aPreflightSnapshot): void {
  if (snapshot.environment !== "production") {
    throw new Error("GOF Wave 3A preflight did not confirm production environment.");
  }
  if (snapshot.migrationStatus !== "UP_TO_DATE") {
    throw new Error("GOF Wave 3A preflight requires migrations to be up to date.");
  }
  if (!snapshot.repositoryBaselineMatched || !snapshot.workingTreeClean) {
    throw new Error("GOF Wave 3A preflight requires the certified clean repository baseline.");
  }
  if (snapshot.companionConflictCount !== 0) {
    throw new Error("GOF Wave 3A preflight detected Colorado companion-record conflicts.");
  }
  if (!snapshot.stateEnumPresent) {
    throw new Error("GOF Wave 3A preflight requires STATE enum availability.");
  }
  if (snapshot.thorntonFingerprint !== GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT) {
    throw new Error("GOF Wave 3A preflight detected Thornton fingerprint drift.");
  }
  if (snapshot.sprint7ColoradoRetrievalEnabled) {
    throw new Error("GOF Wave 3A preflight detected unauthorized Colorado retrieval.");
  }
}

function assertPostWriteState(snapshot: GofWave3aPreflightSnapshot): void {
  if (!snapshot.matchingColoradoObject) {
    throw new Error("GOF Wave 3A post-write validation did not find Colorado.");
  }
  if (snapshot.matchingColoradoSupportState !== "COMPLETE") {
    throw new Error("GOF Wave 3A post-write validation did not find a complete companion record set.");
  }
  if (snapshot.geographicRelationshipCount !== 0 || snapshot.propertyGeographicRelationshipCount !== 0) {
    throw new Error("GOF Wave 3A post-write validation detected relationship rows.");
  }
  if (snapshot.thorntonFingerprint !== GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT) {
    throw new Error("GOF Wave 3A post-write validation detected Thornton drift.");
  }
  if (snapshot.sprint7ColoradoRetrievalEnabled) {
    throw new Error("GOF Wave 3A post-write validation detected unauthorized Colorado retrieval.");
  }
}
