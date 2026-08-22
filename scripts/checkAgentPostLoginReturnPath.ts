import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

import {
  AGENT_SESSION_COOKIE,
  buildAgentLoginRedirect,
  sanitizeAgentReturnPath,
} from '../lib/admin/adminAuth';
import { createAgentLoginSuccessResponse } from '../lib/admin/agentLoginReturn';
import { NextRequest } from 'next/server';

const credential = createHash('sha256').update('REIE_AGENT_POST_LOGIN_RETURN_PATH_CHECK').digest('base64url');

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-human-agent-return-path-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function protectedRequest(path: string) {
  return new NextRequest(`https://davidquinngroup.com${path}`);
}

async function submitSuccessfulLogin(next?: string) {
  return createAgentLoginSuccessResponse('https://davidquinngroup.com', next ?? null);
}

function location(response: Response) {
  return new URL(response.headers.get('location') || '', 'https://davidquinngroup.com').pathname;
}

async function main() {
  assert.equal(sanitizeAgentReturnPath('/agent'), '/agent');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/property'), '/agent/prepare/property');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/market'), '/agent/prepare/market');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/place'), '/agent/prepare/place');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/buyer'), '/agent/prepare/buyer');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/listing'), '/agent/prepare/listing');
  assert.equal(sanitizeAgentReturnPath(null), '/agent');

  for (const value of [
    'https://example.com',
    '//example.com',
    '/admin',
    '/admin/agent-briefing-preparation',
    '/admin/repository',
    '/agent/unknown',
    'javascript:alert(1)',
    'data:text/html,test',
    '/agent/prepare/property?next=/admin',
    '/agent/%2e%2e/admin',
    '/agent/prepare/%2e%2e%2fproperty',
  ]) {
    assert.equal(sanitizeAgentReturnPath(value), '/agent', `${value} must fail closed to the Agent Workspace Home fallback.`);
  }

  const workspaceRedirect = buildAgentLoginRedirect(protectedRequest('/agent'));
  assert.equal(location(workspaceRedirect), '/agent/login');
  assert.equal(new URL(workspaceRedirect.headers.get('location') || '').searchParams.get('next'), '/agent');

  const propertyRedirect = buildAgentLoginRedirect(protectedRequest('/agent/prepare/property'));
  assert.equal(location(propertyRedirect), '/agent/login');
  assert.equal(new URL(propertyRedirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/property');

  const marketRedirect = buildAgentLoginRedirect(protectedRequest('/agent/prepare/market'));
  assert.equal(location(marketRedirect), '/agent/login');
  assert.equal(new URL(marketRedirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/market');

  const placeRedirect = buildAgentLoginRedirect(protectedRequest('/agent/prepare/place'));
  assert.equal(location(placeRedirect), '/agent/login');
  assert.equal(new URL(placeRedirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/place');

  const buyerRedirect = buildAgentLoginRedirect(protectedRequest('/agent/prepare/buyer'));
  assert.equal(location(buyerRedirect), '/agent/login');
  assert.equal(new URL(buyerRedirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/buyer');

  const listingRedirect = buildAgentLoginRedirect(protectedRequest('/agent/prepare/listing'));
  assert.equal(location(listingRedirect), '/agent/login');
  assert.equal(new URL(listingRedirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/listing');

  for (const [next, expected] of [
    ['/agent', '/agent'],
    ['/agent/prepare/property', '/agent/prepare/property'],
    ['/agent/prepare/market', '/agent/prepare/market'],
    ['/agent/prepare/place', '/agent/prepare/place'],
    ['/agent/prepare/buyer', '/agent/prepare/buyer'],
    ['/agent/prepare/listing', '/agent/prepare/listing'],
    [undefined, '/agent'],
    ['/admin/agent-briefing-preparation', '/agent'],
    ['https://example.com', '/agent'],
    ['//example.com', '/agent'],
    ['/admin', '/agent'],
    ['/admin/repository', '/agent'],
    ['/agent/unknown', '/agent'],
    ['javascript:alert(1)', '/agent'],
    ['/agent/%2e%2e/admin', '/agent'],
  ] as const) {
    const response = await submitSuccessfulLogin(next);
    assert.equal(response.status, 303, 'Valid Agent authentication must preserve the existing redirect status.');
    assert.equal(location(response), expected, `${next ?? 'direct login'} must resolve to the exact allowed Agent destination.`);
    assert.match(response.headers.get('set-cookie') || '', new RegExp(`^${AGENT_SESSION_COOKIE}=`), 'Successful login must retain the signed Agent session cookie.');
  }

  console.log('AGENT_POST_LOGIN_RETURN_PATH_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_POST_LOGIN_RETURN_PATH_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
