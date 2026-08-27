'use client';

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers3,
  LayoutGrid,
  ListChecks,
  MapPinned,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import AgentPreparationPageHeader from '@/components/agent/AgentPreparationPageHeader';
import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import {
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_FIXTURE,
  type SellerDecisionBriefModulePresentation,
  type SellerDecisionBriefPreviewMode,
  type SellerDecisionBriefReadinessState,
  type SellerDecisionBriefSectionPresentation,
} from '@/lib/sellerDecisionBriefCompositionPreview';
import {
  SELLER_DECISION_BRIEF_V2_FIXTURE,
  narrativeForModule,
  narrativeForSection,
  type SellerDecisionBriefNarrativeUnit,
} from '@/lib/sellerDecisionBriefV2';
import {
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE,
  type SellerPricingFramework,
  type SellerPricingScenario,
} from '@/lib/sellerPricingPositioningDecisionFramework';
import {
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_FIXTURE,
  type SellerPostLaunchCurrentRefresh,
  type SellerPostLaunchReview,
} from '@/lib/sellerPostLaunchCurrentContextReview';
import {
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE,
  type AtlasOutputVersionFoundation,
} from '@/lib/outputVersionLineageInvalidationFoundation';

const preview = SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_FIXTURE;
const sellerV2 = SELLER_DECISION_BRIEF_V2_FIXTURE;
const pricingFramework = SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE;
const postLaunchReview = SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_FIXTURE;
const outputVersionFoundation = OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE;

const modeLabels: Record<SellerDecisionBriefPreviewMode, string> = {
  AGENT_REVIEW: 'Agent review',
  SELLER_PREVIEW: 'Seller preview',
  PRINT_PREVIEW: 'Print preview',
};

const readinessLabels: Record<SellerDecisionBriefReadinessState, string> = {
  READY: 'Ready',
  AGENT_INPUT_REQUIRED: 'Agent input required',
  AGENT_REVIEW_REQUIRED: 'Agent review required',
  EVIDENCE_REQUIRED: 'Evidence required',
  RIGHTS_REQUIRED: 'Rights required',
  FRESHNESS_REQUIRED: 'Freshness required',
  CONTEXTUAL_OPTIONAL: 'Contextual / optional',
};

const semanticLabels = [
  'Source fact',
  'ATLAS intelligence',
  'ATLAS analysis',
  'Agent input',
  'Agent interpretation',
  'Agent recommendation',
  'Assumption',
  'Verification required',
  'Limitation',
  'Professional handoff',
] as const;

const fixturePropertyFacts = [
  ['Subject', preview.brief.outputProduct.context.subject.label],
  ['Type', 'Single-family reference property'],
  ['Beds / baths', '4 beds / 3 baths'],
  ['Living area', '2,840 sq ft'],
  ['Lot', '7,405 sq ft'],
  ['Year built', '1998'],
] as const;

const marketMetrics = [
  ['Cohort', 'Current local buyer choice set'],
  ['Population', 'Fixture cohort for review'],
  ['As of', preview.brief.outputProduct.effectiveAsOf],
  ['Use', 'Orientation only'],
] as const;

export default function SellerDecisionBriefCompositionPreview() {
  const [mode, setMode] = useState<SellerDecisionBriefPreviewMode>('AGENT_REVIEW');
  const [selectedSectionId, setSelectedSectionId] = useState(preview.selectedSectionId);
  const [selectedModuleId, setSelectedModuleId] = useState(preview.selectedModuleId);
  const selectedSection = useMemo(
    () => preview.sectionPresentations.find((section) => section.sectionId === selectedSectionId) ?? preview.sectionPresentations[0],
    [selectedSectionId],
  );
  const selectedModule = useMemo(
    () => selectedSection.modules.find((module) => module.module.id === selectedModuleId) ?? selectedSection.modules[0],
    [selectedModuleId, selectedSection],
  );
  const sectionsReady = preview.sectionPresentations.filter((section) => section.readinessState === 'READY').length;
  const sectionNeedsInput = preview.sectionPresentations.filter((section) => section.readinessState === 'AGENT_INPUT_REQUIRED').length;
  const reviewRequired = preview.sectionPresentations.length - sectionsReady;

  function selectSection(section: SellerDecisionBriefSectionPresentation) {
    setSelectedSectionId(section.sectionId);
    setSelectedModuleId(section.modules[0]?.module.id ?? preview.selectedModuleId);
  }

  return (
    <main
      className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12"
      data-testid="seller-decision-brief-composition-preview"
      data-agent-only="true"
      data-persistence="false"
      data-provider-activity="false"
      data-customer-data="false"
      data-pdf-generation="false"
      data-share-delivery="false"
      data-preview-mode={mode}
    >
      <div className="mx-auto max-w-[92rem]">
        <header className="border-b border-white/10 pb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <AgentPreparationPageHeader
              pageTitle="SELLER PRESENTATION"
              taskHeading="Compose the Seller Decision Brief"
              description="Review the Seller Presentation through one canonical composition: Agent review, Seller preview, and print preview all use the same governed sections and modules."
              scopeNote="Session-only preview. No persistence, provider calls, PDF generation, share delivery, CRM, or customer mutation."
            />
            <a
              href="/agent/prepare/seller"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-cyan-100/25 px-4 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"
              data-testid="seller-presentation-back-to-preparation"
            >
              <ClipboardCheck size={16} aria-hidden="true" />
              Seller preparation
            </a>
          </div>
        </header>

        <section className="sticky top-0 z-10 -mx-5 border-b border-white/10 bg-[#071014]/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" aria-label="Seller Decision Brief controls" data-testid="seller-brief-top-bar">
          <div className="mx-auto flex max-w-[92rem] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TopBarItem label="Product" value={sellerV2.productTitle} />
              <TopBarItem label="Subject" value={preview.brief.outputProduct.context.subject.label} />
              <TopBarItem label="Version" value={sellerV2.version} />
              <TopBarItem label="As of" value={preview.brief.outputProduct.effectiveAsOf} />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <ReadinessBadge state={selectedModule.readinessState} label={`Overall: ${preview.brief.outputProduct.readiness.replaceAll('_', ' ')}`} />
              <div className="inline-flex min-h-11 overflow-hidden border border-white/15" role="group" aria-label="Preview mode" data-testid="seller-brief-mode-controls">
                {preview.modes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`min-h-11 px-3 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 ${mode === item ? 'bg-cyan-100 text-slate-950' : 'bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]'}`}
                    aria-pressed={mode === item}
                  >
                    {modeLabels[item]}
                  </button>
                ))}
              </div>
              <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 bg-cyan-200 px-4 text-sm font-semibold text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100" data-testid="seller-brief-review-action">
                <CheckCircle2 size={16} aria-hidden="true" />
                Review selected module
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)_22rem]" data-testid="seller-brief-three-region-workspace">
          <aside className="border border-white/10 bg-[#0b171c] p-4 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto" aria-label="Seller Decision Brief section navigation" data-testid="seller-brief-section-rail">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-cyan-100" aria-hidden="true" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">Sections</h2>
            </div>
            <nav className="mt-4 grid gap-2" aria-label="Seller Decision Brief sections">
              {preview.sectionPresentations.map((section) => (
                <button
                  key={section.sectionId}
                  type="button"
                  onClick={() => selectSection(section)}
                  className={`w-full border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100 ${section.sectionId === selectedSectionId ? 'border-cyan-100/50 bg-cyan-100/[0.08]' : 'border-white/10 bg-black/10 hover:border-white/30'}`}
                  data-testid="seller-brief-section-item"
                  aria-current={section.sectionId === selectedSectionId ? 'true' : undefined}
                >
                  <span className="block text-sm font-semibold text-white">{section.section.title}</span>
                  <span className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span>{readinessLabels[section.readinessState]}</span>
                    <span>{section.blockerCount} action{section.blockerCount === 1 ? '' : 's'}</span>
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          <section className={`bg-[#f7f3ec] text-[#172025] shadow-2xl shadow-black/30 ${mode === 'PRINT_PREVIEW' ? 'seller-brief-print-preview' : ''}`} data-testid="seller-brief-output-canvas" aria-label="Seller preview canvas">
            <OutputCover mode={mode} sectionsReady={sectionsReady} reviewRequired={reviewRequired} sectionNeedsInput={sectionNeedsInput} postLaunchReview={postLaunchReview} outputVersionFoundation={outputVersionFoundation} />
            <PricingDecisionFrameworkSection framework={pricingFramework} mode={mode} />
            <PostLaunchCurrentContextReviewSection review={postLaunchReview} mode={mode} />
            <OutputVersionLineageFoundationSection foundation={outputVersionFoundation} mode={mode} />
            {preview.sectionPresentations.map((section) => (
              <article
                key={section.sectionId}
                id={section.sectionId}
                className={`border-t border-[#d8cfc0] px-5 py-7 sm:px-8 lg:px-10 ${section.sectionId === selectedSectionId ? 'bg-white' : 'bg-[#f7f3ec]'}`}
                data-testid="seller-brief-canvas-section"
                data-density={section.density}
              >
                <OutputSectionHeader section={section} selected={section.sectionId === selectedSectionId} />
                <SectionNarrative section={section} />
                <div className="mt-5 grid gap-4">
                  {section.modules.map((module) => (
                    <ModuleCard
                      key={module.module.id}
                      module={module}
                      narrative={narrativeForModule(sellerV2, module.module.id)}
                      selected={module.module.id === selectedModule.module.id}
                      sellerMode={mode === 'SELLER_PREVIEW'}
                      onSelect={() => {
                        setSelectedSectionId(section.sectionId);
                        setSelectedModuleId(module.module.id);
                      }}
                    />
                  ))}
                </div>
              </article>
            ))}
            <footer className="border-t border-[#d8cfc0] bg-white px-5 py-5 text-xs leading-5 text-[#5d665f] sm:px-8 lg:px-10" data-testid="seller-brief-print-footer">
              Seller Decision Brief. Version {preview.version}. As of {preview.brief.outputProduct.effectiveAsOf}. Page number and output version seams are reserved for authorized PDF/print production.
            </footer>
          </section>

          <aside className="border border-white/10 bg-[#0b171c] p-4 xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto" aria-label="Selected module inspector" data-testid="seller-brief-module-inspector">
            <ModuleInspector module={selectedModule} narrative={narrativeForModule(sellerV2, selectedModule.module.id)} pricingFramework={pricingFramework} postLaunchReview={postLaunchReview} outputVersionFoundation={outputVersionFoundation} mode={mode} />
          </aside>
        </section>
      </div>
    </main>
  );
}

function TopBarItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border border-white/10 bg-white/[0.035] px-3 py-2"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-100/60">{label}</p><p className="mt-1 truncate text-sm font-semibold text-white">{value}</p></div>;
}

