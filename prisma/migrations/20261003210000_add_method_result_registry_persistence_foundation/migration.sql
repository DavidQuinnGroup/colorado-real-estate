-- CreateEnum
CREATE TYPE "MethodResultRegistryLifecycleState" AS ENUM ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'CANDIDATE', 'GOVERNED_BUT_UNADMITTED', 'HELD_PENDING_GOVERNANCE', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY', 'NOT_A_METHOD_PROFESSIONAL_JUDGMENT', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProductResultRoleKind" AS ENUM ('CONSUMER', 'COMMUNICATOR', 'PROJECTION_COMPOSITION');

-- CreateEnum
CREATE TYPE "MethodResultAliasKind" AS ENUM ('CALCULATION_VERSION', 'CALCULATION_CONTRACT', 'CALCULATION_ENGINE', 'LEGACY_IDENTIFIER', 'IMPLEMENTATION_REFERENCE', 'OTHER');

-- CreateEnum
CREATE TYPE "MethodResultAliasAdjudicationState" AS ENUM ('ADJUDICATED', 'HELD', 'UNMAPPED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MethodVersionGovernanceReferenceKind" AS ENUM ('SHARED_PRIMITIVE', 'SHARED_CONTRACT');

-- CreateTable
CREATE TABLE "CanonicalMethod" (
    "id" TEXT NOT NULL,
    "semanticKey" TEXT NOT NULL,
    "semanticLabel" TEXT NOT NULL,
    "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
    "authorityRef" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "supersedesMethodId" TEXT,
    "correctionOfMethodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanonicalMethod_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CanonicalMethod_lineage_exclusive" CHECK (num_nonnulls("supersedesMethodId", "correctionOfMethodId") <= 1),
    CONSTRAINT "CanonicalMethod_no_self_lineage" CHECK ("id" IS DISTINCT FROM "supersedesMethodId" AND "id" IS DISTINCT FROM "correctionOfMethodId")
);

-- CreateTable
CREATE TABLE "CanonicalMethodVersion" (
    "id" TEXT NOT NULL,
    "methodId" TEXT NOT NULL,
    "versionKey" TEXT NOT NULL,
    "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
    "inputContractRef" TEXT,
    "resultContractRef" TEXT,
    "qualification" JSONB NOT NULL,
    "provenance" JSONB NOT NULL,
    "implementationRefs" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3),
    "admittedAt" TIMESTAMP(3),
    "supersedesMethodVersionId" TEXT,
    "correctionOfMethodVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanonicalMethodVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CanonicalMethodVersion_lineage_exclusive" CHECK (num_nonnulls("supersedesMethodVersionId", "correctionOfMethodVersionId") <= 1),
    CONSTRAINT "CanonicalMethodVersion_no_self_lineage" CHECK ("id" IS DISTINCT FROM "supersedesMethodVersionId" AND "id" IS DISTINCT FROM "correctionOfMethodVersionId")
);

-- CreateTable
CREATE TABLE "CanonicalResult" (
    "id" TEXT NOT NULL,
    "semanticKey" TEXT NOT NULL,
    "semanticLabel" TEXT NOT NULL,
    "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
    "authorityRef" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "supersedesResultId" TEXT,
    "correctionOfResultId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanonicalResult_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CanonicalResult_lineage_exclusive" CHECK (num_nonnulls("supersedesResultId", "correctionOfResultId") <= 1),
    CONSTRAINT "CanonicalResult_no_self_lineage" CHECK ("id" IS DISTINCT FROM "supersedesResultId" AND "id" IS DISTINCT FROM "correctionOfResultId")
);

-- CreateTable
CREATE TABLE "CanonicalResultVersion" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "versionKey" TEXT NOT NULL,
    "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
    "qualification" JSONB NOT NULL,
    "contextSnapshot" JSONB NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3),
    "admittedAt" TIMESTAMP(3),
    "supersedesResultVersionId" TEXT,
    "correctionOfResultVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanonicalResultVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CanonicalResultVersion_lineage_exclusive" CHECK (num_nonnulls("supersedesResultVersionId", "correctionOfResultVersionId") <= 1),
    CONSTRAINT "CanonicalResultVersion_no_self_lineage" CHECK ("id" IS DISTINCT FROM "supersedesResultVersionId" AND "id" IS DISTINCT FROM "correctionOfResultVersionId")
);

