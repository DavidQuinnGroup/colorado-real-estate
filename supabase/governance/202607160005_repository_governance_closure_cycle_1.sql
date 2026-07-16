-- PROJECT ATLAS
-- Repository Governance Closure Cycle 1™
-- Step 2: Controlled remediation
--
-- Scope:
--   1. Resolve the six foundational missing-steward conditions.
--   2. Resolve the seeded Repository Health Summary platform traceability gap.
--   3. Preserve before/after evidence and lifecycle-grade auditability.
--
-- Run only after reviewing the read-only preflight output.

begin;

-- =========================================================
-- STRICT PREFLIGHT ASSERTIONS
-- =========================================================

do $$
declare
  v_missing_steward_count integer;
  v_platform_gap_count integer;
  v_exception_count integer;
  v_unexpected_missing_stewards integer;
  v_unexpected_platform_gaps integer;
begin
  select count(*)
  into v_missing_steward_count
  from repository_object_health
  where has_active_steward = false;

  select count(*)
  into v_platform_gap_count
  from repository_object_health
  where platform_traceability_ok = false;

  select count(*)
  into v_exception_count
  from repository_governance_exception_candidates;

  select count(*)
  into v_unexpected_missing_stewards
  from repository_object_health h
  join repository_object o on o.id = h.id
  where h.has_active_steward = false
    and o.slug not in (
      'project-atlas',
      'reie-canon-office',
      'enterprise-architecture-office',
      'canon-registry-office',
      'reie-platform-organization',
      'enterprise-stewardship-council'
    );

  select count(*)
  into v_unexpected_platform_gaps
  from repository_object_health h
  join repository_object o on o.id = h.id
  where h.platform_traceability_ok = false
    and o.slug <> 'repository-health-summary';

  if v_missing_steward_count <> 6 then
    raise exception
      'Closure Cycle 1 expected 6 missing stewards, found %.',
      v_missing_steward_count;
  end if;

  if v_platform_gap_count <> 1 then
    raise exception
      'Closure Cycle 1 expected 1 platform traceability gap, found %.',
      v_platform_gap_count;
  end if;

  if v_exception_count <> 7 then
    raise exception
      'Closure Cycle 1 expected 7 governance exception candidates, found %.',
      v_exception_count;
  end if;

  if v_unexpected_missing_stewards <> 0 then
    raise exception
      'Unexpected missing-steward objects detected. Closure aborted.';
  end if;

  if v_unexpected_platform_gaps <> 0 then
    raise exception
      'Unexpected platform traceability gap detected. Closure aborted.';
  end if;
end
$$;

-- =========================================================
-- BEFORE-STATE EVIDENCE
-- =========================================================

insert into repository_evidence (
  evidence_rid,
  evidence_type,
  title,
  description,
  source_system,
  observed_at,
  confidence,
  trust_score,
  metadata
)
select
  'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-BEFORE',
  'AUDIT',
  'Repository Governance Closure Cycle 1 — Before State',
  'The validated Repository state immediately before approved Governance Closure Cycle 1 remediation.',
  'REIE Enterprise Repository',
  now(),
  1.0000,
  1.0000,
  jsonb_build_object(
    'cycle', 'Repository Governance Closure Cycle 1',
    'total_objects', h.total_objects,
    'canonical_objects', h.canonical_objects,
    'operational_objects', h.operational_objects,
    'missing_governing_authority', h.missing_governing_authority,
    'missing_steward', h.missing_steward,
    'orphan_objects', h.orphan_objects,
    'platform_traceability_gaps', h.platform_traceability_gaps,
    'capability_lineage_gaps', h.capability_lineage_gaps,
    'governance_completeness_pct', h.governance_completeness_pct,
    'stewardship_completeness_pct', h.stewardship_completeness_pct,
    'relationship_completeness_pct', h.relationship_completeness_pct,
    'governance_exception_candidates',
      (select count(*) from repository_governance_exception_candidates)
  )
from repository_health_summary h
on conflict (evidence_rid) do nothing;

-- =========================================================
-- STEWARDSHIP CLOSURE
-- =========================================================

