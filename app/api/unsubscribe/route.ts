import { prisma } from '@/lib/prisma';
import {
  classifyUnsubscribeToken,
  normalizeUnsubscribeToken,
  type UnsubscribeTokenRecord,
} from '@/lib/unsubscribe/safety';

export const dynamic = 'force-dynamic';

type UnsubscribeResult = 'global' | 'search';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function htmlResponse(title: string, message: string, status = 200) {
  return new Response(
    `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="noindex,nofollow" />
          <title>${escapeHtml(title)} | David Quinn Group</title>
          <style>
            :root {
              color-scheme: dark;
              background: #020617;
              color: #f8fafc;
              font-family: Arial, Helvetica, sans-serif;
            }

            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background:
                radial-gradient(circle at 20% 20%, rgba(103, 232, 249, 0.14), transparent 32rem),
                linear-gradient(135deg, #020617 0%, #030712 52%, #05140c 100%);
            }

            main {
              width: min(560px, calc(100vw - 40px));
              border: 1px solid rgba(148, 163, 184, 0.22);
              background: rgba(2, 6, 23, 0.86);
              padding: 40px;
            }

            .eyebrow {
              margin: 0 0 16px;
              color: #67e8f9;
              font-size: 11px;
              font-weight: 900;
              letter-spacing: 0.34em;
              text-transform: uppercase;
            }

            h1 {
              margin: 0;
              color: #ffffff;
              font-size: 34px;
              line-height: 1;
              font-style: italic;
              letter-spacing: 0;
              text-transform: uppercase;
            }

            p {
              margin: 18px 0 0;
              color: #cbd5e1;
              font-size: 15px;
              line-height: 1.7;
            }

            a {
              color: #67e8f9;
            }
          </style>
        </head>
        <body>
          <main>
            <p class="eyebrow">David Quinn Group</p>
            <h1>${escapeHtml(title)}</h1>
            <p>${escapeHtml(message)}</p>
          </main>
        </body>
      </html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}

function getToken(req: Request) {
  const { searchParams } = new URL(req.url);
  return normalizeUnsubscribeToken(searchParams.get('token'));
}

async function findUnsubscribeToken(token: string): Promise<UnsubscribeTokenRecord | null> {
  return prisma.unsubscribeToken.findUnique({
    where: { token },
    select: {
      token: true,
      userId: true,
      searchId: true,
      usedAt: true,
    },
  });
}

async function applyUnsubscribe(record: UnsubscribeTokenRecord): Promise<UnsubscribeResult> {
  const usedAt = new Date();

  if (record.searchId) {
    await prisma.$transaction([
      prisma.unsubscribeToken.update({
        where: { token: record.token },
        data: { usedAt },
      }),
      prisma.savedSearch.update({
        where: { id: record.searchId },
        data: { isActive: false },
      }),
    ]);

    return 'search';
  }

  await prisma.$transaction([
    prisma.unsubscribeToken.update({
      where: { token: record.token },
      data: { usedAt },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: {
        isUnsubscribed: true,
        unsubscribedAt: usedAt,
      },
    }),
  ]);

  return 'global';
}

export async function GET(req: Request) {
  try {
    const token = getToken(req);
    const record = token ? await findUnsubscribeToken(token) : null;
    const classification = classifyUnsubscribeToken(token, record);

    if (classification.status === 'active' && record) {
      await applyUnsubscribe(record);
    }

    return htmlResponse(classification.title, classification.message, classification.statusCode);
  } catch (error) {
    console.error('Unsubscribe error:', error);

    return htmlResponse(
      'Something Went Wrong',
      'We could not update your email preferences. Please try again or contact David Quinn Group directly.',
      500,
    );
  }
}

// app/api/unsubscribe/route.ts