-- CreateTable
CREATE TABLE "MethodResultProductionEdge" (
    "id" TEXT NOT NULL,
    "methodVersionId" TEXT NOT NULL,
    "resultVersionId" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MethodResultProductionEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalResultOwner" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "productDefinitionRef" TEXT NOT NULL,
    "productDefinitionVersionRef" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CanonicalResultOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductResultRole" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "productDefinitionRef" TEXT NOT NULL,
    "productDefinitionVersionRef" TEXT NOT NULL,
    "role" "ProductResultRoleKind" NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductResultRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MethodResultAlias" (
    "id" TEXT NOT NULL,
    "aliasNamespace" TEXT NOT NULL,
    "aliasKind" "MethodResultAliasKind" NOT NULL,
    "aliasValue" TEXT NOT NULL,
    "adjudicationState" "MethodResultAliasAdjudicationState" NOT NULL,
    "methodId" TEXT,
    "methodVersionId" TEXT,
    "resultId" TEXT,
    "resultVersionId" TEXT,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MethodResultAlias_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MethodResultAlias_target_by_state" CHECK (
      ("adjudicationState" = 'ADJUDICATED' AND num_nonnulls("methodId", "methodVersionId", "resultId", "resultVersionId") = 1)
      OR
      ("adjudicationState" <> 'ADJUDICATED' AND num_nonnulls("methodId", "methodVersionId", "resultId", "resultVersionId") = 0)
    )
);

