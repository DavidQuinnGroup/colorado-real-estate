-- PROJECT ATLAS
-- Repository Governance Closure Cycle 1™
-- Step 1: Read-only preflight
-- Run in Supabase SQL Editor before the closure script.

-- Current health baseline.
select * from repository_health_summary;

-- Exact governance exception candidates.
select
  object_id,
  rid,
  official_name,
  family,
  object_type,
  exception_type
from repository_governance_exception_candidates
order by exception_type, family, official_name;

-- Objects currently missing active stewardship.
select
  o.id,
  o.rid,
  o.slug,
  o.official_name,
  o.family,
  o.object_type,
  o.primary_steward_rid
from repository_object_health h
join repository_object o on o.id = h.id
where h.has_active_steward = false
order by o.family, o.official_name;

-- Current platform traceability gaps.
select
  o.id,
  o.rid,
  o.slug,
  o.official_name,
  o.object_type,
  o.technical_location,
  o.runtime_status
from repository_object_health h
join repository_object o on o.id = h.id
where h.platform_traceability_ok = false
order by o.official_name;

-- Available active stewards.
select
  s.id,
  s.steward_rid,
  s.name,
  s.steward_type,
  office.rid as office_rid,
  office.official_name as office_name
from repository_steward s
left join repository_object office on office.id = s.office_object_id
where s.active = true
order by s.name;

-- Foundational relationship candidates used by the closure.
select
  rid,
  slug,
  official_name,
  family,
  object_type
from repository_object
where slug in (
  'project-atlas',
  'reie-canon-office',
  'enterprise-architecture-office',
  'canon-registry-office',
  'reie-platform-organization',
  'enterprise-stewardship-council',
  'repository-health-summary',
  'repository-governance-capability'
)
order by slug;
