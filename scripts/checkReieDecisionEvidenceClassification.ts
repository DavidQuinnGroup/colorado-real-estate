import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  REIE_DECISION_EVIDENCE_CLASSIFICATIONS,
  validateReieDecisionEvidenceItem,
  validateReieDecisionEvidenceTransition,
  type ReieDecisionEvidenceItem,
} from '../lib/reieDecisionEvidenceClassification.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieDecisionEvidenceClassification.ts'), 'utf8');
const forbiddenRuntimeTokens = ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail'];
for (const token of forbiddenRuntimeTokens) assert.equal(source.includes(token), false, `classification contract must not depend on ${token}`);

const base = (classification: ReieDecisionEvidenceItem['classification'], value: ReieDecisionEvidenceItem['value'], origin: ReieDecisionEvidenceItem['provenance']['origin']): ReieDecisionEvidenceItem => ({
  id: `item-${classification.toLowerCase()}`,
  label: classification,
  value,
  classification,
  provenance: { origin, reference: origin === 'NONE' ? null : 'explicit-reference', sourceId: origin === 'GOVERNED_SOURCE_FACT' ? 'SRC-GOVERNED' : null, freshness: origin === 'NONE' ? 'NOT_APPLICABLE' : 'CURRENT', rights: origin === 'GOVERNED_SOURCE_FACT' ? 'REVIEWED' : 'NOT_APPLICABLE' },
  visibility: classification === 'PROHIBITED_OUTPUT' ? 'COMPLIANCE_BLOCKED' : classification === 'NOT_AVAILABLE' ? 'DATA_INSUFFICIENT' : 'GUIDED',
  verification: classification === 'PROFESSIONAL_VERIFICATION_REQUIRED' ? 'REQUIRED' : 'NOT_REQUIRED',
  prohibitedUse: ['No recommendation or conclusion.'],
});

assert.deepEqual(validateReieDecisionEvidenceItem(base('FACT', 'visible fact', 'GOVERNED_SOURCE_FACT')), []);
assert.deepEqual(validateReieDecisionEvidenceItem(base('USER_ASSUMPTION', 'user input', 'EXPLICIT_CUSTOMER_INPUT')), []);
assert.deepEqual(validateReieDecisionEvidenceItem(base('DERIVED_ILLUSTRATION', 'illustration', 'VISIBLE_ASSUMPTION_ILLUSTRATION')), []);
assert.deepEqual(validateReieDecisionEvidenceItem(base('NOT_AVAILABLE', null, 'NONE')), []);
assert.deepEqual(validateReieDecisionEvidenceItem(base('PROHIBITED_OUTPUT', null, 'NONE')), []);
assert.ok(validateReieDecisionEvidenceItem({ ...base('FACT', 'bad', 'EXPLICIT_CUSTOMER_INPUT') }).includes('FACT_REQUIRES_GOVERNED_OR_EXPLICIT_PROVENANCE'));
assert.deepEqual(validateReieDecisionEvidenceTransition({ from: 'UNVERIFIED_INPUT', to: 'FACT', authorization: 'EXPLICIT_GOVERNED_INPUT' }), []);
assert.ok(validateReieDecisionEvidenceTransition({ from: 'USER_ASSUMPTION', to: 'FACT', authorization: 'SYSTEM_DERIVATION_FROM_VISIBLE_ASSUMPTIONS' }).includes('FACT_PROMOTION_REQUIRES_EXPLICIT_AUTHORITY'));

console.log('[reie-decision-evidence-classification] ok: seven explicit evidence states, provenance rules, fail-closed prohibited outputs, and non-authoritative transitions verified.');
