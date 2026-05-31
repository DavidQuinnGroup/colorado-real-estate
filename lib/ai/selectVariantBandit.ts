import { prisma } from '@/lib/prisma';

type Variant = 'A' | 'B';

type SellerLeadRow = {
  variant?: unknown;
  repliedAt?: unknown;
};

type SellerLeadJsonResult = {
  row: SellerLeadRow;
};

type VariantStats = Record<Variant, { total: number; replies: number }>;

const VARIANTS: Variant[] = ['A', 'B'];
const EPSILON = 0.2;

export async function selectVariantBandit(): Promise<Variant> {
  try {
    if (Math.random() < EPSILON) {
      return randomVariant();
    }

    const stats = await getVariantStats();

    let bestVariant = VARIANTS[0];
    let bestScore = -1;

    for (const variant of VARIANTS) {
      const stat = stats[variant];

      if (stat.total < 5) continue;

      const replyRate = stat.replies / stat.total;

      if (replyRate > bestScore) {
        bestScore = replyRate;
        bestVariant = variant;
      }
    }

    return bestVariant;
  } catch (error) {
    console.error('Bandit error:', error);
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

function createEmptyStats(): VariantStats {
  return {
    A: { total: 0, replies: 0 },
    B: { total: 0, replies: 0 },
  };
}

async function getSellerLeadRows(): Promise<SellerLeadRow[]> {
  const rows = await prisma.$queryRaw<SellerLeadJsonResult[]>`
    SELECT to_jsonb("SellerLead") AS row
    FROM "SellerLead"
  `;

  return rows.map((result) => result.row);
}

async function getVariantStats(): Promise<VariantStats> {
  const leads = await getSellerLeadRows();
  const stats = createEmptyStats();

  for (const lead of leads) {
    const variant = normalizeVariant(lead.variant);
    if (!variant) continue;

    stats[variant].total++;

    if (hasReply(lead.repliedAt)) {
      stats[variant].replies++;
    }
  }

  return stats;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/selectVariantBandit.ts
