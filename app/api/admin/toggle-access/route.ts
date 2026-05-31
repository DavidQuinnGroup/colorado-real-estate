import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type ToggleAccessRequestBody = {
  userId?: unknown;
  status?: unknown;
  hasPrivateAccess?: unknown;
};

function toCleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function toBoolean(value: unknown) {
  if (value === true || value === 'true' || value === '1' || value === 'yes') return true;
  if (value === false || value === 'false' || value === '0' || value === 'no') return false;
  return null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ToggleAccessRequestBody;
    const userId = toCleanString(body.userId);
    const status = toCleanString(body.status);
    const hasPrivateAccess = toBoolean(body.hasPrivateAccess);

    if (!userId || !status || hasPrivateAccess === null) {
      return NextResponse.json(
        {
          success: false,
          error: 'userId, status, and hasPrivateAccess are required.',
        },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status,
        hasPrivateAccess,
      },
    });

    console.log(`[MCP ALERT] Access Tier updated for ${updatedUser.email}: ${status}`);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('[MCP ERROR] Toggle Failure:', getErrorMessage(error));
    return NextResponse.json({ error: 'Authorization or Database Sync Failure' }, { status: 500 });
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/toggle-access/route.ts
