import assert from 'node:assert/strict';
import { CANONICAL_BASELINE_LOCAL_DATABASES } from '../lib/schema/canonicalDatabaseBaseline';
import { bootstrapCanonicalDatabaseBaseline, localBaselineTarget } from './canonicalDatabaseBaselineLocal';

const database = process.env.ATLAS_BASELINE_DATABASE as (typeof CANONICAL_BASELINE_LOCAL_DATABASES)[number] | undefined;
assert.ok(database, `ATLAS_BASELINE_DATABASE is required. Approved targets: ${CANONICAL_BASELINE_LOCAL_DATABASES.join(', ')}.`);
const target = localBaselineTarget(database);
const result = bootstrapCanonicalDatabaseBaseline(target);

console.log(`[canonical-database-baseline-bootstrap] ok: ${target.database}; ${result.historicalMigrations} historical migrations marked applied; fresh LeadInteraction foreign keys are VALID.`);
