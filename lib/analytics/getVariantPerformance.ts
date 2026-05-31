import { prisma } from '@/lib/prisma';

type SellerLeadRow = {
  contactedAt?: unknown;
  convertedAt?: unknown;
  variant?: unknown;
};

type SellerLeadJsonResult = {
  row: SellerLeadRow;
};

type VariantPerformanceStats = {
  total: number;
  contacted: number;
  converted: number;
};

export type VariantPerformance = VariantPerformanceStats & {
  variant: string;
  contactRate: number;
  conversionRate: number;
};

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

function getVariant(value: unknown) {
  return hasValue(value) ? String(value) : 'unknown';
}

async function getSellerLeadRows(): Promise<SellerLeadRow[]> {
  const rows = await prisma.$queryRaw<SellerLeadJsonResult[]>`
    SELECT to_jsonb("SellerLead") AS row
    FROM "SellerLead"
  `;

  return rows.map((result) => result.row);
}

export async function getVariantPerformance(): Promise<VariantPerformance[]> {
  const leads = await getSellerLeadRows();
  const grouped: Record<string, VariantPerformanceStats> = {};

  for (const lead of leads) {
    const variant = getVariant(lead.variant);

    grouped[variant] ??= {
      total: 0,
      contacted: 0,
      converted: 0,
    };

    grouped[variant].total++;

    if (hasValue(lead.contactedAt)) grouped[variant].contacted++;
    if (hasValue(lead.convertedAt)) grouped[variant].converted++;
  }

  return Object.entries(grouped).map(([variant, stats]) => ({
    variant,
    ...stats,
    contactRate: stats.total ? stats.contacted / stats.total : 0,
    conversionRate: stats.total ? stats.converted / stats.total : 0,
  }));
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/analytics/getVariantPerformance.ts