function ReadinessBadge({ state, label }: { state: SellerDecisionBriefReadinessState; label?: string }) {
  return <span className={`inline-flex min-h-8 items-center gap-2 rounded-[7px] px-3 text-xs font-semibold ${readinessClass(state)}`} data-testid="seller-brief-readiness-badge"><span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />{label ?? readinessLabels[state]}</span>;
}

function readinessClass(state: SellerDecisionBriefReadinessState) {
  if (state === 'READY') return 'bg-emerald-100 text-emerald-900';
  if (state === 'AGENT_INPUT_REQUIRED') return 'bg-amber-100 text-amber-900';
  if (state === 'AGENT_REVIEW_REQUIRED') return 'bg-sky-100 text-sky-900';
  if (state === 'EVIDENCE_REQUIRED') return 'bg-rose-100 text-rose-900';
  if (state === 'RIGHTS_REQUIRED' || state === 'FRESHNESS_REQUIRED') return 'bg-violet-100 text-violet-900';
  return 'bg-stone-200 text-stone-800';
}

function OutputCover({ mode, sectionsReady, reviewRequired, sectionNeedsInput, postLaunchReview, outputVersionFoundation }: { mode: SellerDecisionBriefPreviewMode; sectionsReady: number; reviewRequired: number; sectionNeedsInput: number; postLaunchReview: SellerPostLaunchReview; outputVersionFoundation: AtlasOutputVersionFoundation }) {
  return (
    <section className="grid gap-6 bg-[#efe5d4] px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-10" data-testid="seller-brief-output-cover">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#71624e]">Project Atlas / Seller Decision Brief</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-[#172025] sm:text-5xl">{preview.brief.outputProduct.context.subject.label}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#4d5652]">A composed, Agent-reviewed decision brief for the seller property, market, competition, pricing, positioning, preparation, launch strategy, recommendation, alternatives, next decisions, financial connections, and evidence.</p>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Semantic content grammar">
          {semanticLabels.map((label) => <span key={label} className="rounded-[7px] border border-[#cabda9] bg-white/50 px-3 py-1 text-xs font-semibold text-[#4d5652]">{label}</span>)}
        </div>
        <ol className="mt-6 grid gap-2 text-sm leading-6 text-[#4d5652]" data-testid="seller-brief-v2-story-flow" aria-label="Seller Decision Brief V2 story flow">
          {sellerV2.storyLayers.slice(0, 6).map((layer) => <li key={layer.layer}><span className="font-semibold text-[#172025]">{layer.layer}:</span> {layer.primaryQuestion}</li>)}
        </ol>
      </div>
      <div className="border border-[#cabda9] bg-white/55 p-4" data-testid="seller-brief-product-readiness">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Current readiness</p>
        <div className="mt-4 grid gap-3">
          <CoverMetric label="Sections ready" value={`${sectionsReady}/${preview.sectionPresentations.length}`} />
          <CoverMetric label="Need review" value={`${reviewRequired}`} />
          <CoverMetric label="Need Agent input" value={`${sectionNeedsInput}`} />
          <CoverMetric label="Mode" value={modeLabels[mode]} />
          <CoverMetric label="V2 narratives" value={`${sellerV2.narratives.length}`} />
          <CoverMetric label="Pricing options" value={`${pricingFramework.scenarios.length}`} />
          <CoverMetric label="Post-launch checkpoints" value="3" />
          <CoverMetric label="Seller Update modules" value={`${postLaunchReview.sellerUpdateProduct.modules.length}`} />
          <CoverMetric label="Output versions" value={`${outputVersionFoundation.outputVersions.length}`} />
          <CoverMetric label="Version warnings" value={`${outputVersionFoundation.dependencyWarnings.length}`} />
        </div>
      </div>
    </section>
  );
}

