-- Represent a discovered legacy label before governance has assigned a disposition.
ALTER TYPE "MethodResultAliasAdjudicationState"
ADD VALUE 'UNADJUDICATED' BEFORE 'ADJUDICATED';

-- Alias identity is exact and byte-preserving; empty namespace/value pairs are invalid.
ALTER TABLE "MethodResultAlias"
ADD CONSTRAINT "MethodResultAlias_nonempty_source_identity"
CHECK (char_length("aliasNamespace") > 0 AND char_length("aliasValue") > 0);

-- Preserve source identity and require an adjudicated alias to resolve to one formal target.
CREATE FUNCTION "guardMethodResultAliasCompatibility"() RETURNS trigger AS $alias_compatibility_guard$
DECLARE
  target_state "MethodResultRegistryLifecycleState";
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'MethodResultAlias rows preserve legacy label history and cannot be deleted';
  END IF;

  IF TG_OP = 'UPDATE' AND (
    NEW."aliasNamespace" IS DISTINCT FROM OLD."aliasNamespace"
    OR NEW."aliasKind" IS DISTINCT FROM OLD."aliasKind"
    OR NEW."aliasValue" IS DISTINCT FROM OLD."aliasValue"
    OR NEW."provenance" IS DISTINCT FROM OLD."provenance"
    OR NEW."integrityFingerprint" IS DISTINCT FROM OLD."integrityFingerprint"
    OR NEW."createdAt" IS DISTINCT FROM OLD."createdAt"
    OR NEW."immutableAt" IS DISTINCT FROM OLD."immutableAt"
  ) THEN
    RAISE EXCEPTION 'MethodResultAlias source identity, provenance, and fingerprint are immutable';
  END IF;

  IF NEW."adjudicationState" <> 'ADJUDICATED' THEN
    IF num_nonnulls(NEW."methodId", NEW."methodVersionId", NEW."resultId", NEW."resultVersionId") <> 0 THEN
      RAISE EXCEPTION 'Unresolved MethodResultAlias rows cannot carry a semantic target';
    END IF;
    RETURN NEW;
  END IF;

  IF num_nonnulls(NEW."methodId", NEW."methodVersionId", NEW."resultId", NEW."resultVersionId") <> 1 THEN
    RAISE EXCEPTION 'Adjudicated MethodResultAlias requires exactly one semantic target';
  END IF;

  IF NEW."methodId" IS NOT NULL THEN
    SELECT "lifecycleState" INTO target_state FROM "CanonicalMethod" WHERE id = NEW."methodId";
  ELSIF NEW."methodVersionId" IS NOT NULL THEN
    SELECT "lifecycleState" INTO target_state FROM "CanonicalMethodVersion" WHERE id = NEW."methodVersionId";
  ELSIF NEW."resultId" IS NOT NULL THEN
    SELECT "lifecycleState" INTO target_state FROM "CanonicalResult" WHERE id = NEW."resultId";
  ELSE
    SELECT "lifecycleState" INTO target_state FROM "CanonicalResultVersion" WHERE id = NEW."resultVersionId";
  END IF;

  IF target_state IS NULL OR target_state NOT IN (
    'ADMITTED',
    'ADMITTED_WITH_QUALIFICATIONS',
    'SUPERSEDED',
    'CORRECTED',
    'WITHDRAWN',
    'HISTORICAL_ONLY'
  ) THEN
    RAISE EXCEPTION 'Adjudicated MethodResultAlias target must exist and be formal';
  END IF;

  RETURN NEW;
END;
$alias_compatibility_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "MethodResultAlias_compatibility_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "MethodResultAlias"
FOR EACH ROW EXECUTE FUNCTION "guardMethodResultAliasCompatibility"();
