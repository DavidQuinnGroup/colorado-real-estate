-- Add the generic computational/non-computational MethodVersion requirement without populating existing rows.
CREATE TYPE "ResultVersionMethodRequirement" AS ENUM ('METHOD_VERSION_REQUIRED', 'METHOD_VERSION_NOT_APPLICABLE');

ALTER TABLE "CanonicalResultVersion"
ADD COLUMN "methodRequirement" "ResultVersionMethodRequirement";

-- A predecessor may have only one successor, whether the successor is a supersession or a correction.
CREATE UNIQUE INDEX "CanonicalMethodVersion_lineagePredecessor_key"
ON "CanonicalMethodVersion" ((COALESCE("supersedesMethodVersionId", "correctionOfMethodVersionId")))
WHERE num_nonnulls("supersedesMethodVersionId", "correctionOfMethodVersionId") = 1;

CREATE UNIQUE INDEX "CanonicalResultVersion_lineagePredecessor_key"
ON "CanonicalResultVersion" ((COALESCE("supersedesResultVersionId", "correctionOfResultVersionId")))
WHERE num_nonnulls("supersedesResultVersionId", "correctionOfResultVersionId") = 1;

-- Version lineage must remain within one semantic identity, begin from a formal predecessor, and stay acyclic.
CREATE FUNCTION "guardCanonicalMethodVersionLineage"() RETURNS trigger AS $method_version_lineage_guard$
DECLARE
  predecessor_id TEXT;
  predecessor_method_id TEXT;
  predecessor_state "MethodResultRegistryLifecycleState";
  method_state "MethodResultRegistryLifecycleState";
  creates_cycle BOOLEAN;
BEGIN
  IF NEW."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    SELECT "lifecycleState" INTO method_state
    FROM "CanonicalMethod"
    WHERE id = NEW."methodId";
    IF method_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
      RAISE EXCEPTION 'Formal MethodVersion requires a formal CanonicalMethod';
    END IF;
  END IF;

  predecessor_id := COALESCE(NEW."supersedesMethodVersionId", NEW."correctionOfMethodVersionId");
  IF predecessor_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT "methodId", "lifecycleState"
  INTO predecessor_method_id, predecessor_state
  FROM "CanonicalMethodVersion"
  WHERE id = predecessor_id;

  IF predecessor_method_id IS NULL THEN
    RETURN NEW;
  END IF;
  IF predecessor_method_id IS DISTINCT FROM NEW."methodId" THEN
    RAISE EXCEPTION 'MethodVersion lineage must remain within one CanonicalMethod';
  END IF;
  IF predecessor_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'MethodVersion lineage predecessor must be formal';
  END IF;

  WITH RECURSIVE ancestry(id) AS (
    SELECT predecessor_id
    UNION
    SELECT COALESCE(v."supersedesMethodVersionId", v."correctionOfMethodVersionId")
    FROM "CanonicalMethodVersion" v
    JOIN ancestry a ON v.id = a.id
    WHERE COALESCE(v."supersedesMethodVersionId", v."correctionOfMethodVersionId") IS NOT NULL
  )
  SELECT EXISTS (SELECT 1 FROM ancestry WHERE id = NEW.id) INTO creates_cycle;

  IF creates_cycle THEN
    RAISE EXCEPTION 'MethodVersion lineage cycle is not allowed';
  END IF;
  RETURN NEW;
END;
$method_version_lineage_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalMethodVersion_lineage_guard"
BEFORE INSERT OR UPDATE ON "CanonicalMethodVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalMethodVersionLineage"();

CREATE FUNCTION "guardCanonicalResultVersionLineage"() RETURNS trigger AS $result_version_lineage_guard$
DECLARE
  predecessor_id TEXT;
  predecessor_result_id TEXT;
  predecessor_state "MethodResultRegistryLifecycleState";
  producer_count INTEGER;
  nonformal_producer_count INTEGER;
  nonformal_constituent_count INTEGER;
  result_state "MethodResultRegistryLifecycleState";
  creates_cycle BOOLEAN;
