import type { CRMTask, Prisma } from '@prisma/client';

import { prisma } from '../prisma';

export type CRMTaskTrigger = 'HEAT_SCORE' | 'GRAND_PLAN_COMPLETE' | 'MANUAL';

type InteractionMetadata = {
  styleTag?: unknown;
  listingId?: unknown;
  source?: unknown;
  destination?: unknown;
  savedSearchId?: unknown;
  city?: unknown;
  marketScope?: unknown;
  searchType?: unknown;
  reieGoal?: unknown;
  reieGoalLabel?: unknown;
  clientReieGoalLabel?: unknown;
  timeline?: unknown;
  timelineLabel?: unknown;
  clientTimelineLabel?: unknown;
  leadTemperature?: unknown;
  sourceLabel?: unknown;
  authoritySignals?: unknown;
  notes?: unknown;
  alertReadiness?: unknown;
  capturedAt?: unknown;
};

type AlertPayload = {
  propertyId?: unknown;
  id?: unknown;
  mlsId?: unknown;
  slug?: unknown;
  address?: unknown;
  city?: unknown;
  price?: unknown;
  beds?: unknown;
};

type AlertReadiness = {
  level: 'ready' | 'watch' | 'incomplete' | 'unknown';
  summary: string;
  blockers: string[];
  signals: string[];
};

type LeadInteraction = {
  type: string;
  duration: number | null;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

type SavedSearchIntake = {
  savedSearchId: string | null;
  capturedAt: string | null;
  city: string | null;
  marketScope: string | null;
  searchType: string | null;
  reieGoal: string | null;
  reieGoalLabel: string | null;
  timeline: string | null;
  timelineLabel: string | null;
  leadTemperature: string | null;
  source: string | null;
  sourceLabel: string | null;
  authoritySignals: string[];
  hasNotes: boolean;
  alertReadiness: AlertReadiness;
};

const TASK_TYPE = 'PRE_DISCOVERY_BRIEF';
const HIGH_HEAT_THRESHOLD = 80;
const URGENT_HEAT_THRESHOLD = 85;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeText(value: unknown, fallback = '') {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || fallback;
}

function normalizeNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;

  return Math.round(parsed);
}

function getInteractionMetadata(value: unknown): InteractionMetadata {
  return isRecord(value) ? value : {};
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 8);
}

function getAlertReadiness(value: unknown): AlertReadiness {
  const readiness = isRecord(value) ? value : {};
  const rawLevel = normalizeText(readiness.level).toLowerCase();
  const level =
    rawLevel === 'ready' || rawLevel === 'watch' || rawLevel === 'incomplete'
      ? rawLevel
      : 'unknown';

  return {
    level,
    summary: normalizeText(readiness.summary, level === 'unknown' ? 'No saved-search alert readiness has been recorded for this lead yet.' : ''),
    blockers: getStringArray(readiness.blockers),
    signals: getStringArray(readiness.signals),
  };
}

function getAlertPayload(value: unknown): AlertPayload {
  return isRecord(value) ? value : {};
}

function getAestheticProfile(
  interactions: Array<{
    type: string;
    duration: number | null;
    metadata: Prisma.JsonValue | null;
  }>,
) {
  const profile = new Map<string, number>();

  for (const interaction of interactions) {
    if (interaction.type !== 'IMAGE_DWELL') continue;

    const metadata = getInteractionMetadata(interaction.metadata);
    const styleTag = normalizeText(metadata.styleTag, 'Standard');
    const duration = interaction.duration || 1;

    profile.set(styleTag, (profile.get(styleTag) || 0) + duration);
  }

  return [...profile.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([styleTag, weight]) => ({ styleTag, weight }));
}

function getPrimaryAesthetic(profile: Array<{ styleTag: string; weight: number }>, fallback: string | null) {
  if (profile[0]?.styleTag) return profile[0].styleTag;
  return normalizeText(fallback, 'Unknown');
}

