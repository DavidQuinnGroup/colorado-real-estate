import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

type ValuationLevels = {
  aboveGrade: number;
  finishedBasement: number;
  unfinishedShell: number;
};

type ValuationRequestBody = {
  name?: unknown;
  email?: unknown;
  address?: unknown;
  levels?: unknown;
  condition?: unknown;
  mortgage?: unknown;
};

type NormalizedValuationRequest = {
  name: string;
  email: string;
  address: string;
  levels: ValuationLevels;
  condition: string;
  mortgage: number;
};

const MARKET_RATE_PER_SQFT = 850;
const UNFINISHED_SHELL_RATE_PER_SQFT = 150;
const BASEMENT_VALUE_RATIO = 0.65;
const HIGH_INTENT_HEAT_SCORE = 85;

const finishMultipliers: Record<string, number> = {
  Original: 0.9,
  Standard: 1,
  Renovated: 1.15,
  'Designer-Grade': 1.3,
};

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables for valuation route.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function toCleanString(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;

  const cleaned = String(value).trim();
  return cleaned || fallback;
}

function toNumber(value: unknown, fallback = 0) {
  if (value === undefined || value === null || value === '') return fallback;

  const parsed = Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeLevels(value: unknown): ValuationLevels {
  const levels = isRecord(value) ? value : {};

  return {
    aboveGrade: toNumber(levels.aboveGrade),
    finishedBasement: toNumber(levels.finishedBasement),
    unfinishedShell: toNumber(levels.unfinishedShell),
  };
}

function normalizeRequestBody(body: ValuationRequestBody): NormalizedValuationRequest {
  return {
    name: toCleanString(body.name),
    email: toCleanString(body.email),
    address: toCleanString(body.address, 'Colorado property'),
    levels: normalizeLevels(body.levels),
    condition: toCleanString(body.condition, 'Standard'),
    mortgage: toNumber(body.mortgage),
  };
}

function calculateValuation(levels: ValuationLevels, condition: string, mortgage: number) {
  const baseValue =
    levels.aboveGrade * MARKET_RATE_PER_SQFT +
    levels.finishedBasement * (MARKET_RATE_PER_SQFT * BASEMENT_VALUE_RATIO) +
    levels.unfinishedShell * UNFINISHED_SHELL_RATE_PER_SQFT;
  const optimizedValue = baseValue * (finishMultipliers[condition] ?? 1);
  const estimatedEquity = optimizedValue - mortgage;

  return {
    baseValue,
    optimizedValue,
    estimatedEquity,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function buildDavidBriefHtml(input: NormalizedValuationRequest, optimizedValue: number, estimatedEquity: number) {
  return `
    <div style="font-family: monospace; background: #030303; color: #fff; padding: 20px; border-left: 4px solid #00ff80;">
      <h2 style="color: #00ff80; text-transform: uppercase;">Pre-Discovery Brief Initialized</h2>
      <p><strong>Target:</strong> ${input.name} (${input.email})</p>
      <p><strong>Asset:</strong> ${input.address}</p>
      <hr style="border: 1px solid #1a1a1a;" />
      <h3 style="color: #00ff80;">GC FORENSICS</h3>
      <p>Above Grade: ${input.levels.aboveGrade} sqft</p>
      <p>Finish Grade: ${input.condition}</p>
      <p><strong>DQG Optimized Value:</strong> $${optimizedValue.toLocaleString()}</p>
      <p><strong>Available Equity:</strong> $${estimatedEquity.toLocaleString()}</p>
      <hr style="border: 1px solid #1a1a1a;" />
      <p style="font-size: 10px; color: #444;">TACTICAL LEVER: OPENNESS TO VALUE-ADD STRATEGY IDENTIFIED</p>
    </div>
  `;
}

function buildClientResponseHtml(input: NormalizedValuationRequest) {
  return `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Strategic Analysis Initiated</h2>
      <p>Hi ${input.name},</p>
      <p>I’ve applied my 30-year General Contractor lens to your property at <strong>${input.address}</strong>.</p>
      <p>My preliminary analysis shows a <strong>David Quinn Optimized Value</strong> that exceeds standard portal estimates by identifying your home's structural craftsmanship.</p>
      <p style="background: #f4f4f4; padding: 15px; border-radius: 5px; font-weight: bold;">
        To unlock the full 60% Strategy Gate, including the Tactical Negotiation Playbook and Shadow Inventory access, let's schedule your 15-minute Discovery Call.
      </p>
      <p>Talk soon,</p>
      <p><strong>David Quinn</strong><br/><em>Construction Pedigree. Real Estate Authority.</em></p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ValuationRequestBody;
    const input = normalizeRequestBody(body);

    if (!input.name || !input.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const valuation = calculateValuation(input.levels, input.condition, input.mortgage);

    const { error: dbError } = await supabase.from('leads').insert([
      {
        name: input.name,
        email: input.email,
        address: input.address,
        metadata: {
          structural_data: input.levels,
          condition_grade: input.condition,
          financial_intent: {
            optimized_value: valuation.optimizedValue,
            current_mortgage: input.mortgage,
            estimated_equity: valuation.estimatedEquity,
          },
          lead_heat_score: HIGH_INTENT_HEAT_SCORE,
        },
      },
    ]);

    if (dbError) throw dbError;

    await resend.emails.send({
      from: 'DQG Intelligence <onboarding@resend.dev>',
      to: 'david@davidquinnrealestate.com',
      subject: `INTEL BRIEF: Valuation Request - ${input.name}`,
      html: buildDavidBriefHtml(input, valuation.optimizedValue, valuation.estimatedEquity),
    });

    await resend.emails.send({
      from: 'David Quinn <onboarding@resend.dev>',
      to: input.email,
      subject: `Your ${input.address} Strategy Report is Pending`,
      html: buildClientResponseHtml(input),
    });

    return NextResponse.json({
      success: true,
      optimizedValue: valuation.optimizedValue,
      estimatedEquity: valuation.estimatedEquity,
    });
  } catch (error) {
    console.error('Valuation Engine Error:', getErrorMessage(error));
    return NextResponse.json({ error: 'Intelligence Sync Failed' }, { status: 500 });
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/valuation/route.ts
