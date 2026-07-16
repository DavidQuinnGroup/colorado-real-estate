-- PROJECT ATLAS
-- Repository Governance Closure Cycle 1™
-- Step 3: Read-only certification validation

-- Expected:
-- stewardship_completeness_pct = 100.00
-- platform_traceability_gaps = 0
-- capability_lineage_gaps = 0
select * from repository_health_summary;

-- Expected: zero rows.
select *
from repository_governance_exception_candidates
order by family, official_name;

-- Expected: all foundational governance objects have active primary stewardship.
select
  o.rid,
  o.official_name,
  o.primary_steward_rid,
  s.name as steward_name,
  os.role,
  os.review_cadence_days,
  os.starts_at
from repository_object o
join repository_object_stewardship os
  on os.object_id = o.id
 and os.is_primary = true
 and os.ends_at is null
join repository_steward s on s.id = os.steward_id
where o.slug in (
  'project-atlas',
  'reie-canon-office',
  'enterprise-architecture-office',
  'canon-registry-office',
  'reie-platform-organization',
  'enterprise-stewardship-council'
)
order by o.official_name;

-- Expected: one active VERIFIED IMPLEMENTS relationship.
select
  relationship.relationship_rid,
  source.rid as source_rid,
  source.official_name as source_name,
  relationship.relationship_type_code,
  target.rid as target_rid,
  target.official_name as target_name,
  relationship.status,
  relationship.traceability_status,
  relationship.confidence,
  relationship.notes
from repository_relationship relationship
join repository_object source
  on source.id = relationship.source_object_id
join repository_object target
  on target.id = relationship.target_object_id
where source.slug = 'repository-health-summary'
  and target.slug = 'repository-governance-capability'
  and relationship.relationship_type_code = 'IMPLEMENTS';

-- Expected: before and after evidence records.
select
  evidence_rid,
  evidence_type,
  title,
  observed_at,
  confidence,
  trust_score,
  metadata
from repository_evidence
where evidence_rid in (
  'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-BEFORE',
  'EVD-REPOSITORY-GOVERNANCE-CLOSURE-1-AFTER'
)
order by observed_at;

-- Compact counts for comparison.
select 'repository_object' as entity, count(*) as count
from repository_object
union all
select 'repository_relationship', count(*)
from repository_relationship
union all
select 'repository_steward', count(*)
from repository_steward
union all
select 'repository_object_stewardship', count(*)
from repository_object_stewardship
union all
select 'repository_evidence', count(*)
from repository_evidence
union all
select 'repository_governance_exception_candidates', count(*)
from repository_governance_exception_candidates
order by entity;