function getLatestSavedSearchIntake(interactions: LeadInteraction[]): SavedSearchIntake | null {
  const interaction = interactions.find((item) => {
    const metadata = getInteractionMetadata(item.metadata);
    return item.type === 'save_search' || Boolean(normalizeText(metadata.savedSearchId));
  });

  if (!interaction) return null;

  const metadata = getInteractionMetadata(interaction.metadata);

  return {
    savedSearchId: normalizeText(metadata.savedSearchId) || null,
    capturedAt: normalizeText(metadata.capturedAt) || interaction.createdAt.toISOString(),
    city: normalizeText(metadata.city) || null,
    marketScope: normalizeText(metadata.marketScope) || null,
    searchType: normalizeText(metadata.searchType) || null,
    reieGoal: normalizeText(metadata.reieGoal) || null,
    reieGoalLabel: normalizeText(metadata.clientReieGoalLabel) || normalizeText(metadata.reieGoalLabel) || null,
    timeline: normalizeText(metadata.timeline) || null,
    timelineLabel: normalizeText(metadata.clientTimelineLabel) || normalizeText(metadata.timelineLabel) || null,
    leadTemperature: normalizeText(metadata.leadTemperature) || null,
    source: normalizeText(metadata.source) || null,
    sourceLabel: normalizeText(metadata.sourceLabel) || null,
    authoritySignals: getStringArray(metadata.authoritySignals),
    hasNotes: Boolean(normalizeText(metadata.notes)),
    alertReadiness: getAlertReadiness(metadata.alertReadiness),
  };
}

function getClickedListings(
  alerts: Array<{
    clickedAt: Date | null;
    payload: Prisma.JsonValue | null;
  }>,
) {
  return alerts.map((alert) => {
    const payload = getAlertPayload(alert.payload);

    return {
      clickedAt: alert.clickedAt?.toISOString() || null,
      listingId:
        normalizeText(payload.propertyId) ||
        normalizeText(payload.id) ||
        normalizeText(payload.mlsId) ||
        normalizeText(payload.slug) ||
        null,
      address: normalizeText(payload.address) || null,
      city: normalizeText(payload.city) || null,
      price: normalizeNumber(payload.price),
      beds: normalizeNumber(payload.beds),
    };
  });
}

function getPriority(triggerType: CRMTaskTrigger, heatScore: number) {
  if (triggerType === 'GRAND_PLAN_COMPLETE' || heatScore >= HIGH_HEAT_THRESHOLD) return 'high';
  if (triggerType === 'HEAT_SCORE' || heatScore >= 50) return 'medium';

  return 'low';
}

function getIntentSummary(lead: {
  intentSchema: string | null;
  legacyGoal: string | null;
  preferences: {
    avgPrice: number | null;
    avgBeds: number | null;
    topCities: string[];
  } | null;
}) {
  if (lead.intentSchema) return lead.intentSchema;
  if (lead.legacyGoal) return lead.legacyGoal;

  const parts = [
    lead.preferences?.avgPrice ? `avg clicked price $${lead.preferences.avgPrice.toLocaleString('en-US')}` : null,
    lead.preferences?.avgBeds !== null && lead.preferences?.avgBeds !== undefined
      ? `${lead.preferences.avgBeds} avg beds`
      : null,
    lead.preferences?.topCities?.length ? `top cities: ${lead.preferences.topCities.join(', ')}` : null,
  ].filter(Boolean);

  return parts.length ? parts.join('; ') : 'Pending buyer intent capture.';
}

function getTacticalLevers(heatScore: number, clickedListingCount: number) {
  if (heatScore >= URGENT_HEAT_THRESHOLD && clickedListingCount > 0) {
    return 'High-intent lead with recent property engagement. Prioritize direct outreach and prepare a short property-specific advisory.';
  }

  if (clickedListingCount > 1) {
    return 'Multiple listing clicks detected. Compare clicked homes for budget, location, and property-condition patterns before outreach.';
  }

  if (heatScore >= HIGH_HEAT_THRESHOLD) {
    return 'High heat score without broad click history. Confirm motivation, timeline, and financing readiness before recommending inventory.';
  }

  return 'Continue intelligence capture. Use saved-search and clicked-property patterns to clarify fit before initiating a high-pressure sales motion.';
}

function getNextAction(heatScore: number, clickedListingCount: number, savedSearchIntake: SavedSearchIntake | null) {
  if (savedSearchIntake?.alertReadiness.level === 'incomplete') {
    return 'Strengthen saved-search criteria before relying on automated alert matching or direct outreach.';
  }

  if (savedSearchIntake?.alertReadiness.level === 'ready' && savedSearchIntake.leadTemperature === 'hot') {
    return 'Prepare direct outreach with saved-search criteria, recent clicks, and one specific advisory point.';
  }

  if (heatScore >= URGENT_HEAT_THRESHOLD && clickedListingCount > 0) {
    return 'Create a same-day advisory brief and prioritize direct outreach.';
  }

  if (savedSearchIntake?.alertReadiness.level === 'ready') {
    return 'Review saved-search criteria and connect matching inventory to the client goal.';
  }

  if (!savedSearchIntake) {
    return 'Capture a saved search or REIE intake before relying on automated recommendations.';
  }

  return 'Review the latest saved-search intake and continue intelligence capture before outreach.';
}