-- CreateTable
CREATE TABLE "MethodVersionGovernanceReference" (
    "id" TEXT NOT NULL,
    "methodVersionId" TEXT NOT NULL,
    "referenceKind" "MethodVersionGovernanceReferenceKind" NOT NULL,
    "semanticRef" TEXT NOT NULL,
    "versionRef" TEXT,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MethodVersionGovernanceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultVersionConstituent" (
    "id" TEXT NOT NULL,
    "compositeResultVersionId" TEXT NOT NULL,
    "constituentResultVersionId" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "sequence" INTEGER,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResultVersionConstituent_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ResultVersionConstituent_no_self_reference" CHECK ("compositeResultVersionId" <> "constituentResultVersionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalMethod_semanticKey_key" ON "CanonicalMethod"("semanticKey");
CREATE UNIQUE INDEX "CanonicalMethod_integrityFingerprint_key" ON "CanonicalMethod"("integrityFingerprint");
CREATE UNIQUE INDEX "CanonicalMethod_supersedesMethodId_key" ON "CanonicalMethod"("supersedesMethodId");
CREATE UNIQUE INDEX "CanonicalMethod_correctionOfMethodId_key" ON "CanonicalMethod"("correctionOfMethodId");
CREATE INDEX "CanonicalMethod_lifecycleState_idx" ON "CanonicalMethod"("lifecycleState");

CREATE UNIQUE INDEX "CanonicalMethodVersion_integrityFingerprint_key" ON "CanonicalMethodVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "CanonicalMethodVersion_supersedesMethodVersionId_key" ON "CanonicalMethodVersion"("supersedesMethodVersionId");
CREATE UNIQUE INDEX "CanonicalMethodVersion_correctionOfMethodVersionId_key" ON "CanonicalMethodVersion"("correctionOfMethodVersionId");
CREATE INDEX "CanonicalMethodVersion_lifecycleState_idx" ON "CanonicalMethodVersion"("lifecycleState");
CREATE INDEX "CanonicalMethodVersion_methodId_admittedAt_idx" ON "CanonicalMethodVersion"("methodId", "admittedAt");
CREATE UNIQUE INDEX "CanonicalMethodVersion_methodId_versionKey_key" ON "CanonicalMethodVersion"("methodId", "versionKey");

CREATE UNIQUE INDEX "CanonicalResult_semanticKey_key" ON "CanonicalResult"("semanticKey");
CREATE UNIQUE INDEX "CanonicalResult_integrityFingerprint_key" ON "CanonicalResult"("integrityFingerprint");
CREATE UNIQUE INDEX "CanonicalResult_supersedesResultId_key" ON "CanonicalResult"("supersedesResultId");
CREATE UNIQUE INDEX "CanonicalResult_correctionOfResultId_key" ON "CanonicalResult"("correctionOfResultId");
CREATE INDEX "CanonicalResult_lifecycleState_idx" ON "CanonicalResult"("lifecycleState");

CREATE UNIQUE INDEX "CanonicalResultVersion_integrityFingerprint_key" ON "CanonicalResultVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "CanonicalResultVersion_supersedesResultVersionId_key" ON "CanonicalResultVersion"("supersedesResultVersionId");
CREATE UNIQUE INDEX "CanonicalResultVersion_correctionOfResultVersionId_key" ON "CanonicalResultVersion"("correctionOfResultVersionId");
CREATE INDEX "CanonicalResultVersion_lifecycleState_idx" ON "CanonicalResultVersion"("lifecycleState");
CREATE INDEX "CanonicalResultVersion_resultId_admittedAt_idx" ON "CanonicalResultVersion"("resultId", "admittedAt");
CREATE UNIQUE INDEX "CanonicalResultVersion_resultId_versionKey_key" ON "CanonicalResultVersion"("resultId", "versionKey");

CREATE UNIQUE INDEX "MethodResultProductionEdge_resultVersionId_key" ON "MethodResultProductionEdge"("resultVersionId");
CREATE UNIQUE INDEX "MethodResultProductionEdge_integrityFingerprint_key" ON "MethodResultProductionEdge"("integrityFingerprint");
CREATE INDEX "MethodResultProductionEdge_methodVersionId_createdAt_idx" ON "MethodResultProductionEdge"("methodVersionId", "createdAt");

CREATE UNIQUE INDEX "CanonicalResultOwner_resultId_key" ON "CanonicalResultOwner"("resultId");
CREATE UNIQUE INDEX "CanonicalResultOwner_integrityFingerprint_key" ON "CanonicalResultOwner"("integrityFingerprint");
CREATE INDEX "CanonicalResultOwner_productDefinitionRef_productDefinition_idx" ON "CanonicalResultOwner"("productDefinitionRef", "productDefinitionVersionRef");
CREATE UNIQUE INDEX "CanonicalResultOwner_productDefinitionRef_productDefinition_key" ON "CanonicalResultOwner"("productDefinitionRef", "productDefinitionVersionRef", "resultId");

CREATE UNIQUE INDEX "ProductResultRole_integrityFingerprint_key" ON "ProductResultRole"("integrityFingerprint");
CREATE INDEX "ProductResultRole_productDefinitionRef_productDefinitionVer_idx" ON "ProductResultRole"("productDefinitionRef", "productDefinitionVersionRef", "role");
CREATE UNIQUE INDEX "ProductResultRole_resultId_productDefinitionRef_productDefi_key" ON "ProductResultRole"("resultId", "productDefinitionRef", "productDefinitionVersionRef", "role");

CREATE UNIQUE INDEX "MethodResultAlias_integrityFingerprint_key" ON "MethodResultAlias"("integrityFingerprint");
CREATE INDEX "MethodResultAlias_methodId_idx" ON "MethodResultAlias"("methodId");
CREATE INDEX "MethodResultAlias_methodVersionId_idx" ON "MethodResultAlias"("methodVersionId");
CREATE INDEX "MethodResultAlias_resultId_idx" ON "MethodResultAlias"("resultId");
CREATE INDEX "MethodResultAlias_resultVersionId_idx" ON "MethodResultAlias"("resultVersionId");
CREATE UNIQUE INDEX "MethodResultAlias_aliasNamespace_aliasKind_aliasValue_key" ON "MethodResultAlias"("aliasNamespace", "aliasKind", "aliasValue");

CREATE UNIQUE INDEX "MethodVersionGovernanceReference_integrityFingerprint_key" ON "MethodVersionGovernanceReference"("integrityFingerprint");
CREATE INDEX "MethodVersionGovernanceReference_methodVersionId_referenceK_idx" ON "MethodVersionGovernanceReference"("methodVersionId", "referenceKind");

CREATE UNIQUE INDEX "ResultVersionConstituent_integrityFingerprint_key" ON "ResultVersionConstituent"("integrityFingerprint");
CREATE INDEX "ResultVersionConstituent_constituentResultVersionId_idx" ON "ResultVersionConstituent"("constituentResultVersionId");
CREATE UNIQUE INDEX "ResultVersionConstituent_compositeResultVersionId_constitue_key" ON "ResultVersionConstituent"("compositeResultVersionId", "constituentResultVersionId", "roleRef");

-- AddForeignKey
ALTER TABLE "CanonicalMethod" ADD CONSTRAINT "CanonicalMethod_supersedesMethodId_fkey" FOREIGN KEY ("supersedesMethodId") REFERENCES "CanonicalMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalMethod" ADD CONSTRAINT "CanonicalMethod_correctionOfMethodId_fkey" FOREIGN KEY ("correctionOfMethodId") REFERENCES "CanonicalMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalMethodVersion" ADD CONSTRAINT "CanonicalMethodVersion_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "CanonicalMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalMethodVersion" ADD CONSTRAINT "CanonicalMethodVersion_supersedesMethodVersionId_fkey" FOREIGN KEY ("supersedesMethodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalMethodVersion" ADD CONSTRAINT "CanonicalMethodVersion_correctionOfMethodVersionId_fkey" FOREIGN KEY ("correctionOfMethodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResult" ADD CONSTRAINT "CanonicalResult_supersedesResultId_fkey" FOREIGN KEY ("supersedesResultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResult" ADD CONSTRAINT "CanonicalResult_correctionOfResultId_fkey" FOREIGN KEY ("correctionOfResultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResultVersion" ADD CONSTRAINT "CanonicalResultVersion_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResultVersion" ADD CONSTRAINT "CanonicalResultVersion_supersedesResultVersionId_fkey" FOREIGN KEY ("supersedesResultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResultVersion" ADD CONSTRAINT "CanonicalResultVersion_correctionOfResultVersionId_fkey" FOREIGN KEY ("correctionOfResultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultProductionEdge" ADD CONSTRAINT "MethodResultProductionEdge_methodVersionId_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultProductionEdge" ADD CONSTRAINT "MethodResultProductionEdge_resultVersionId_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalResultOwner" ADD CONSTRAINT "CanonicalResultOwner_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductResultRole" ADD CONSTRAINT "ProductResultRole_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultAlias" ADD CONSTRAINT "MethodResultAlias_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "CanonicalMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultAlias" ADD CONSTRAINT "MethodResultAlias_methodVersionId_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultAlias" ADD CONSTRAINT "MethodResultAlias_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "CanonicalResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodResultAlias" ADD CONSTRAINT "MethodResultAlias_resultVersionId_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MethodVersionGovernanceReference" ADD CONSTRAINT "MethodVersionGovernanceReference_methodVersionId_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ResultVersionConstituent" ADD CONSTRAINT "ResultVersionConstituent_compositeResultVersionId_fkey" FOREIGN KEY ("compositeResultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ResultVersionConstituent" ADD CONSTRAINT "ResultVersionConstituent_constituentResultVersionId_fkey" FOREIGN KEY ("constituentResultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Preserve admitted Method semantic identity while allowing formal lifecycle transitions.
CREATE FUNCTION "guardCanonicalMethodImmutability"() RETURNS trigger AS $method_guard$
BEGIN
  IF TG_OP = 'DELETE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Admitted CanonicalMethod rows are immutable';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Formal CanonicalMethod lifecycle cannot return to a mutable state';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND (
    NEW."semanticKey" IS DISTINCT FROM OLD."semanticKey" OR
    NEW."semanticLabel" IS DISTINCT FROM OLD."semanticLabel" OR
    NEW."authorityRef" IS DISTINCT FROM OLD."authorityRef" OR
    NEW."provenance" IS DISTINCT FROM OLD."provenance" OR
    NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint" OR
    NEW."supersedesMethodId" IS DISTINCT FROM OLD."supersedesMethodId" OR
    NEW."correctionOfMethodId" IS DISTINCT FROM OLD."correctionOfMethodId" OR
    NEW."createdAt" IS DISTINCT FROM OLD."createdAt"
  ) THEN
    RAISE EXCEPTION 'Admitted CanonicalMethod semantics are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$method_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalMethod_immutability_guard"