function CoverMetric({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#d8cfc0] pb-3 last:border-0 last:pb-0"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#172025]">{value}</p></div>;
}

function OutputSectionHeader({ section, selected }: { section: SellerDecisionBriefSectionPresentation; selected: boolean }) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" data-testid="seller-brief-output-section-header">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#786b58]">{section.density} / {section.section.kind.replaceAll('_', ' ')}</p>
        <h3 className="mt-1 text-2xl font-semibold leading-8 text-[#172025]">{section.section.title}</h3>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ReadinessBadge state={section.readinessState} />
        {selected ? <span className="rounded-[7px] bg-[#172025] px-3 py-1 text-xs font-semibold text-white">Selected</span> : null}
      </div>
    </header>
  );
}

function PricingDecisionFrameworkSection({ framework, mode }: { framework: SellerPricingFramework; mode: SellerDecisionBriefPreviewMode }) {
  const selectedScenario = framework.scenarios.find((scenario) => scenario.sellerSelectionState === 'SELLER_SELECTED') ?? framework.scenarios[0];
  return (
    <article
      className="border-t border-[#d8cfc0] bg-white px-5 py-8 sm:px-8 lg:px-10"
      data-testid="seller-pricing-positioning-decision-framework"
      data-version={framework.version}
      data-agent-authored="true"
      data-persistence="false"
      data-provider-activity="false"
      data-financial-advice="false"
    >
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div data-testid="pricing-executive-summary">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#786b58]">Seller pricing and positioning decision framework</p>
          <h3 className="mt-2 text-3xl font-semibold leading-9 text-[#172025]">Price is framed as a transparent decision, not an automated recommendation.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4d5652]">The Agent reviews the pricing objective, current context, current competition, search bands, options, positioning effect, tradeoffs, recommendation rationale, response checkpoints, Seller decision, and financial-link review state.</p>
        </div>
        <div className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="seller-pricing-decision-state">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Seller decision</p>
          <p className="mt-2 text-xl font-semibold text-[#172025]">{selectedScenario.name}</p>
          <p className="mt-2 text-sm leading-6 text-[#4d5652]">{formatCurrency(selectedScenario.priceAssumption.value)} / {framework.sellerDecision.state.replaceAll('_', ' ')}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Financial link: {selectedScenario.financialLink.financialLinkReviewState.replaceAll('_', ' ')}</p>
        </div>
      </header>

      <PricingObjective framework={framework} selectedScenario={selectedScenario} />
      <SearchBandLadder framework={framework} />
      <PriceOptionCards scenarios={framework.scenarios} />
      <ScenarioComparison framework={framework} />
      <SubjectPricePosition framework={framework} />
      <PricingTradeoffs framework={framework} />
      <PositioningEffect framework={framework} />
      <PricingAgentRationale framework={framework} />
      <ResponseCheckpointTimeline framework={framework} />
      <ReassessmentPanel framework={framework} />
      <SellerPricingDecisionPanel framework={framework} />
      <PricingEvidencePanel framework={framework} mode={mode} />
    </article>
  );
}

function PricingObjective({ framework, selectedScenario }: { framework: SellerPricingFramework; selectedScenario: SellerPricingScenario }) {
  const objective = framework.objectives.find((item) => item.id === selectedScenario.objectiveId);
  return (
    <section className="mt-7 border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="pricing-objective" data-visual-component="OutputPricingObjective">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Decision question</p>
      <h4 className="mt-1 text-xl font-semibold text-[#172025]">{objective?.sellerQuestion ?? 'What are we trying to accomplish with price?'}</h4>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Primary takeaway:</span> {objective?.displayName}. {selectedScenario.agentRationale}</p>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Agent interpretation:</span> Pricing options are Agent-authored professional judgment and must remain review-gated before Seller use.</p>
    </section>
  );
}

