import { ADVISORY_EVIDENCE_PREPARATION_FIXTURES } from "../evidence-depth/advisoryEvidencePreparationFixtures.js";
import { type EvidenceDepthEvidenceItem } from "../evidence-depth/evidencePosture.js";

export function requireAdvisoryEvidenceFixture(fragment: string): EvidenceDepthEvidenceItem {
  const fixture = ADVISORY_EVIDENCE_PREPARATION_FIXTURES.find((item) => item.evidenceId.includes(fragment));
  if (!fixture) throw new Error(`Missing advisory operating fixture evidence: ${fragment}`);
  return fixture;
}