async function getExistingPendingTask(leadId: string) {
  return prisma.cRMTask.findFirst({
    where: {
      leadId,
      type: TASK_TYPE,
      status: 'pending',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createTask(leadId: string, triggerType: CRMTaskTrigger): Promise<CRMTask | null> {
  const normalizedLeadId = leadId.trim();

  if (!normalizedLeadId) return null;

  try {
    if (triggerType !== 'MANUAL') {
      const existingTask = await getExistingPendingTask(normalizedLeadId);
      if (existingTask) return existingTask;
    }

    const lead = await prisma.user.findUnique({
      where: { id: normalizedLeadId },
      select: {
        id: true,
        email: true,
        name: true,
        heatScore: true,
        aestheticTag: true,
        intentSchema: true,
        legacyGoal: true,
        interactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
          select: {
            type: true,
            duration: true,
            metadata: true,
            createdAt: true,
          },
        },
        preferences: {
          select: {
            avgPrice: true,
            avgBeds: true,
            topCities: true,
          },
        },
        northStars: {
          take: 5,
          select: {
            name: true,
            address: true,
            type: true,
            frequency: true,
          },
        },
        alertQueue: {
          where: {
            clickedAt: {
              not: null,
            },
          },
          orderBy: {
            clickedAt: 'desc',
          },
          take: 5,
          select: {
            clickedAt: true,
            payload: true,
          },
        },
      },
    });

    if (!lead) return null;

    const heatScore = lead.heatScore || 0;
    const aestheticProfile = getAestheticProfile(lead.interactions);
    const clickedListings = getClickedListings(lead.alertQueue);
    const latestSavedSearchIntake = getLatestSavedSearchIntake(lead.interactions);
    const primaryAnchor = lead.northStars[0] || null;
    const priority = getPriority(triggerType, heatScore);

    const metadata: Prisma.InputJsonObject = {
      intelligenceSchemaVersion: 'reie-pre-discovery-brief-v2',
      leadId: lead.id,
      email: lead.email,
      heatScore,
      trigger: triggerType,
      intentSummary: getIntentSummary(lead),
      aestheticProfile,
      primaryAesthetic: getPrimaryAesthetic(aestheticProfile, lead.aestheticTag),
      preferences: {
        avgPrice: lead.preferences?.avgPrice ?? null,
        avgBeds: lead.preferences?.avgBeds ?? null,
        topCities: lead.preferences?.topCities ?? [],
      },
      northStars: lead.northStars.map((northStar) => ({
        name: northStar.name,
        address: northStar.address,
        type: northStar.type,
        frequency: northStar.frequency,
      })),
      primaryAnchor: primaryAnchor
        ? {
            name: primaryAnchor.name,
            address: primaryAnchor.address,
            type: primaryAnchor.type,
          }
        : null,
      clickedListings,
      latestSavedSearchIntake,
      alertReadiness: latestSavedSearchIntake?.alertReadiness ?? getAlertReadiness(null),
      tacticalLevers: getTacticalLevers(heatScore, clickedListings.length),
      nextAction: getNextAction(heatScore, clickedListings.length, latestSavedSearchIntake),
      operations: {
        terminal: 'Terminal 5',
        reviewCommand: 'npm run run:crm -- --limit 20 --status pending',
        intakeCommand: 'curl -s http://localhost:3000/api/admin/intake-signals',
      },
      generatedAt: new Date().toISOString(),
    };

    const task = await prisma.cRMTask.create({
      data: {
        leadId: normalizedLeadId,
        type: TASK_TYPE,
        status: 'pending',
        priority,
        title: `PRE-DISCOVERY BRIEF: ${lead.name || lead.email}`,
        metadata,
      },
    });

    console.log(`[REIE CRM] ${triggerType} task created for ${lead.email}.`);

    return task;
  } catch (error) {
    console.error('[REIE CRM] Client DNA synthesis failure:', error);
    return null;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/crm/createTask.ts
