import { createHash } from 'node:crypto';

import type { Prisma } from '@prisma/client';

import {
  isSellerFinancialOutputSemanticProfile,
  type SellerFinancialOutputSemanticProfile,
} from './sellerFinancialOutputIntegration';

export const SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION =
  'SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_V1' as const;

export type SellerPresentationFinancialModule = Readonly<{
  schemaVersion: typeof SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION;
  moduleKind: 'SELLER_FINANCIAL_MODULE';
  title: 'Estimated Seller Net Proceeds';
  qualifier: 'ESTIMATED';
  financialOutputVersionId: string;
  financialOutputSourceVersionRef: string;
  financialOutputContentFingerprint: string;
  asOf: string;
  estimatedSalePriceCents: number;
  estimatedPayoffCents: number;
  estimatedSellerCostsCents: number;
  estimatedNetProceedsCents: number;
  netProceedsBasisPoints: number | null;
  costBreakdown: SellerFinancialOutputSemanticProfile['costBreakdown'];
  sourceQualifications: SellerFinancialOutputSemanticProfile['sourceQualifications'];
  unknownZeroNotIncluded: SellerFinancialOutputSemanticProfile['unknownZeroNotIncluded'];
  limitations: readonly string[];
}>;

export class SellerPresentationFinancialModuleAdapterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function sellerPresentationFinancialModuleFingerprint(module: SellerPresentationFinancialModule) {
  return createHash('sha256').update(stableJson(module)).digest('hex');
}

export function adaptSellerFinancialModuleToSellerPresentation(input: Readonly<{
  financialOutputVersionId: string;
  financialOutputSourceVersionRef: string;
  financialOutputContentFingerprint: string;
  contentPayload: Prisma.JsonValue;
}>): SellerPresentationFinancialModule {
  if (!input.financialOutputVersionId || !input.financialOutputSourceVersionRef || !input.financialOutputContentFingerprint) {
    throw new SellerPresentationFinancialModuleAdapterError('A reviewed Seller Financial output identity is required.');
  }
  if (!isSellerFinancialOutputSemanticProfile(input.contentPayload)) {
    throw new SellerPresentationFinancialModuleAdapterError('The selected output is not a reviewed Seller Financial semantic profile.');
  }
  const financial = input.contentPayload;
  return Object.freeze({
    schemaVersion: SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
    moduleKind: 'SELLER_FINANCIAL_MODULE',
    title: 'Estimated Seller Net Proceeds',
    qualifier: 'ESTIMATED',
    financialOutputVersionId: input.financialOutputVersionId,
    financialOutputSourceVersionRef: input.financialOutputSourceVersionRef,
    financialOutputContentFingerprint: input.financialOutputContentFingerprint,
    asOf: financial.result.asOf,
    estimatedSalePriceCents: financial.financials.estimatedSalePriceCents,
    estimatedPayoffCents: financial.financials.estimatedPayoffCents,
    estimatedSellerCostsCents: financial.financials.estimatedSellerCostsCents,
    estimatedNetProceedsCents: financial.financials.estimatedNetProceedsCents,
    netProceedsBasisPoints: financial.financials.netProceedsBasisPoints,
    costBreakdown: financial.costBreakdown,
    sourceQualifications: financial.sourceQualifications,
    unknownZeroNotIncluded: financial.unknownZeroNotIncluded,
    limitations: financial.limitations,
  });
}

export function isSellerPresentationFinancialModule(value: unknown): value is SellerPresentationFinancialModule {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.schemaVersion === SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION
    && record.moduleKind === 'SELLER_FINANCIAL_MODULE'
    && record.title === 'Estimated Seller Net Proceeds'
    && record.qualifier === 'ESTIMATED'
    && typeof record.financialOutputVersionId === 'string'
    && typeof record.financialOutputContentFingerprint === 'string'
    && typeof record.estimatedNetProceedsCents === 'number';
}