-- Assign the Enterprise Stewardship Council as the primary steward
-- of the PROJECT ATLAS parent authority.
insert into repository_object_stewardship (
  object_id,
  steward_id,
  role,
  is_primary,
  starts_at,
  review_cadence_days,
  escalation_authority
)
select
  atlas.id,
  steward.id,
  'INSTITUTIONAL_STEWARD',
  true,
  now(),
  1095,
  'PROJECT ATLAS Council™'
from repository_object atlas
join repository_steward steward
  on steward.steward_rid = (
    select 'STW-' || council.rid
    from repository_object council
    where council.slug = 'enterprise-stewardship-council'
  )
where atlas.slug = 'project-atlas'
  and not exists (
    select 1
    from repository_object_stewardship existing
    where existing.object_id = atlas.id
      and existing.is_primary = true
      and existing.ends_at is null
  );

update repository_object atlas
set
  primary_steward_rid = 'STW-' || council.rid,
  updated_at = now()
from repository_object council
where atlas.slug = 'project-atlas'
  and council.slug = 'enterprise-stewardship-council'
  and atlas.primary_steward_rid is distinct from ('STW-' || council.rid);

-- Assign each permanent governance organization to its registered
-- governance-office steward.
insert into repository_object_stewardship (
  object_id,
  steward_id,
  role,
  is_primary,
  starts_at,
  review_cadence_days,
  escalation_authority
)
select
  office.id,
  steward.id,
  case
    when office.slug = 'reie-canon-office' then 'CANON_STEWARD'
    when office.slug = 'enterprise-architecture-office' then 'ARCHITECTURE_STEWARD'
    when office.slug = 'canon-registry-office' then 'REGISTRY_STEWARD'
    when office.slug = 'reie-platform-organization' then 'IMPLEMENTATION_STEWARD'
    when office.slug = 'enterprise-stewardship-council' then 'CONTINUITY_STEWARD'
    else 'GOVERNANCE_STEWARD'
  end,
  true,
  now(),
  case
    when office.stability_class = 'C1_CONSTITUTIONAL' then 1095
    when office.stability_class = 'C2_ARCHITECTURAL' then 365
    else 180
  end,
  'PROJECT ATLAS Council™'
from repository_object office
join repository_steward steward
  on steward.office_object_id = office.id
 and steward.active = true
where office.slug in (
  'reie-canon-office',
  'enterprise-architecture-office',
  'canon-registry-office',
  'reie-platform-organization',
  'enterprise-stewardship-council'
)
and not exists (
  select 1
  from repository_object_stewardship existing
  where existing.object_id = office.id
    and existing.is_primary = true
    and existing.ends_at is null
);

update repository_object office
set
  primary_steward_rid = steward.steward_rid,
  updated_at = now()
from repository_steward steward
where steward.office_object_id = office.id
  and steward.active = true
  and office.slug in (
    'reie-canon-office',
    'enterprise-architecture-office',
    'canon-registry-office',
    'reie-platform-organization',
    'enterprise-stewardship-council'
  )
  and office.primary_steward_rid is distinct from steward.steward_rid;

-- =========================================================
-- PLATFORM TRACEABILITY CLOSURE
-- =========================================================

-- The Repository Health Summary is a platform implementation of
-- Repository Governance. Register the authoritative relationship.
insert into repository_relationship (
  source_object_id,
  relationship_type_code,
  target_object_id,
  status,
  traceability_status,
  governing_authority,
  steward_rid,
  effective_at,
  confidence,
  notes,
  metadata
)
select
  health.id,
  'IMPLEMENTS',
  capability.id,
  'ACTIVE',
  'VERIFIED',
  'Enterprise Architecture Office™',
  health.primary_steward_rid,
  now(),
  1.0000,
  'Repository Health Summary implements the Repository Governance capability by exposing measurable governance, stewardship, relationship, and traceability health.',
  jsonb_build_object(
    'governance_cycle', 'Repository Governance Closure Cycle 1',
    'approved_remediation', true
  )
from repository_object health
cross join repository_object capability
where health.slug = 'repository-health-summary'
  and capability.slug = 'repository-governance-capability'
on conflict (
  source_object_id,
  relationship_type_code,
  target_object_id
) do update
set
  status = 'ACTIVE',
  traceability_status = 'VERIFIED',
  governing_authority = excluded.governing_authority,
  steward_rid = excluded.steward_rid,
  effective_at = coalesce(repository_relationship.effective_at, excluded.effective_at),
  confidence = excluded.confidence,
  notes = excluded.notes,
  metadata = repository_relationship.metadata || excluded.metadata,
  updated_at = now();

