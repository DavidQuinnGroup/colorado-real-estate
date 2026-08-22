import { validateAgentSessionCookieValue } from './adminAuth';

export async function getAgentNavigationSessionState(sessionValue: string | undefined) {
  const session = await validateAgentSessionCookieValue(sessionValue);
  return { authenticated: session.valid } as const;
}