BEFORE UPDATE OR DELETE ON "CanonicalMethod"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalMethodImmutability"();

-- Preserve admitted MethodVersion semantics while allowing formal lifecycle transitions.
CREATE FUNCTION "guardCanonicalMethodVersionImmutability"() RETURNS trigger AS $method_version_guard$
BEGIN
  IF TG_OP = 'DELETE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Admitted CanonicalMethodVersion rows are immutable';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Formal CanonicalMethodVersion lifecycle cannot return to a mutable state';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND (
    NEW."methodId" IS DISTINCT FROM OLD."methodId" OR
    NEW."versionKey" IS DISTINCT FROM OLD."versionKey" OR
    NEW."inputContractRef" IS DISTINCT FROM OLD."inputContractRef" OR
    NEW."resultContractRef" IS DISTINCT FROM OLD."resultContractRef" OR
    NEW."qualification" IS DISTINCT FROM OLD."qualification" OR
    NEW."provenance" IS DISTINCT FROM OLD."provenance" OR
    NEW."implementationRefs" IS DISTINCT FROM OLD."implementationRefs" OR
    NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint" OR
    NEW."effectiveAt" IS DISTINCT FROM OLD."effectiveAt" OR
    NEW."admittedAt" IS DISTINCT FROM OLD."admittedAt" OR
    NEW."supersedesMethodVersionId" IS DISTINCT FROM OLD."supersedesMethodVersionId" OR
    NEW."correctionOfMethodVersionId" IS DISTINCT FROM OLD."correctionOfMethodVersionId" OR
    NEW."createdAt" IS DISTINCT FROM OLD."createdAt" OR
    NEW."immutableAt" IS DISTINCT FROM OLD."immutableAt"
  ) THEN
    RAISE EXCEPTION 'Admitted CanonicalMethodVersion semantics are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$method_version_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalMethodVersion_immutability_guard"