BEGIN
  IF TG_OP = 'UPDATE'
    AND OLD."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY')
    AND NEW."methodRequirement" IS DISTINCT FROM OLD."methodRequirement"
  THEN
    RAISE EXCEPTION 'Formal CanonicalResultVersion Method requirement is immutable';
  END IF;

  predecessor_id := COALESCE(NEW."supersedesResultVersionId", NEW."correctionOfResultVersionId");
  IF predecessor_id IS NOT NULL THEN
    SELECT "resultId", "lifecycleState"
    INTO predecessor_result_id, predecessor_state
    FROM "CanonicalResultVersion"
    WHERE id = predecessor_id;

    IF predecessor_result_id IS NOT NULL THEN
      IF predecessor_result_id IS DISTINCT FROM NEW."resultId" THEN
        RAISE EXCEPTION 'ResultVersion lineage must remain within one CanonicalResult';
      END IF;
      IF predecessor_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
        RAISE EXCEPTION 'ResultVersion lineage predecessor must be formal';
      END IF;

      WITH RECURSIVE ancestry(id) AS (
        SELECT predecessor_id
        UNION
        SELECT COALESCE(v."supersedesResultVersionId", v."correctionOfResultVersionId")
        FROM "CanonicalResultVersion" v
        JOIN ancestry a ON v.id = a.id
        WHERE COALESCE(v."supersedesResultVersionId", v."correctionOfResultVersionId") IS NOT NULL
      )
      SELECT EXISTS (SELECT 1 FROM ancestry WHERE id = NEW.id) INTO creates_cycle;

      IF creates_cycle THEN
        RAISE EXCEPTION 'ResultVersion lineage cycle is not allowed';
      END IF;
    END IF;
  END IF;

  SELECT count(*) INTO producer_count
  FROM "MethodResultProductionEdge"
  WHERE "resultVersionId" = NEW.id;

  IF NEW."methodRequirement" = 'METHOD_VERSION_NOT_APPLICABLE' AND producer_count <> 0 THEN
    RAISE EXCEPTION 'Non-computational ResultVersion cannot have a MethodVersion producer';
  END IF;

  IF NEW."lifecycleState" IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    SELECT "lifecycleState" INTO result_state
    FROM "CanonicalResult"
    WHERE id = NEW."resultId";
    IF result_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
      RAISE EXCEPTION 'Formal ResultVersion requires a formal CanonicalResult';
    END IF;
    IF NEW."methodRequirement" IS NULL THEN
      RAISE EXCEPTION 'Formal CanonicalResultVersion requires an explicit Method requirement';
    END IF;
    IF NEW."methodRequirement" = 'METHOD_VERSION_REQUIRED' AND producer_count <> 1 THEN
      RAISE EXCEPTION 'Computational ResultVersion requires exactly one MethodVersion producer';
    END IF;
    IF NEW."methodRequirement" = 'METHOD_VERSION_NOT_APPLICABLE' AND producer_count <> 0 THEN
      RAISE EXCEPTION 'Non-computational ResultVersion cannot have a MethodVersion producer';
    END IF;

    SELECT count(*) INTO nonformal_producer_count
    FROM "MethodResultProductionEdge" edge
    JOIN "CanonicalMethodVersion" method_version ON method_version.id = edge."methodVersionId"
    WHERE edge."resultVersionId" = NEW.id
      AND method_version."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY');
    IF nonformal_producer_count <> 0 THEN
      RAISE EXCEPTION 'Formal ResultVersion producer must be a formal MethodVersion';
    END IF;

    SELECT count(*) INTO nonformal_constituent_count
    FROM "ResultVersionConstituent" edge
    JOIN "CanonicalResultVersion" constituent ON constituent.id = edge."constituentResultVersionId"
    WHERE edge."compositeResultVersionId" = NEW.id
      AND constituent."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY');
    IF nonformal_constituent_count <> 0 THEN
      RAISE EXCEPTION 'Formal composite ResultVersion constituents must be formal';
    END IF;
  END IF;
  RETURN NEW;
END;
$result_version_lineage_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CanonicalResultVersion_lineage_guard"
BEFORE INSERT OR UPDATE ON "CanonicalResultVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCanonicalResultVersionLineage"();

