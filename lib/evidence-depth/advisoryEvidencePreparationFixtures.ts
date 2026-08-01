import { EVIDENCE_DEPTH_FIXTURES } from "./evidenceDepthFixtures.js";
import { type EvidenceDepthEvidenceItem } from "./evidencePosture.js";

export const ADVISORY_EVIDENCE_PREPARATION_FIXTURES: readonly EvidenceDepthEvidenceItem[] = Object.freeze([
  ...EVIDENCE_DEPTH_FIXTURES,
]);

export const ADVISORY_EVIDENCE_PREPARATION_MIXED_FIXTURE_SET: readonly EvidenceDepthEvidenceItem[] = Object.freeze([
  requireFixture("public_use_complete_provenance"),
  requireFixture("attribution_required_evidence"),
  requireFixture("internal_only_evidence"),
  requireFixture("unknown_rights_evidence"),
  requireFixture("stale_evidence"),
  requireFixture("undated_evidence"),
  requireFixture("conflicting_evidence_a"),
  requireFixture("conflicting_evidence_b"),
  requireFixture("superseded_evidence"),
  requireFixture("eligible_with_limitations"),
  requireFixture("blocked_evidence"),
]);

function requireFixture(fragment: string): EvidenceDepthEvidenceItem {
  const fixture = EVIDENCE_DEPTH_FIXTURES.find((item) => item.evidenceId.includes(fragment));
  if (!fixture) throw new Error(`Missing advisory evidence preparation fixture: ${fragment}`);
  return fixture;
}
