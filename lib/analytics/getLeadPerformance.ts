import { prisma } from '@/lib/prisma';

type SellerLeadRow = {
  contactedAt?: unknown;
  convertedAt?: unknown;
};

type SellerLeadJsonResult = {
  row: SellerLeadRow;
};

export type LeadPerformance = {
  total: number;
  contacted: number;
  converted: number;
  contactRate: number;
  conversionRate: number;
};

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== '';
}

async function getSellerLeadRows(): Promise<SellerLeadRow[]> {
  const rows = await prisma.$queryRaw<SellerLeadJsonResult[]>`
    SELECT to_jsonb("SellerLead") AS row
    FROM "SellerLead"
  `;

  return rows.map((result) => result.row);
}

export async function getLeadPerformance(): Promise<LeadPerformance> {
  const leads = await getSellerLeadRows();
  const total = leads.length;
  const contacted = leads.filter((lead) => hasValue(lead.contactedAt)).length;
  const converted = leads.filter((lead) => hasValue(lead.convertedAt)).length;

  return {
    total,
    contacted,
    converted,
    contactRate: total ? contacted / total : 0,
    conversionRate: total ? converted / total : 0,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/analytics/getLeadPerformance.ts