-- Producer pins may be created only for computational candidates and cannot be rewritten in place.
CREATE FUNCTION "guardMethodResultProductionEdgeLineage"() RETURNS trigger AS $production_edge_guard$
DECLARE
  result_state "MethodResultRegistryLifecycleState";
  method_state "MethodResultRegistryLifecycleState";
  requirement "ResultVersionMethodRequirement";
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'MethodResultProductionEdge rows are immutable';
  END IF;

  IF TG_OP = 'DELETE' THEN
    SELECT "lifecycleState" INTO result_state
    FROM "CanonicalResultVersion"
    WHERE id = OLD."resultVersionId";
    IF result_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
      RAISE EXCEPTION 'Formal ResultVersion producer lineage is immutable';
    END IF;
    RETURN OLD;
  END IF;

  SELECT "lifecycleState", "methodRequirement"
  INTO result_state, requirement
  FROM "CanonicalResultVersion"
  WHERE id = NEW."resultVersionId";
  SELECT "lifecycleState" INTO method_state
  FROM "CanonicalMethodVersion"
  WHERE id = NEW."methodVersionId";

  IF requirement IS DISTINCT FROM 'METHOD_VERSION_REQUIRED' THEN
    RAISE EXCEPTION 'MethodVersion producer requires a computational ResultVersion candidate';
  END IF;
  IF result_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Producer edge must be pinned before ResultVersion formalization';
  END IF;
  IF method_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Producer edge requires a formal MethodVersion';
  END IF;
  RETURN NEW;
END;
$production_edge_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "MethodResultProductionEdge_lineage_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "MethodResultProductionEdge"
FOR EACH ROW EXECUTE FUNCTION "guardMethodResultProductionEdgeLineage"();

-- Constituent pins form an immutable, acyclic graph once the composite ResultVersion is formal.
CREATE FUNCTION "guardResultVersionConstituentLineage"() RETURNS trigger AS $constituent_lineage_guard$
DECLARE
  composite_state "MethodResultRegistryLifecycleState";
  constituent_state "MethodResultRegistryLifecycleState";
  creates_cycle BOOLEAN;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'ResultVersionConstituent rows are immutable';
  END IF;

  IF TG_OP = 'DELETE' THEN
    SELECT "lifecycleState" INTO composite_state
    FROM "CanonicalResultVersion"
    WHERE id = OLD."compositeResultVersionId";
    IF composite_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
      RAISE EXCEPTION 'Formal composite ResultVersion constituent lineage is immutable';
    END IF;
    RETURN OLD;
  END IF;

  SELECT "lifecycleState" INTO composite_state
  FROM "CanonicalResultVersion"
  WHERE id = NEW."compositeResultVersionId";
  SELECT "lifecycleState" INTO constituent_state
  FROM "CanonicalResultVersion"
  WHERE id = NEW."constituentResultVersionId";

  IF composite_state IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Constituent edge must be pinned before composite ResultVersion formalization';
  END IF;
  IF constituent_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS', 'SUPERSEDED', 'CORRECTED', 'WITHDRAWN', 'HISTORICAL_ONLY') THEN
    RAISE EXCEPTION 'Composite ResultVersion requires formal constituent ResultVersions';
  END IF;

  WITH RECURSIVE descendants(id) AS (
    SELECT NEW."constituentResultVersionId"
    UNION
    SELECT edge."constituentResultVersionId"
    FROM "ResultVersionConstituent" edge
    JOIN descendants d ON edge."compositeResultVersionId" = d.id
  )
  SELECT EXISTS (SELECT 1 FROM descendants WHERE id = NEW."compositeResultVersionId") INTO creates_cycle;

  IF creates_cycle THEN
    RAISE EXCEPTION 'Composite ResultVersion constituent cycle is not allowed';
  END IF;
  RETURN NEW;
END;
$constituent_lineage_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "ResultVersionConstituent_lineage_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "ResultVersionConstituent"
FOR EACH ROW EXECUTE FUNCTION "guardResultVersionConstituentLineage"();
