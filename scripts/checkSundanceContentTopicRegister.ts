import assert from 'node:assert/strict';
import { SUNDANCE_CONTENT_TOPIC_REGISTER, validateSundanceTopicRegister } from '../lib/sundanceContentTopicRegister';
assert.equal(SUNDANCE_CONTENT_TOPIC_REGISTER.length, 8);
assert.equal(validateSundanceTopicRegister(SUNDANCE_CONTENT_TOPIC_REGISTER), true);
const municipal = SUNDANCE_CONTENT_TOPIC_REGISTER.find((item) => item.topicId === 'SUN-RULE-001');
assert.equal(municipal?.planningOnly, true); assert.equal(municipal?.freshnessClass, 'OFFICIAL_SOURCE_REQUIRED');
assert.ok(SUNDANCE_CONTENT_TOPIC_REGISTER.every((item) => item.claimBoundary === 'EDITORIAL_ONLY'));
assert.ok(SUNDANCE_CONTENT_TOPIC_REGISTER.every((item) => item.internalLinkTargets.includes('PILLAR')));
console.log('SUNDANCE_CONTENT_TOPIC_REGISTER_CHECK: PASS');