function SearchBandLadder({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6" data-testid="pricing-search-band-ladder" data-visual-component="OutputSearchBandLadder">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Search-band context</p>
          <h4 className="mt-1 text-2xl font-semibold text-[#172025]">Agent-defined bands make boundary semantics explicit.</h4>
        </div>
        <p className="text-sm font-semibold text-[#4d5652]">As of {framework.currentContext.asOf}</p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {framework.currentContext.searchBands.map((band) => (
          <div key={band.id} className="border border-[#d8cfc0] bg-[#f7f3ec] p-4" data-testid="pricing-search-band" data-band-id={band.id}>
            <p className="text-sm font-semibold text-[#172025]">{band.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#172025]">{formatCurrency(band.lowerBound)} - {formatCurrency(band.upperBound)}</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{band.boundarySemantics.label}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{band.currentListingCount} current listings / {band.subjectMembership.replaceAll('_', ' ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PriceOptionCards({ scenarios }: { scenarios: readonly SellerPricingScenario[] }) {
  return (
    <section className="mt-6" data-testid="pricing-price-option-cards" data-visual-component="OutputPriceOptionCard">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Options / tradeoffs</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={`border p-4 ${scenario.sellerSelectionState === 'SELLER_SELECTED' ? 'border-[#172025] bg-[#efe5d4]' : 'border-[#d8cfc0] bg-white'}`} data-testid="pricing-option-card" data-scenario-id={scenario.id}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#71624e]">{scenario.sellerSelectionState.replaceAll('_', ' ')}</p>
            <h4 className="mt-1 text-xl font-semibold text-[#172025]">{scenario.name}</h4>
            <p className="mt-2 text-3xl font-semibold text-[#172025]">{formatCurrency(scenario.priceAssumption.value)}</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{scenario.subjectPosition.sellerFacingLabel} / {scenario.searchBandMembership.replaceAll('_', ' ')}</p>
            <p className="mt-3 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Advantage:</span> {scenario.advantages[0]}</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Tradeoff:</span> {scenario.tradeoffIds[0].replaceAll('_', ' ')}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Checkpoint: {scenario.responseCheckpointIds[1]?.replaceAll('-', ' ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScenarioComparison({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6 overflow-x-auto" data-testid="pricing-scenario-comparison" data-visual-component="OutputPricingScenarioComparison">
      <table className="min-w-full border border-[#d8cfc0] text-sm">
        <caption className="pb-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Scenario comparison</caption>
        <thead className="bg-[#efe5d4]">
          <tr>
            {['Option', 'Price assumption', 'Search band', 'Position', 'Tradeoff', 'Financial link', 'Agent rationale'].map((heading) => <th key={heading} className="border border-[#d8cfc0] px-3 py-2 text-left">{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          {framework.scenarios.map((scenario) => (
            <tr key={scenario.id}>
              <td className="border border-[#d8cfc0] px-3 py-2 font-semibold">{scenario.name}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{formatCurrency(scenario.priceAssumption.value)}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{scenario.searchBandId}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{scenario.subjectPosition.sellerFacingLabel}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{scenario.tradeoffIds.join(', ').replaceAll('_', ' ')}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{scenario.financialLink.financialLinkReviewState.replaceAll('_', ' ')}</td>
              <td className="border border-[#d8cfc0] px-3 py-2">{scenario.agentRationale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function SubjectPricePosition({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6 border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="pricing-subject-price-position" data-visual-component="OutputSubjectPricePosition">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Subject price position</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {framework.scenarios.map((scenario) => (
          <div key={scenario.id} className="border border-[#d8cfc0] bg-white p-3">
            <p className="text-sm font-semibold text-[#172025]">{scenario.name}</p>
            <p className="mt-1 text-lg font-semibold text-[#172025]">{scenario.subjectPosition.sellerFacingLabel}</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{scenario.subjectPosition.definition}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingTradeoffs({ framework }: { framework: SellerPricingFramework }) {
  const visibleTradeoffs = framework.tradeoffs.slice(0, 9);
  return (
    <section className="mt-6" data-testid="pricing-tradeoff-matrix" data-visual-component="OutputPricingTradeoffMatrix">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Tradeoff matrix</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {visibleTradeoffs.map((tradeoff) => (
          <div key={tradeoff.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
            <p className="text-sm font-semibold text-[#172025]">{tradeoff.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#4d5652]">{tradeoff.agentStatement}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PositioningEffect({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6 border border-[#d8cfc0] bg-[#f7f3ec] p-4" data-testid="pricing-positioning-effect" data-visual-component="OutputPositioningEffect">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Positioning effect</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {framework.positioningThemes.map((theme) => (
          <div key={theme.id} className="border border-[#d8cfc0] bg-white p-3">
            <p className="text-sm font-semibold text-[#172025]">{theme.headline}</p>
            <p className="mt-1 text-sm leading-6 text-[#4d5652]">{theme.message}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{theme.emphasis} / Agent review</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingAgentRationale({ framework }: { framework: SellerPricingFramework }) {
  const selectedScenario = framework.scenarios.find((scenario) => scenario.id === framework.sellerDecision.selectedScenarioId) ?? framework.scenarios[0];
  return (
    <section className="mt-6 border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="pricing-agent-rationale" data-visual-component="OutputPricingAgentRationale">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Agent recommendation rationale</p>
      <h4 className="mt-1 text-xl font-semibold text-[#172025]">{selectedScenario.name}</h4>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]">{selectedScenario.agentRationale}</p>
      <p className="mt-3 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Evidence:</span> {selectedScenario.evidenceReferenceIds.join(', ')}.</p>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]"><span className="font-semibold text-[#172025]">Limitations:</span> Agent authorship is required. No automated valuation, pricing recommendation, sale-probability, or financial advice is generated.</p>
    </section>
  );
}

function ResponseCheckpointTimeline({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6" data-testid="pricing-response-checkpoint-timeline" data-visual-component="OutputResponseCheckpointTimeline">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Response checkpoint timeline</p>
      <ol className="mt-3 grid gap-3">
        {framework.responseCheckpoints.map((checkpoint) => (
          <li key={checkpoint.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-4">
            <p className="text-sm font-semibold text-[#172025]">{checkpoint.name} / {checkpoint.timing}</p>
            <p className="mt-1 text-sm leading-6 text-[#4d5652]">{checkpoint.agentInterpretation}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Triggered decision: {checkpoint.triggeredDecision}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ReassessmentPanel({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6" data-testid="pricing-reassessment-panel" data-visual-component="OutputReassessmentPanel">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Reassessment triggers</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {framework.reassessmentTriggers.map((trigger) => (
          <div key={trigger.id} className="border border-[#d8cfc0] bg-white p-3">
            <p className="text-sm font-semibold text-[#172025]">{trigger.type.replaceAll('_', ' ')}</p>
            <p className="mt-1 text-sm leading-6 text-[#4d5652]">{trigger.whatChanged}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{trigger.reviewAction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SellerPricingDecisionPanel({ framework }: { framework: SellerPricingFramework }) {
  return (
    <section className="mt-6 border border-[#d8cfc0] bg-[#efe5d4] p-4" data-testid="pricing-seller-pricing-decision" data-visual-component="OutputSellerPricingDecision">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Seller pricing decision</p>
      <h4 className="mt-1 text-xl font-semibold text-[#172025]">{framework.sellerDecision.state.replaceAll('_', ' ')}</h4>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]">Selected scenario: {framework.sellerDecision.selectedScenarioId}. Next action: {framework.sellerDecision.nextAction}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Financial-link state: {framework.sellerDecision.financialLinkState.replaceAll('_', ' ')}</p>
    </section>
  );
}

function PricingEvidencePanel({ framework, mode }: { framework: SellerPricingFramework; mode: SellerDecisionBriefPreviewMode }) {
  return (
    <section className="mt-6 border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="pricing-evidence-panel" data-visual-component="OutputPricingEvidencePanel">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Deeper evidence / versions / limitations</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {framework.evidenceReferences.map((evidence) => (
          <div key={evidence.id} className="border border-[#d8cfc0] bg-white p-3">
            <p className="text-sm font-semibold text-[#172025]">{evidence.label}</p>
            <p className="mt-1 text-xs leading-5 text-[#4d5652]">Source: {evidence.source}. Version: {evidence.version}. As of: {evidence.asOf}. Rights: {evidence.rights.replaceAll('_', ' ')}. Freshness: {evidence.freshness.replaceAll('_', ' ')}.</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[#4d5652]">Print preview mode: {mode === 'PRINT_PREVIEW' ? 'active' : 'available'}. PDF generation, share delivery, persistence, provider runtime, automated valuation, automated pricing recommendation, and financial advice remain held.</p>
    </section>
  );
}

function PostLaunchCurrentContextReviewSection({ review, mode }: { review: SellerPostLaunchReview; mode: SellerDecisionBriefPreviewMode }) {
  const selectedScenario = pricingFramework.scenarios.find((scenario) => scenario.id === review.currentPricingScenarioId) ?? pricingFramework.scenarios[0];
  const changeSet = [...review.marketChangeSet, ...review.competitionChangeSet, ...review.subjectChangeSet];
  return (
    <article
      className="border-t border-[#d8cfc0] bg-[#f7f3ec] px-5 py-8 sm:px-8 lg:px-10"
      data-testid="seller-post-launch-current-context-review"
      data-version={review.version}
      data-review-version={review.reviewVersion}
      data-seller-update-version={review.sellerUpdateProduct.version}
      data-persistence="false"
      data-provider-activity="false"
      data-customer-data="false"
      data-pdf-generation="false"
      data-share-delivery="false"
      data-financial-advice="false"
      data-automated-pricing-recommendation="false"
      data-preview-mode={mode}
    >
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#786b58]">Seller post-launch response intelligence</p>
          <h3 className="mt-2 text-3xl font-semibold leading-9 text-[#172025]">Current response review turns launch context into a governed Seller Update.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4d5652]">The Agent compares the launch-reviewed baseline with current market, competition, subject, response, pricing, and financial-continuity context before confirming the recommendation, Seller decision, and next checkpoint.</p>
        </div>
        <dl className="grid gap-3 border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-review-status-bar">
          <PostLaunchFact label="Property" value={review.propertyReference} />
          <PostLaunchFact label="Pricing scenario" value={`${selectedScenario.name} / ${formatCurrency(review.selectedPriceAssumption)}`} />
          <PostLaunchFact label="Review status" value={review.currentCheckpoint.currentState.replaceAll('_', ' ')} />
          <PostLaunchFact label="As of" value={review.currentMarket.asOf} />
          <PostLaunchFact label="Next action" value={review.updatedRecommendation.nextAction} />
        </dl>
      </header>

      <div className="mt-7 grid gap-5 xl:grid-cols-[17rem_minmax(0,1fr)_22rem]">
        <aside className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-review-timeline" data-visual-component="OutputCheckpointTimeline">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Checkpoint timeline</p>
          <ol className="mt-4 grid gap-3">
            {[review.previousCheckpoint, review.currentCheckpoint, review.nextCheckpoint].map((checkpoint) => (
              <li key={checkpoint.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
                <p className="text-sm font-semibold text-[#172025]">{checkpoint.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{checkpoint.type.replaceAll('_', ' ')} / {checkpoint.currentState.replaceAll('_', ' ')}</p>
                <p className="mt-2 text-sm leading-6 text-[#4d5652]">{checkpoint.basis}</p>
              </li>
            ))}
          </ol>
        </aside>

        <section className="grid gap-5" data-testid="seller-update-preview">
          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-change-summary" data-visual-component="OutputChangeSummary">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Change summary</p>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              {(['NEW', 'CHANGED', 'STABLE', 'REQUIRES_REVIEW'] as const).map((changeClass) => (
                <PostLaunchMetric key={changeClass} label={changeClass.replaceAll('_', ' ')} value={`${changeSet.filter((entry) => entry.changeClass === changeClass).length}`} />
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <PostLaunchRefreshPanel refresh={review.currentMarket} testId="post-launch-current-prior-market" visual="OutputCurrentPriorMarket" />
            <PostLaunchRefreshPanel refresh={review.currentCompetition} testId="post-launch-current-prior-competition" visual="OutputCurrentPriorCompetition" />
          </div>

          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-response-summary" data-visual-component="OutputResponseSummary">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Response inputs</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {review.responseInputs.map((input) => (
                <div key={input.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
                  <p className="text-sm font-semibold text-[#172025]">{input.sourceClass.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-sm leading-6 text-[#4d5652]">{input.summary}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{input.verification.replaceAll('_', ' ')} / {input.sellerFacingUse.replaceAll('_', ' ')}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-change-card" data-visual-component="OutputChangeCard">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Change cards</p>
            <div className="mt-3 grid gap-2">
              {changeSet.map((entry) => (
                <div key={entry.id} className="grid gap-2 border border-[#d8cfc0] bg-[#fffdf8] p-3 md:grid-cols-[9rem_minmax(0,1fr)_8rem]">
                  <p className="text-sm font-semibold text-[#172025]">{entry.domain}</p>
                  <p className="text-sm leading-6 text-[#4d5652]">{entry.field}: {entry.previousValue} to {entry.currentValue}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{entry.changeClass.replaceAll('_', ' ')}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-positioning-status" data-visual-component="OutputPositioningStatus">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Positioning status</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.agentInterpretation.positioningEffect}</p>
            </section>
            <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-pricing-status" data-visual-component="OutputPricingStatus">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Pricing status</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.agentInterpretation.pricingEffect}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Financial: {review.sellerDecision.financialEffect.replaceAll('_', ' ')}</p>
            </section>
          </div>

          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-agent-interpretation" data-visual-component="OutputAgentInterpretation">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Agent interpretation</p>
            <h4 className="mt-1 text-xl font-semibold text-[#172025]">{review.agentInterpretation.sellerFacingSummary}</h4>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.agentInterpretation.whyItMatters}</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#4d5652]">
              {review.agentInterpretation.whatChanged.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </section>

          <section className="border border-[#d8cfc0] bg-[#efe5d4] p-4" data-testid="post-launch-updated-recommendation" data-visual-component="OutputRecommendationCard">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Updated recommendation</p>
            <h4 className="mt-1 text-xl font-semibold text-[#172025]">{review.updatedRecommendation.currentRecommendation.replaceAll('_', ' ')}</h4>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.updatedRecommendation.rationale}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Alternatives: {review.updatedRecommendation.alternatives.join(', ').replaceAll('_', ' ')}</p>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-seller-decision" data-visual-component="OutputDecisionChecklist">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Seller decision</p>
              <p className="mt-2 text-lg font-semibold text-[#172025]">{review.sellerDecision.selectedAction.replaceAll('_', ' ')}</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.sellerDecision.reason}</p>
            </section>
            <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-next-checkpoint" data-visual-component="OutputCheckpointTimeline">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Next checkpoint</p>
              <p className="mt-2 text-lg font-semibold text-[#172025]">{review.nextCheckpoint.name}</p>
              <p className="mt-2 text-sm leading-6 text-[#4d5652]">{review.nextCheckpoint.plannedTimeOrEvent}</p>
            </section>
          </div>
        </section>

        <aside className="grid gap-4">
          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-reassessment-triggers">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Reassessment triggers</p>
            <div className="mt-3 grid gap-2">
              {review.reassessmentTriggers.map((trigger) => (
                <div key={trigger.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
                  <p className="text-sm font-semibold text-[#172025]">{trigger.type.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{trigger.priority}</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d5652]">{trigger.reviewAction}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="border border-[#d8cfc0] bg-white p-4" data-testid="post-launch-evidence-panel" data-visual-component="OutputEvidencePanel">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Evidence / versions / limitations</p>
            <div className="mt-3 grid gap-2">
              {review.evidenceReferences.map((evidence) => (
                <div key={evidence.id} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
                  <p className="text-sm font-semibold text-[#172025]">{evidence.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#4d5652]">Class: {evidence.evidenceClass.replaceAll('_', ' ')}. Source: {evidence.source}. Version: {evidence.version}. Rights: {evidence.rights.replaceAll('_', ' ')}.</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </article>
  );
}

function PostLaunchFact({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#d8cfc0] pb-2 last:border-0 last:pb-0"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[#172025]">{value}</dd></div>;
}

function PostLaunchMetric({ label, value }: { label: string; value: string }) {
  return <div className="border border-[#d8cfc0] bg-[#fffdf8] p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#172025]">{value}</p></div>;
}

function PostLaunchRefreshPanel({ refresh, testId, visual }: { refresh: SellerPostLaunchCurrentRefresh; testId: string; visual: string }) {
  return (
    <section className="border border-[#d8cfc0] bg-white p-4" data-testid={testId} data-visual-component={visual}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">{refresh.domain} current / prior</p>
          <h4 className="mt-1 text-xl font-semibold text-[#172025]">{refresh.coverage}</h4>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{refresh.comparability.replaceAll('_', ' ')}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {refresh.facts.map((fact) => (
          <div key={fact.label} className="border border-[#d8cfc0] bg-[#fffdf8] p-3">
            <p className="text-sm font-semibold text-[#172025]">{fact.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#4d5652]">{fact.prior} to {fact.current}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{fact.changeClass.replaceAll('_', ' ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function OutputVersionLineageFoundationSection({ foundation, mode }: { foundation: AtlasOutputVersionFoundation; mode: SellerDecisionBriefPreviewMode }) {
  const currentVersion = foundation.outputVersions.find((version) => version.id === 'seller-update-current-version') ?? foundation.outputVersions[0];
  const priorVersion = foundation.outputVersions.find((version) => version.id === currentVersion.priorReviewedVersion);
  const draftSuccessor = foundation.outputVersions.find((version) => version.id === 'seller-update-draft-successor');
  const visibleWarnings = foundation.dependencyWarnings.slice(0, 7);
  const visibleDiffs = foundation.diffs.slice(0, 7);
  return (
    <article
      className="border-t border-[#d8cfc0] bg-white px-5 py-8 sm:px-8 lg:px-10"
      data-testid="output-version-lineage-invalidation-foundation"
      data-version={foundation.version}
      data-persistence="false"
      data-schema-migration="false"
      data-provider-activity="false"
      data-pdf-generation="false"
      data-share-delivery="false"
      data-preview-mode={mode}
    >
      <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#786b58]">Output version / lineage / invalidation foundation</p>
          <h3 className="mt-2 text-3xl font-semibold leading-9 text-[#172025]">Every Seller output now has a current version, prior version, evidence snapshot, dependency state, and successor seam.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4d5652]">This session-safe foundation represents version identity, reviewed immutability, supersession, evidence snapshots, dependency invalidation, diffs, reuse rules, Seller decision references, financial review warnings, and future render/persistence seams without creating durable storage.</p>
        </div>
        <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-current-badge" data-visual-component="OutputVersionBadge" aria-label="Current output version">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Current version</p>
          <h4 className="mt-2 text-xl font-semibold text-[#172025]">{currentVersion.displayVersion}</h4>
          <p className="mt-2 text-sm leading-6 text-[#4d5652]">{currentVersion.lifecycleState.replaceAll('_', ' ')} / {currentVersion.reviewState.replaceAll('_', ' ')}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">As of {currentVersion.effectiveAsOf} / {currentVersion.contentFingerprint}</p>
        </section>
      </header>

      <div className="mt-5 grid gap-3 border border-[#d8cfc0] bg-[#fffdf8] p-4 text-xs font-semibold uppercase text-[#71624e] md:grid-cols-3" aria-label="Output version governance tokens">
        <p className="break-words">Version: {foundation.version}</p>
        <p className="break-words">Next gate: {foundation.nextGate}</p>
        <p className="break-words">Persistence: {foundation.persistencePosition}</p>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)_22rem]">
        <aside className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-history-panel" data-visual-component="OutputVersionHistory">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Version history</p>
          <ol className="mt-4 grid gap-3">
            {foundation.outputVersions.filter((version) => ['seller-decision-brief-v2-reviewed', 'seller-pricing-version-reviewed', 'seller-post-launch-review-current', 'seller-update-current-version', 'seller-update-superseded-version', 'seller-update-invalidated-version', 'seller-update-draft-successor'].includes(version.id)).map((version) => (
              <li key={version.id} className="border border-[#d8cfc0] bg-white p-3">
                <p className="text-sm font-semibold text-[#172025]">{version.displayVersion}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{version.lifecycleState.replaceAll('_', ' ')}</p>
                <p className="mt-2 text-sm leading-6 text-[#4d5652]">Prior: {version.priorReviewedVersion ?? 'none'}. Supersedes: {version.supersedesVersion ?? 'none'}.</p>
              </li>
            ))}
          </ol>
        </aside>

        <section className="grid gap-5">
          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-compare-to-prior" data-visual-component="OutputVersionCompareToPrior">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Compare to prior</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <VersionCompareCard label="Prior reviewed" value={priorVersion?.displayVersion ?? 'No prior version'} detail={currentVersion.priorReviewedVersion ?? 'none'} />
              <VersionCompareCard label="Current" value={currentVersion.displayVersion} detail={currentVersion.id} />
              <VersionCompareCard label="Draft successor" value={draftSuccessor?.displayVersion ?? 'No draft successor'} detail={draftSuccessor?.id ?? 'none'} />
              <VersionCompareCard label="Seller decision" value={currentVersion.sellerClientDecisionReferences[0]?.label ?? 'Decision review required'} detail={currentVersion.sellerClientDecisionReferences[0]?.version ?? 'none'} />
            </div>
          </section>

          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-diff-summary" data-visual-component="OutputVersionDiffSummary">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">What changed</p>
            <div className="mt-3 grid gap-2">
              {visibleDiffs.map((diff) => (
                <div key={diff.id} className="grid gap-2 border border-[#d8cfc0] bg-white p-3 md:grid-cols-[11rem_minmax(0,1fr)_9rem]">
                  <p className="text-sm font-semibold text-[#172025]">{diff.diffClass.replaceAll('_', ' ')}</p>
                  <p className="text-sm leading-6 text-[#4d5652]">{diff.sellerFacingChangeSummary}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{diff.severity.replaceAll('_', ' ')}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-successor-actions" data-visual-component="OutputVersionSuccessorActions">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Successor / derive seams</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {foundation.agentVersionUi.filter((item) => item.uiElement.includes('CREATE') || item.uiElement.includes('REFRESH') || item.uiElement.includes('REUSE')).map((item) => (
                <div key={item.uiElement} className="border border-[#d8cfc0] bg-white p-3">
                  <p className="text-sm font-semibold text-[#172025]">{item.uiElement.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-sm leading-6 text-[#4d5652]">{item.action}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{item.readiness}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-reuse-rules" data-visual-component="OutputVersionReuseRules">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Reuse rules</p>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border border-[#d8cfc0] text-sm">
                <thead className="bg-[#efe5d4]"><tr>{['Artifact', 'Same product', 'Seller Update', 'Buyer', 'Financial', 'Advisory'].map((heading) => <th key={heading} className="border border-[#d8cfc0] px-3 py-2 text-left">{heading}</th>)}</tr></thead>
                <tbody>
                  {foundation.reuseRules.slice(0, 6).map((rule) => (
                    <tr key={rule.artifact}>
                      <td className="border border-[#d8cfc0] px-3 py-2 font-semibold">{rule.artifact}</td>
                      <td className="border border-[#d8cfc0] px-3 py-2">{rule.sameProductNewVersion}</td>
                      <td className="border border-[#d8cfc0] px-3 py-2">{rule.sellerUpdate}</td>
                      <td className="border border-[#d8cfc0] px-3 py-2">{rule.buyer}</td>
                      <td className="border border-[#d8cfc0] px-3 py-2">{rule.financial}</td>
                      <td className="border border-[#d8cfc0] px-3 py-2">{rule.advisory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <aside className="grid gap-4">
          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-dependency-warnings" data-visual-component="OutputDependencyWarnings">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Dependency warnings</p>
            <div className="mt-3 grid gap-2">
              {visibleWarnings.map((warning) => (
                <div key={warning.warning} className="border border-[#d8cfc0] bg-white p-3">
                  <p className="text-sm font-semibold text-[#172025]">{warning.warning.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{warning.state.replaceAll('_', ' ')}</p>
                  <p className="mt-2 text-sm leading-6 text-[#4d5652]">{warning.requiredAction}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-render-seam" data-visual-component="OutputRenderVersionSeam">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Print / render seam</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">Source output: seller-update-current-version. Content fingerprint: {currentVersion.contentFingerprint}. Render readiness: foundation only. PDF generation and share delivery remain held.</p>
          </section>
          <section className="border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="output-version-persistence-seam" data-visual-component="OutputPersistenceSeam">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">Persistence position</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5652]">{foundation.persistencePosition.replaceAll('_', ' ')}. Durable persistence becomes material before cross-session reviewed output or Seller decision retention.</p>
          </section>
        </aside>
      </div>
    </article>
  );
}

function VersionCompareCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="border border-[#d8cfc0] bg-white p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</p><p className="mt-1 text-sm font-semibold text-[#172025]">{value}</p><p className="mt-2 break-words text-xs leading-5 text-[#4d5652]">{detail}</p></div>;
}

function SectionNarrative({ section }: { section: SellerDecisionBriefSectionPresentation }) {
  const narrative = narrativeForSection(sellerV2, section.sectionId);
  const transition = sellerV2.sectionTransitions.find((item) => item.fromSectionId === section.sectionId);
  if (!narrative && !transition) return null;
  return (
    <div className="mt-5 grid gap-3 border border-[#d8cfc0] bg-[#fffdf8] p-4" data-testid="seller-brief-v2-section-narrative" data-narrative-kind={narrative?.kind ?? 'SECTION_TRANSITION'}>
      {narrative ? (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#71624e]">{narrative.kind.replaceAll('_', ' ')} / {narrative.readiness.replaceAll('_', ' ')}</p>
          <h4 className="text-xl font-semibold leading-7 text-[#172025]">{narrative.headline}</h4>
          <p className="text-sm leading-6 text-[#4d5652]">{narrative.summary}</p>
          <ul className="grid gap-2 text-sm leading-6 text-[#4d5652]">
            {narrative.points.map((point) => <li key={point}>- {point}</li>)}
          </ul>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Agent authorship: {narrative.agentAuthorship.required ? 'Required and visible' : 'Not required'} / As of {narrative.asOf}</p>
        </>
      ) : null}
      {transition ? <p className="border-t border-[#d8cfc0] pt-3 text-sm leading-6 text-[#4d5652]" data-testid="seller-brief-v2-section-transition"><span className="font-semibold text-[#172025]">Next:</span> {transition.bridgeMessage}</p> : null}
    </div>
  );
}

function ModuleCard({ module, narrative, selected, sellerMode, onSelect }: { module: SellerDecisionBriefModulePresentation; narrative?: SellerDecisionBriefNarrativeUnit; selected: boolean; sellerMode: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 ${selected ? 'border-[#172025] bg-[#fffdf8]' : 'border-[#d8cfc0] bg-white/70 hover:border-[#9b8b76]'}`}
      data-testid="seller-brief-output-module"
      data-visual-component={module.visualComponent}
      data-readiness={module.readinessState}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#756957]">{module.visualComponent} / {module.density}</p>
          <h4 className="mt-1 text-lg font-semibold leading-7 text-[#172025]">{module.module.title}</h4>
        </div>
        <ReadinessBadge state={module.readinessState} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#4d5652]">{sellerMode ? sellerFacingLine(module, narrative) : narrative?.summary ?? module.registry.purpose}</p>
      {narrative ? <NarrativeSummary narrative={narrative} /> : null}
      <ModuleVisualTreatment module={module} />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">Evidence / as-of</p>
      <p className="mt-1 text-sm leading-6 text-[#4d5652]">{module.evidence.map((evidence) => `${evidence.label}${evidence.asOf ? ` (${evidence.asOf})` : ''}`).join('; ')}</p>
    </button>
  );
}

function NarrativeSummary({ narrative }: { narrative: SellerDecisionBriefNarrativeUnit }) {
  return (
    <div className="mt-4 border border-[#d8cfc0] bg-[#fffdf8] p-3" data-testid="seller-brief-v2-module-narrative" data-narrative-kind={narrative.kind}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#71624e]">{narrative.kind.replaceAll('_', ' ')} / {narrative.classification.replaceAll('_', ' ')}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#172025]">{narrative.headline}</p>
      <p className="mt-2 text-sm leading-6 text-[#4d5652]">Agent authorship: {narrative.agentAuthorship.required ? 'Required' : 'Not required'}. Review: {narrative.agentAuthorship.reviewState.replaceAll('_', ' ')}.</p>
    </div>
  );
}

function sellerFacingLine(module: SellerDecisionBriefModulePresentation, narrative?: SellerDecisionBriefNarrativeUnit) {
  if (narrative) return `${narrative.headline} ${narrative.summary}`;
  return module.sellerQuestion ? `${module.sellerQuestion} This section is prepared for Agent review before seller use.` : 'Evidence and limitations are visible for Agent review before seller use.';
}

function ModuleVisualTreatment({ module }: { module: SellerDecisionBriefModulePresentation }) {
  if (module.visualComponent === 'OutputPropertyHero' || module.visualComponent === 'OutputPropertyFactGrid') {
    return <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" data-testid="seller-brief-property-fact-grid">{fixturePropertyFacts.map(([label, value]) => <div key={label} className="border border-[#d8cfc0] bg-[#f7f3ec] p-3"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[#172025]">{value}</dd></div>)}</dl>;
  }
  if (module.visualComponent === 'OutputLocationMap' || module.visualComponent === 'OutputCompetitionMap') {
    return <div className="mt-4 grid min-h-40 place-items-center border border-[#d8cfc0] bg-[#e5ecdf] p-4 text-center" data-testid="seller-brief-map-fallback"><MapPinned className="h-8 w-8 text-[#465249]" aria-hidden="true" /><p className="mt-2 text-sm font-semibold text-[#172025]">Static map/context fallback with accessible list alternative</p></div>;
  }
  if (module.visualComponent === 'OutputCohortSummary' || module.visualComponent === 'OutputMetricCard') {
    return <dl className="mt-4 grid gap-2 sm:grid-cols-4" data-testid="seller-brief-market-metric-cards">{marketMetrics.map(([label, value]) => <div key={label} className="border border-[#d8cfc0] bg-[#f7f3ec] p-3"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#71624e]">{label}</dt><dd className="mt-1 text-sm font-semibold text-[#172025]">{value}</dd></div>)}</dl>;
  }
  if (module.visualComponent.includes('Matrix') || module.visualComponent === 'OutputDecisionChecklist') {
    return <div className="mt-4 overflow-x-auto" data-testid="seller-brief-comparison-matrix"><table className="min-w-full border border-[#d8cfc0] text-sm"><thead className="bg-[#efe5d4]"><tr><th className="border border-[#d8cfc0] px-3 py-2 text-left">Item</th><th className="border border-[#d8cfc0] px-3 py-2 text-left">Status</th><th className="border border-[#d8cfc0] px-3 py-2 text-left">Agent action</th></tr></thead><tbody><tr><td className="border border-[#d8cfc0] px-3 py-2">Canonical module input</td><td className="border border-[#d8cfc0] px-3 py-2">{readinessLabels[module.readinessState]}</td><td className="border border-[#d8cfc0] px-3 py-2">{module.nextAction}</td></tr></tbody></table></div>;
  }
  return <div className="mt-4 grid gap-2 sm:grid-cols-3" data-testid="seller-brief-generic-output-treatment">{['Content', 'Evidence', 'Review'].map((label) => <div key={label} className="border border-[#d8cfc0] bg-[#f7f3ec] p-3 text-sm font-semibold text-[#172025]">{label}</div>)}</div>;
}

function ModuleInspector({ module, narrative, pricingFramework, postLaunchReview, outputVersionFoundation, mode }: { module: SellerDecisionBriefModulePresentation; narrative?: SellerDecisionBriefNarrativeUnit; pricingFramework: SellerPricingFramework; postLaunchReview: SellerPostLaunchReview; outputVersionFoundation: AtlasOutputVersionFoundation; mode: SellerDecisionBriefPreviewMode }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-cyan-100" aria-hidden="true" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">Module inspector</h2>
      </div>
      <h3 className={`mt-4 ${projectAtlasTitleHierarchy.briefingSubsection}`}>{module.module.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{module.registry.purpose}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <ReadinessBadge state={module.readinessState} />
        <span className="rounded-[7px] bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{modeLabels[mode]}</span>
        <span className="rounded-[7px] bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{module.registry.classification.replaceAll('_', ' ')}</span>
      </div>
      <InspectorSection icon={<ListChecks size={16} aria-hidden="true" />} title="Content">
        <InspectorRow label="Component" value={module.visualComponent} />
        <InspectorRow label="Input" value={module.registry.inputType.replaceAll('_', ' ')} />
        <InspectorRow label="Density" value={module.density} />
        <InspectorRow label="Inclusion" value={module.module.inclusionState.replaceAll('_', ' ')} />
      </InspectorSection>
      {narrative ? <InspectorSection icon={<FileText size={16} aria-hidden="true" />} title="V2 narrative / strategy">
        <InspectorRow label="Narrative" value={narrative.kind.replaceAll('_', ' ')} />
        <InspectorRow label="Readiness" value={narrative.readiness.replaceAll('_', ' ')} />
        <InspectorRow label="Agent authorship" value={narrative.agentAuthorship.required ? 'Required' : 'Not required'} />
        <p className="text-sm leading-6 text-slate-300">{narrative.summary}</p>
        <ul className="grid gap-2 text-sm leading-6 text-slate-300">
          {narrative.points.map((point) => <li key={point}>- {point}</li>)}
        </ul>
      </InspectorSection> : null}
      {module.module.id === 'seller-module-recommendation-card' ? <InspectorSection icon={<AlertTriangle size={16} aria-hidden="true" />} title="Recommendation evidence / alternatives">
        <p className="text-sm leading-6 text-slate-300">Evidence map: property, location, market, competition, Agent input, and professional handoff support are explicitly separated.</p>
        <div className="grid gap-2">
          {sellerV2.alternatives.map((alternative) => <div key={alternative.id} className="border border-white/10 bg-black/15 p-3"><p className="text-sm font-semibold text-white">{alternative.name}</p><p className="mt-1 text-xs leading-5 text-slate-400">{alternative.objective} Tradeoffs: {alternative.tradeoffs.join('; ')}.</p></div>)}
        </div>
      </InspectorSection> : null}
      <InspectorSection icon={<AlertTriangle size={16} aria-hidden="true" />} title="Pricing framework">
        <InspectorRow label="Version" value={pricingFramework.version} />
        <InspectorRow label="Options" value={`${pricingFramework.scenarios.length}`} />
        <InspectorRow label="Selected scenario" value={pricingFramework.sellerDecision.selectedScenarioId} />
        <InspectorRow label="Financial link" value={pricingFramework.sellerDecision.financialLinkState.replaceAll('_', ' ')} />
        <p className="text-sm leading-6 text-slate-300">Agent review exposes subject facts, cohort definition, current competition, search-band definitions, boundary semantics, price assumptions, alternatives, subject position, positioning effects, tradeoffs, evidence gaps, Agent rationale, checkpoints, reassessment triggers, financial links, and Seller decision state.</p>
      </InspectorSection>
      <InspectorSection icon={<ListChecks size={16} aria-hidden="true" />} title="Post-launch review">
        <InspectorRow label="Version" value={postLaunchReview.version} />
        <InspectorRow label="Current checkpoint" value={postLaunchReview.currentCheckpoint.currentState.replaceAll('_', ' ')} />
        <InspectorRow label="Seller decision" value={postLaunchReview.sellerDecision.selectedAction.replaceAll('_', ' ')} />
        <InspectorRow label="Financial review" value={postLaunchReview.sellerDecision.financialEffect.replaceAll('_', ' ')} />
        <p className="text-sm leading-6 text-slate-300">Seller Update preview is available for Agent review with current-vs-prior evidence, response inputs, change sets, reassessment triggers, Agent interpretation, updated recommendation, Seller decision, next checkpoint, and evidence lineage.</p>
      </InspectorSection>
      <InspectorSection icon={<ListChecks size={16} aria-hidden="true" />} title="Output version">
        <InspectorRow label="Foundation" value={outputVersionFoundation.version} />
        <InspectorRow label="Current output" value={outputVersionFoundation.outputVersions.find((version) => version.id === 'seller-update-current-version')?.displayVersion ?? 'Review required'} />
        <InspectorRow label="Dependencies" value={`${outputVersionFoundation.dependencies.length}`} />
        <InspectorRow label="Warnings" value={`${outputVersionFoundation.dependencyWarnings.length}`} />
        <p className="text-sm leading-6 text-slate-300">Version history, current/prior diff, dependency warnings, Seller decision linkage, content fingerprint, reuse rules, successor seams, and future render/persistence seams are represented session-safely.</p>
      </InspectorSection>
      <InspectorSection icon={<ShieldCheck size={16} aria-hidden="true" />} title="Evidence / freshness / rights">
        {module.evidence.map((evidence) => (
          <div key={evidence.id} className="border border-white/10 bg-black/15 p-3">
            <p className="text-sm font-semibold text-white">{evidence.label}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Evidence: {evidence.evidenceState.replaceAll('_', ' ')}. Rights: {evidence.rightsState.replaceAll('_', ' ')}. Freshness: {evidence.freshnessState.replaceAll('_', ' ')}. As of: {evidence.asOf ?? 'Review required'}.</p>
          </div>
        ))}
      </InspectorSection>
      <InspectorSection icon={<AlertTriangle size={16} aria-hidden="true" />} title="Limitations / review">
        {module.module.limitations.map((limitation) => <p key={limitation} className="text-sm leading-6 text-slate-300">{limitation}</p>)}
        <p className="mt-3 text-sm font-semibold text-white">Next action: {module.nextAction}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">Agent authorship: {module.agentAuthorship ? 'Required or visible' : 'Not required for this module'}. Display: {module.includedByDefault ? 'Included for review' : 'Held until review clears'}.</p>
      </InspectorSection>
      <InspectorSection icon={<FileText size={16} aria-hidden="true" />} title="Print / output">
        <p className="text-sm leading-6 text-slate-300">Print-safe foundation is available through the same composition. PDF generation, share links, version persistence, and delivery remain held.</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">Output version seam: {preview.version}. Page-number seam: reserved.</p>
      </InspectorSection>
      <InspectorSection icon={<Printer size={16} aria-hidden="true" />} title="Protected boundaries">
        <p className="text-sm leading-6 text-slate-300">No persistence, provider runtime, customer mutation, CRM mutation, email/message execution, PDF generation, share delivery, or recommendation automation is authorized by this preview.</p>
      </InspectorSection>
    </div>
  );
}

function InspectorSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="mt-5 border-t border-white/10 pt-4"><div className="flex items-center gap-2 text-cyan-100">{icon}<h4 className="text-xs font-bold uppercase tracking-[0.14em]">{title}</h4></div><div className="mt-3 grid gap-3">{children}</div></section>;
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-start justify-between gap-3 border border-white/10 bg-black/15 p-3 text-sm"><span className="text-slate-400">{label}</span><span className="text-right font-semibold text-white">{value}</span></div>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
