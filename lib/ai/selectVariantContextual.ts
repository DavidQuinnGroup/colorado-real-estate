import { prisma } from '@/lib/prisma';

type Variant = 'A' | 'B';

type SellerLeadRow = {
  contextKey?: unknown;
  repliedAt?: unknown;
  status?: unknown;
  variant?: unknown;
};

type SellerLeadJsonResult = {
  row: SellerLeadRow;
};

type ContextStats = Record<Variant, { total: number; replies: number; wins: number }>;

const VARIANTS: Variant[] = ['A', 'B'];
const EPSILON = 0.2;

export async function selectVariantContextual(contextKey: string): Promise<Variant> {
  try {
    if (Math.random() < EPSILON) {
      return randomVariant();
    }

    const stats = await getContextStats(contextKey);

    let bestVariant = VARIANTS[0];
    let bestScore = -1;

    for (const variant of VARIANTS) {
      const stat = stats[variant];

      if (stat.total < 3) continue;

      const replyRate = stat.replies / stat.total;
      const winRate = stat.wins / stat.total;
      const score = replyRate * 0.7 + winRate * 0.3;

      if (score > bestScore) {
        bestScore = score;
        bestVariant = variant;
      }
    }

    return bestVariant;
  } catch (error) {
    console.error('Contextual bandit error:', error);
    return randomVariant();
  }
}

function randomVariant(): Variant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

function normalizeVariant(value: unknown): Variant | null {
  return value === 'A' || value === 'B' ? value : null;
}

function hasReply(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

function isWon(value: unknown) {
  return typeof value === 'string' && value.toLowerCase() === 'won';
}

function createEmptyStats(): ContextStats {
  return {
    A: { total: 0, replies: 0, wins: 0 },
    B: { total: 0, replies: 0, wins: 0 },
  };
}

async function getSellerLeadRows(): Promise<SellerLeadRow[]> {
  const rows = await prisma.$queryRaw<SellerLeadJsonResult[]>`
    SELECT to_jsonb("SellerLead") AS row
    FROM "SellerLead"
  `;

  return rows.map((result) => result.row);
}

async function getContextStats(contextKey: string): Promise<ContextStats> {
  const leads = await getSellerLeadRows();
  const stats = createEmptyStats();

  for (const lead of leads) {
    if (lead.contextKey !== contextKey) continue;

    const variant = normalizeVariant(lead.variant);
    if (!variant) continue;

    stats[variant].total++;

    if (hasReply(lead.repliedAt)) stats[variant].replies++;
    if (isWon(lead.status)) stats[variant].wins++;
  }

  return stats;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/selectVariantContextual.ts
