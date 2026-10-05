-- Complete the existing generic MethodVersion governance reference structure.
-- The registry is empty, so exact version/reference pins can become mandatory without backfill.
ALTER TABLE "MethodVersionGovernanceReference"
ALTER COLUMN "versionRef" SET NOT NULL;

ALTER TABLE "MethodVersionGovernanceReference"
ADD CONSTRAINT "MethodVersionGovernanceReference_nonempty_identity" CHECK (
  btrim("semanticRef") <> ''
  AND btrim("versionRef") <> ''
  AND btrim("integrityFingerprint") <> ''
);

CREATE UNIQUE INDEX "MethodVersionGovernanceReference_exact_dependency_key"
ON "MethodVersionGovernanceReference" ("methodVersionId", "referenceKind", "semanticRef", "versionRef");

-- References are pinned before MethodVersion formalization and never silently retargeted.
CREATE FUNCTION "guardMethodVersionGovernanceReference"() RETURNS trigger AS $governance_reference_guard$
DECLARE
  parent_state "MethodResultRegistryLifecycleState";
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'MethodVersion governance dependency references are immutable; create a replacement reference before formalization';
  END IF;

  SELECT "lifecycleState" INTO parent_state
  FROM "CanonicalMethodVersion"
  WHERE id = COALESCE(NEW."methodVersionId", OLD."methodVersionId");

  IF parent_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    IF TG_OP = 'INSERT' THEN
      RAISE EXCEPTION 'MethodVersion governance dependency reference must be pinned before MethodVersion formalization';
    END IF;
    RAISE EXCEPTION 'Formal MethodVersion governance dependency references are immutable';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$governance_reference_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "MethodVersionGovernanceReference_immutability_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "MethodVersionGovernanceReference"
FOR EACH ROW EXECUTE FUNCTION "guardMethodVersionGovernanceReference"();
