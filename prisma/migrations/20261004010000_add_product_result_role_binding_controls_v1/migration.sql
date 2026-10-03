-- Preserve the existing non-owner role values while adding distinct projection and composition roles.
ALTER TYPE "ProductResultRoleKind" ADD VALUE 'PROJECTION';
ALTER TYPE "ProductResultRoleKind" ADD VALUE 'COMPOSITION';

-- Generic Product-definition targets remain empty until separately governed population is authorized.
CREATE TABLE "ProductDefinitionReference" (
    "id" TEXT NOT NULL,
    "productDefinitionRef" TEXT NOT NULL,
    "productDefinitionVersionRef" TEXT NOT NULL,
    "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductDefinitionReference_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProductDefinitionReference_nonempty_identity" CHECK (
      btrim("productDefinitionRef") <> ''
      AND btrim("productDefinitionVersionRef") <> ''
      AND btrim("integrityFingerprint") <> ''
    )
);

CREATE UNIQUE INDEX "ProductDefinitionReference_integrityFingerprint_key"
ON "ProductDefinitionReference"("integrityFingerprint");

CREATE UNIQUE INDEX "ProductDefinitionReference_identity_key"
ON "ProductDefinitionReference"("productDefinitionRef", "productDefinitionVersionRef");

CREATE INDEX "ProductDefinitionReference_lifecycleState_idx"
ON "ProductDefinitionReference"("lifecycleState");

ALTER TABLE "CanonicalResultOwner"
ADD CONSTRAINT "CanonicalResultOwner_nonempty_product_identity" CHECK (
  btrim("productDefinitionRef") <> ''
  AND btrim("productDefinitionVersionRef") <> ''
  AND btrim("integrityFingerprint") <> ''
);

ALTER TABLE "ProductResultRole"
ADD CONSTRAINT "ProductResultRole_nonempty_product_identity" CHECK (
  btrim("productDefinitionRef") <> ''
  AND btrim("productDefinitionVersionRef") <> ''
  AND btrim("integrityFingerprint") <> ''
);

ALTER TABLE "CanonicalResultOwner"
ADD CONSTRAINT "CanonicalResultOwner_productReference_fkey"
FOREIGN KEY ("productDefinitionRef", "productDefinitionVersionRef")
REFERENCES "ProductDefinitionReference"("productDefinitionRef", "productDefinitionVersionRef")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProductResultRole"
ADD CONSTRAINT "ProductResultRole_productReference_fkey"
FOREIGN KEY ("productDefinitionRef", "productDefinitionVersionRef")
REFERENCES "ProductDefinitionReference"("productDefinitionRef", "productDefinitionVersionRef")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Formal Product references retain their identity and provenance.
CREATE FUNCTION "guardProductDefinitionReferenceImmutability"() RETURNS trigger AS $product_reference_guard$
BEGIN
  IF TG_OP = 'DELETE' AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Formal ProductDefinitionReference rows are immutable';
  END IF;
  IF TG_OP = 'UPDATE'
    AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY')
    AND (
      NEW."id" IS DISTINCT FROM OLD."id" OR
      NEW."productDefinitionRef" IS DISTINCT FROM OLD."productDefinitionRef" OR
      NEW."productDefinitionVersionRef" IS DISTINCT FROM OLD."productDefinitionVersionRef" OR
      NEW."provenance" IS DISTINCT FROM OLD."provenance" OR
      NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint" OR
      NEW."createdAt" IS DISTINCT FROM OLD."createdAt" OR
      NEW."immutableAt" IS DISTINCT FROM OLD."immutableAt"
    )
  THEN
    RAISE EXCEPTION 'Formal ProductDefinitionReference identity and provenance are immutable';
  END IF;
  IF TG_OP = 'UPDATE'
    AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY')
    AND NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY')
  THEN
    RAISE EXCEPTION 'Formal ProductDefinitionReference lifecycle cannot return to a mutable state';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$product_reference_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "ProductDefinitionReference_immutability_guard"
BEFORE UPDATE OR DELETE ON "ProductDefinitionReference"
FOR EACH ROW EXECUTE FUNCTION "guardProductDefinitionReferenceImmutability"();