-- =========================================================
-- AFTER-STATE ASSERTIONS
-- =========================================================

do $$
declare
  v_missing_steward_count integer;
  v_platform_gap_count integer;
  v_exception_count integer;
begin
  select count(*)
  into v_missing_steward_count
  from repository_object_health
  where has_active_steward = false;

  select count(*)
  into v_platform_gap_count
  from repository_object_health
  where platform_traceability_ok = false;

  select count(*)
  into v_exception_count
  from repository_governance_exception_candidates;

  if v_missing_steward_count <> 0 then
    raise exception
      'Closure failed: % missing stewardship conditions remain.',
      v_missing_steward_count;
  end if;

  if v_platform_gap_count <> 0 then
    raise exception
      'Closure failed: % platform traceability gaps remain.',
      v_platform_gap_count;
  end if;

  if v_exception_count <> 0 then
    raise exception
      'Closure failed: % governance exception candidates remain.',
      v_exception_count;
  end if;
end
$$;

-- =========================================================
-- AFTER-STATE EVIDENCE
-- =========================================================

insert into repository_evidence (
  evidence_rid,
  evidence_type,
  title,
  description,
  source_system,
  observed_at,
  confidence,
  trust_score,
  metadata
)
select
  'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-AFTER',
  'CERTIFICATION',
  'Repository Governance Closure Cycle 1 — Certified After State',
  'Repository Governance Closure Cycle 1 completed with all seven seeded governance exception candidates resolved.',
  'REIE Enterprise Repository',
  now(),
  1.0000,
  1.0000,
  jsonb_build_object(
    'cycle', 'Repository Governance Closure Cycle 1',
    'result', 'CLOSED',
    'total_objects', h.total_objects,
    'canonical_objects', h.canonical_objects,
    'operational_objects', h.operational_objects,
    'missing_governing_authority', h.missing_governing_authority,
    'missing_steward', h.missing_steward,
    'orphan_objects', h.orphan_objects,
    'platform_traceability_gaps', h.platform_traceability_gaps,
    'capability_lineage_gaps', h.capability_lineage_gaps,
    'governance_completeness_pct', h.governance_completeness_pct,
    'stewardship_completeness_pct', h.stewardship_completeness_pct,
    'relationship_completeness_pct', h.relationship_completeness_pct,
    'governance_exception_candidates',
      (select count(*) from repository_governance_exception_candidates),
    'remediations', jsonb_build_array(
      'Assigned primary stewardship to PROJECT ATLAS',
      'Assigned primary stewardship to five foundational governance organizations',
      'Registered Repository Health Summary IMPLEMENTS Repository Governance'
    )
  )
from repository_health_summary h
on conflict (evidence_rid) do update
set
  observed_at = excluded.observed_at,
  description = excluded.description,
  confidence = excluded.confidence,
  trust_score = excluded.trust_score,
  metadata = excluded.metadata;

-- Attach before/after evidence to the Repository v1 specification.
insert into repository_object_evidence (
  object_id,
  evidence_id,
  relationship_type,
  notes
)
select
  repository.id,
  evidence.id,
  case
    when evidence.evidence_rid like '%-BEFORE'
      then 'OBSERVED_IN'
    else 'VALIDATED_BY'
  end,
  case
    when evidence.evidence_rid like '%-BEFORE'
      then 'Baseline evidence for Repository Governance Closure Cycle 1.'
    else 'Certification evidence confirming successful closure of the initial Repository governance backlog.'
  end
from repository_object repository
join repository_evidence evidence
  on evidence.evidence_rid in (
    'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-BEFORE',
    'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-AFTER'
  )
where repository.slug = 'repository-v1'
on conflict do nothing;

-- Attach certification evidence to the corrected platform health view.
insert into repository_object_evidence (
  object_id,
  evidence_id,
  relationship_type,
  notes
)
select
  health.id,
  evidence.id,
  'VALIDATED_BY',
  'Evidence that the Repository Health Summary platform traceability gap was resolved through an approved IMPLEMENTS relationship.'
from repository_object health
join repository_evidence evidence
  on evidence.evidence_rid =
     'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-AFTER'
where health.slug = 'repository-health-summary'
on conflict do nothing;

commit;