BEFORE UPDATE OR DELETE ON "CanonicalMethodVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalMethodVersionImmutability"();

-- Preserve admitted Result semantic identity while allowing formal lifecycle transitions.
CREATE FUNCTION "guardCanonicalResultImmutability"() RETURNS trigger AS $result_guard$
BEGIN
  IF TG_OP = 'DELETE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Admitted CanonicalResult rows are immutable';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Formal CanonicalResult lifecycle cannot return to a mutable state';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND (
    NEW."semanticKey" IS DISTINCT FROM OLD."semanticKey" OR
    NEW."semanticLabel" IS DISTINCT FROM OLD."semanticLabel" OR
    NEW."authorityRef" IS DISTINCT FROM OLD."authorityRef" OR
    NEW."provenance" IS DISTINCT FROM OLD."provenance" OR
    NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint" OR
    NEW."supersedesResultId" IS DISTINCT FROM OLD."supersedesResultId" OR
    NEW."correctionOfResultId" IS DISTINCT FROM OLD."correctionOfResultId" OR
    NEW."createdAt" IS DISTINCT FROM OLD."createdAt"
  ) THEN
    RAISE EXCEPTION 'Admitted CanonicalResult semantics are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$result_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalResult_immutability_guard"
BEFORE UPDATE OR DELETE ON "CanonicalResult"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalResultImmutability"();

-- Preserve admitted ResultVersion semantics while allowing formal lifecycle transitions.
CREATE FUNCTION "guardCanonicalResultVersionImmutability"() RETURNS trigger AS $result_version_guard$
BEGIN
  IF TG_OP = 'DELETE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Admitted CanonicalResultVersion rows are immutable';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Formal CanonicalResultVersion lifecycle cannot return to a mutable state';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') AND (
    NEW."resultId" IS DISTINCT FROM OLD."resultId" OR
    NEW."versionKey" IS DISTINCT FROM OLD."versionKey" OR
    NEW."qualification" IS DISTINCT FROM OLD."qualification" OR
    NEW."contextSnapshot" IS DISTINCT FROM OLD."contextSnapshot" OR
    NEW."provenance" IS DISTINCT FROM OLD."provenance" OR
    NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint" OR
    NEW."effectiveAt" IS DISTINCT FROM OLD."effectiveAt" OR
    NEW."admittedAt" IS DISTINCT FROM OLD."admittedAt" OR
    NEW."supersedesResultVersionId" IS DISTINCT FROM OLD."supersedesResultVersionId" OR
    NEW."correctionOfResultVersionId" IS DISTINCT FROM OLD."correctionOfResultVersionId" OR
    NEW."createdAt" IS DISTINCT FROM OLD."createdAt" OR
    NEW."immutableAt" IS DISTINCT FROM OLD."immutableAt"
  ) THEN
    RAISE EXCEPTION 'Admitted CanonicalResultVersion semantics are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$result_version_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalResultVersion_immutability_guard"
BEFORE UPDATE OR DELETE ON "CanonicalResultVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalResultVersionImmutability"();

-- Once adjudicated, an alias mapping is immutable; later correction requires a separately governed migration.
CREATE FUNCTION "guardAdjudicatedMethodResultAliasImmutability"() RETURNS trigger AS $alias_guard$
BEGIN
  IF OLD."adjudicationState" = 'ADJUDICATED' THEN
    RAISE EXCEPTION 'Adjudicated MethodResultAlias rows are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$alias_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "MethodResultAlias_immutability_guard"
BEFORE UPDATE OR DELETE ON "MethodResultAlias"
FOR EACH ROW EXECUTE FUNCTION "guardAdjudicatedMethodResultAliasImmutability"();