-- A Result owner is pinned while the Result is mutable and becomes immutable with formal admission.
CREATE FUNCTION "guardCanonicalResultOwnerBinding"() RETURNS trigger AS $result_owner_guard$
DECLARE
  result_state "MethodResultRegistryLifecycleState";
  product_state "MethodResultRegistryLifecycleState";
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Canonical Result owner bindings cannot be retargeted';
  END IF;

  SELECT "lifecycleState" INTO result_state
  FROM "CanonicalResult"
  WHERE id = COALESCE(NEW."resultId", OLD."resultId");

  IF TG_OP = 'DELETE' THEN
    IF result_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
      RAISE EXCEPTION 'Formal Canonical Result owner bindings are immutable';
    END IF;
    RETURN OLD;
  END IF;

  IF result_state NOT IN ('CANDIDATE', 'GOVERNED_BUT_UNADMITTED') THEN
    RAISE EXCEPTION 'Canonical Result owner must be pinned to an eligible mutable Result before formal admission';
  END IF;

  SELECT "lifecycleState" INTO product_state
  FROM "ProductDefinitionReference"
  WHERE "productDefinitionRef" = NEW."productDefinitionRef"
    AND "productDefinitionVersionRef" = NEW."productDefinitionVersionRef";

  IF product_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Canonical Result owner requires a formal ProductDefinitionReference';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "ProductResultRole"
    WHERE "resultId" = NEW."resultId"
      AND "productDefinitionRef" = NEW."productDefinitionRef"
      AND "productDefinitionVersionRef" = NEW."productDefinitionVersionRef"
  ) THEN
    RAISE EXCEPTION 'Canonical Result owner cannot also hold a non-owner role for the same Result';
  END IF;

  RETURN NEW;
END;
$result_owner_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalResultOwner_binding_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "CanonicalResultOwner"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalResultOwnerBinding"();

-- Formal Results require exactly one governing Product owner.
CREATE FUNCTION "guardCanonicalResultOwnerAdmission"() RETURNS trigger AS $result_owner_admission_guard$
DECLARE
  owner_count INTEGER;
BEGIN
  IF NEW."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    SELECT count(*) INTO owner_count
    FROM "CanonicalResultOwner"
    WHERE "resultId" = NEW.id;
    IF owner_count <> 1 THEN
      RAISE EXCEPTION 'Formal Canonical Result requires exactly one governing Product owner';
    END IF;
  END IF;
  RETURN NEW;
END;
$result_owner_admission_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalResult_owner_admission_guard"
BEFORE INSERT OR UPDATE ON "CanonicalResult"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalResultOwnerAdmission"();

-- Non-owner roles require formal Product and Result references and remain immutable.
CREATE FUNCTION "guardProductResultRoleBinding"() RETURNS trigger AS $product_result_role_guard$
DECLARE
  result_state "MethodResultRegistryLifecycleState";
  product_state "MethodResultRegistryLifecycleState";
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Product Result non-owner role bindings cannot be retargeted';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Formal Product Result non-owner role bindings are immutable';
  END IF;

  SELECT "lifecycleState" INTO result_state
  FROM "CanonicalResult"
  WHERE id = NEW."resultId";
  IF result_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Product Result non-owner role requires a formal Canonical Result';
  END IF;

  SELECT "lifecycleState" INTO product_state
  FROM "ProductDefinitionReference"
  WHERE "productDefinitionRef" = NEW."productDefinitionRef"
    AND "productDefinitionVersionRef" = NEW."productDefinitionVersionRef";
  IF product_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Product Result non-owner role requires a formal ProductDefinitionReference';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "CanonicalResultOwner"
    WHERE "resultId" = NEW."resultId"
      AND "productDefinitionRef" = NEW."productDefinitionRef"
      AND "productDefinitionVersionRef" = NEW."productDefinitionVersionRef"
  ) THEN
    RAISE EXCEPTION 'Canonical Result owner cannot also hold a non-owner role for the same Result';
  END IF;

  RETURN NEW;
END;
$product_result_role_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "ProductResultRole_binding_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "ProductResultRole"
FOR EACH ROW EXECUTE FUNCTION "guardProductResultRoleBinding"();
