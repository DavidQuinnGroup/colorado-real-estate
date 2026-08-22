import { NextRequest, NextResponse } from 'next/server';

import { AGENT_SESSION_COOKIE } from '@/lib/admin/adminAuth';
import { getAgentNavigationSessionState } from '@/lib/admin/agentNavigationSession';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await getAgentNavigationSessionState(request.cookies.get(AGENT_SESSION_COOKIE)?.value);

  return NextResponse.json(
    session,
    {
      headers: {
        'Cache-Control': 'private, no-store',
        Vary: 'Cookie',
      },
    },
  );
}
