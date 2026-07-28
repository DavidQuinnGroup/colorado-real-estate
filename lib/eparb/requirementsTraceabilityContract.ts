export const REIE_ADJUSTMENTS_TRACEABILITY_CONTRACT_VERSION = 'REIE-7.1-ADJUSTMENTS-TRACEABILITY-1.0';

export type ReieAdjustmentRequirementStatus =
  | 'IMPLEMENTED_CERTIFIED'
  | 'IMPLEMENTED_NOT_CERTIFIED'
  | 'PARTIALLY_IMPLEMENTED'
  | 'PLANNED'
  | 'DEFERRED'
  | 'SUPERSEDED'
  | 'REQUIRES_EXECUTIVE_DECISION'
  | 'NOT_FOUND_IN_REPOSITORY';

export type ReieAdjustmentRequirementCategory =
  | 'VISUAL_DESIGN'
  | 'SITE_ARCHITECTURE'
  | 'NAVIGATION'
  | 'SEARCH_MAP'
  | 'SEO_AEO'
  | 'BUYER_FINANCING'
  | 'SELLER_EXPERIENCE'
  | 'PUBLIC_TRUST'
  | 'EDITORIAL_CONTENT'
  | 'MOBILE_EXPERIENCE'
  | 'GEOGRAPHIC_GOVERNANCE'
  | 'ENTERPRISE_KNOWLEDGE_GOVERNANCE';

export type ReieAdjustmentRequirement = {
  identifier: `REIE-ADJ-${string}`;
  originalRequirement: string;
  normalizedRequirement: string;
  category: ReieAdjustmentRequirementCategory;
  customerValue: string;
  owningProgram: string;
  owningPlatformCapability: string;
  repositoryEvidence: string[];
  implementationStatus: ReieAdjustmentRequirementStatus;
  validationStatus: string;
  productionStatus: string;
  dependencies: string[];
  conflicts: string[];
  recommendedDisposition: string;
  proposedImplementationProgramOrSprint: string;
  executiveAuthorizationRequired: boolean;
  notes: string;
  supersededRationale?: string;
  certificationEvidence?: string[];
};

export type ReieAdjustmentTraceabilityPolicy = {
  strategicCompletionRequiresReconciliation: true;
  futureImplementationMustDeclareRelationship: true;
  supersededRequiresRationaleAndExecutiveApproval: true;
  implementationAuthorizationRequiredForOpenRequirements: true;
  runtimeActivationAuthorized: false;
};

export type ReieAdjustmentTraceabilityRegister = {
  version: typeof REIE_ADJUSTMENTS_TRACEABILITY_CONTRACT_VERSION;
  sourceDocument: {
    title: 'PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS';
    googleDocumentId: '1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs';
    modifiedTime: '2026-07-26T12:29:10.522Z';
    sourceReconciliationStatus: 'SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY';
  };
  policy: ReieAdjustmentTraceabilityPolicy;
  requirements: ReieAdjustmentRequirement[];
};

export type ReieAdjustmentTraceabilityValidationResult = {
  valid: boolean;
  issues: string[];
};

export const reieAdjustmentStatusValues: ReieAdjustmentRequirementStatus[] = [
  'IMPLEMENTED_CERTIFIED',
  'IMPLEMENTED_NOT_CERTIFIED',
  'PARTIALLY_IMPLEMENTED',
  'PLANNED',
  'DEFERRED',
  'SUPERSEDED',
  'REQUIRES_EXECUTIVE_DECISION',
  'NOT_FOUND_IN_REPOSITORY',
];

export const reieAdjustmentRequirements: ReieAdjustmentRequirement[] = [
  req('001', 'Remove all lines around text on all pages unless there is a specific reason to highlight that block of text.', 'Reduce decorative border usage across public pages except where a border conveys deliberate emphasis or structure.', 'VISUAL_DESIGN', 'Improves luxury feel and lowers visual noise.', 'CEP 1.0 or future Customer Experience polish sprint', 'Public design system', ['Home/search/market/sell pages use many bordered cards and sections.'], 'PARTIALLY_IMPLEMENTED', 'Requires page-level visual QA.', 'Not separately certified against this source requirement.', ['Design review', 'accessibility contrast review'], [], 'Retain as open design-system refinement.', 'Future CEP visual polish sprint', true, 'Several certified sprints improved hierarchy, but this exact requirement has not been reconciled globally.'),
  req('002', 'Create separate pages for each aspect of the site.', 'Major capabilities should have distinct routes rather than being collapsed into one page.', 'SITE_ARCHITECTURE', 'Improves discoverability and customer orientation.', 'CEP 1.0', 'Public route architecture', ['Routes exist for /, /search, /market, /sell, /grand-plan, /contact, /about, /brokerage-disclosures.'], 'PARTIALLY_IMPLEMENTED', 'Route inventory complete; missing requested mortgage, lender, and Sundance pages.', 'Certified only for CEP implemented routes.', ['Executive content authorization'], [], 'Continue route-by-route through authorized program work.', 'Future CEP or successor customer-content program', true, 'Existing route separation is substantial but not complete against the source document.'),
  req('003', 'The Home page should be Home Base and clearly guide the different options/pathways.', 'Home should orient customers to search, communities/market, seller, planning, about, and contact pathways.', 'SITE_ARCHITECTURE', 'Clarifies customer journey entry.', 'CEP 1.0', 'Home page pathway selector', ['app/page.tsx navigationLinks and advisoryPaths', 'CEP Sprint 5 navigation continuity certification.'], 'IMPLEMENTED_CERTIFIED', 'CEP Sprint 5 local and production certification covered navigation continuity.', 'Production certified under CEP Sprint 5.', ['None'], [], 'Retain as implemented and monitor future route additions.', 'Maintenance only unless new pathways authorized', false, 'Home now functions as a pathway selector.'),
  req('004', 'Home should not include the other pages.', 'Home should guide to other capabilities without duplicating every full page experience.', 'SITE_ARCHITECTURE', 'Prevents clutter and keeps Home focused.', 'CEP 1.0', 'Home content hierarchy', ['app/page.tsx links to search, sell, market, grand plan, about, contact without embedding full pages.'], 'IMPLEMENTED_CERTIFIED', 'Covered by CEP public journey certifications.', 'Production certified as part of CEP foundation.', ['Future content discipline'], [], 'Retain as governance rule for Home changes.', 'Maintenance governance', false, 'Future Home expansions should preserve pathway-not-replication discipline.'),
  req('005', 'Clean up the pages so the site feels like a luxury experience.', 'Public pages should use restrained, premium, low-clutter design language.', 'VISUAL_DESIGN', 'Strengthens brand trust and perceived quality.', 'CEP 1.0', 'Public visual design', ['CEP Sprints 1-5 improved search, property, conversion, market, and navigation presentation.'], 'PARTIALLY_IMPLEMENTED', 'Requires full design QA against original aesthetic intent.', 'Partially production certified through CEP sprints but not certified against this exact source requirement.', ['Design approval'], [], 'Keep open for future visual-system review.', 'Future CEP visual polish or brand system review', true, 'Luxury feel is directionally improved but not globally reconciled.'),
  req('006', 'Each page needs relaxing negative space.', 'Spacing and layout should avoid crowded page density.', 'VISUAL_DESIGN', 'Improves readability and premium feel.', 'CEP 1.0', 'Responsive layout system', ['Public pages use section padding and max-width shells; mobile concern remains separately listed.'], 'PARTIALLY_IMPLEMENTED', 'Needs responsive visual QA.', 'Not separately certified against source requirement.', ['Mobile and desktop QA'], [], 'Retain as open design QA requirement.', 'Future CEP visual polish sprint', true, 'Certified sprints improved sections but did not globally audit all pages for negative space.'),
  req('007', 'Make it not busy and cluttered.', 'Reduce unnecessary density, repeated calls-to-action, and decorative complexity.', 'VISUAL_DESIGN', 'Improves comprehension and conversion.', 'CEP 1.0', 'Public interaction hierarchy', ['CEP Sprints 1-5 improved hierarchy and CTA continuity.'], 'PARTIALLY_IMPLEMENTED', 'Needs full-page clutter review.', 'Not separately certified as global declutter requirement.', ['Design review'], [], 'Retain as open visual governance requirement.', 'Future CEP visual polish sprint', true, 'This should be reconciled per route before claiming full customer-experience polish completion.'),
  req('008', 'The property search Map needs luxury colors with Electric Caribbean Blue.', 'Map visual system should reflect the Electric Caribbean Blue aesthetic where technically supported.', 'SEARCH_MAP', 'Improves brand consistency and perceived quality.', 'CEP 1.0 / EPARB dashboard-map framework if shared', 'Map presentation', ['components/maps/SearchMap.tsx uses OpenTopoMap tiles, optional Mapbox satellite overlay, and cyan UI accents.'], 'PARTIALLY_IMPLEMENTED', 'Current implementation does not prove water or basemap color matches Electric Caribbean Blue.', 'Search/map baseline certified, but not this exact map-color requirement.', ['Map provider/style authorization', 'visual QA'], ['Current tile providers may not permit exact water-color control.'], 'Retain as open map styling requirement.', 'Future authorized Search/Map visual styling sprint', true, 'No provider or map engine change is authorized by this review.'),
  req('009', 'User should have 3 totally different color options to choose from for the Map.', 'Map should support three distinct user-selectable visual themes.', 'SEARCH_MAP', 'Supports customer preference and premium interaction.', 'CEP 1.0', 'Map theme control', ['No repository evidence of a three-option map theme selector was found.'], 'NOT_FOUND_IN_REPOSITORY', 'No implementation validation found.', 'Not certified.', ['Map style architecture', 'accessibility contrast', 'provider terms'], [], 'Plan only after map-style architecture authorization.', 'Future authorized Search/Map map-theme sprint', true, 'Open requirement.'),
  req('010', 'The Map should have a clean way to get back to the Home page or any other page.', 'Map/search experience should include clear navigation out to Home and other public pathways.', 'NAVIGATION', 'Prevents user dead ends.', 'CEP 1.0', 'Search navigation continuity', ['CEP Sprint 5 added navigation continuity; app/search/page.tsx and components/search/SearchInterface.tsx contain journey links.'], 'IMPLEMENTED_CERTIFIED', 'CEP Sprint 5 production certification reviewed journey continuity.', 'Production certified under CEP Sprint 5.', ['Future route additions'], [], 'Retain as implemented; keep synchronized with route additions.', 'Maintenance governance', false, 'Current search/map experience has clearer transitions than original state.'),
  req('011', 'All menu bars on every page should be the same.', 'Public navigation should be consistent across pages.', 'NAVIGATION', 'Improves orientation and trust.', 'CEP 1.0 / EPARB shared platform', 'Navigation framework', ['Home has header navigation; footer is global; several pages use local top links rather than a single shared header.'], 'PARTIALLY_IMPLEMENTED', 'Requires route-by-route navigation audit.', 'Navigation continuity certified, but uniform menu bars not globally certified.', ['Shared navigation decision'], ['Some route-specific experiences intentionally use local headers.'], 'Route through EPARB if treated as shared platform navigation.', 'Future EPARB or CEP navigation-standard review', true, 'Open because exact same menu bar across every page is not established.'),
  req('012', 'Company name should be in the top left.', 'Public page navigation should place company identity in the upper-left area.', 'NAVIGATION', 'Strengthens brand recognition and Home orientation.', 'CEP 1.0', 'Header/brand placement', ['app/page.tsx and app/sell/page.tsx include David Quinn Group top-left links; global footer includes company identity.'], 'PARTIALLY_IMPLEMENTED', 'Needs all-page audit.', 'Not globally certified.', ['Shared header/navigation standard'], [], 'Keep open until all major pages are audited.', 'Future navigation-standard review', true, 'Implemented on some major pages, not proven universal.'),
  req('013', 'That logo should always lead back to the home page.', 'Company identity/logo should link to /.', 'NAVIGATION', 'Gives users a predictable escape route.', 'CEP 1.0', 'Header/brand link behavior', ['app/page.tsx brand Link href="/"; app/sell/page.tsx David Quinn Group Link href="/".'], 'PARTIALLY_IMPLEMENTED', 'Needs all-page audit.', 'Not globally certified.', ['Shared header/navigation standard'], [], 'Keep open until universal header behavior is governed.', 'Future navigation-standard review', true, 'Partially implemented on inspected major pages.'),
  req('014', 'In addition to SEO, factor in AEO - Answer Engine Optimization.', 'Public content and schema should support answer-engine discoverability where accurate and source-safe.', 'SEO_AEO', 'Improves organic and answer-engine visibility.', 'CEP 1.0 / future content intelligence', 'SEO/AEO structured data', ['components/schema/*', 'lib/schema/*', 'app/sitemap.ts', 'CEP roadmap and remaining-investment review reference AEO.'], 'PARTIALLY_IMPLEMENTED', 'Structured data exists; AEO strategy not fully implemented or measured.', 'SEO/AEO not separately certified as complete.', ['CIM activation for measurement if later authorized', 'content/source review'], [], 'Retain as future SEO/AEO program requirement.', 'Future AEO/content authority sprint', true, 'AEO is recognized but not complete.'),
  req('015', 'Where is the Mortgage Calculator?', 'Provide a customer-facing mortgage calculator if separately authorized.', 'BUYER_FINANCING', 'Helps buyers understand affordability and payment scenarios.', 'Future financing/customer tools program', 'Buyer financing tools', ['No /mortgage route found; PIE financial intelligence record includes mortgage calculator boundary.'], 'NOT_FOUND_IN_REPOSITORY', 'No implementation validation found.', 'Not certified.', ['Compliance review', 'calculator assumptions', 'lender/disclosure governance'], [], 'Defer until financing tool authorization.', 'Future Buyer Financing Experience program', true, 'Explicitly excluded from CEP sprints.'),
  req('016', 'Where is the recommended Lender page?', 'Provide a recommended lender page if separately authorized and compliant.', 'BUYER_FINANCING', 'Supports buyer financing pathway.', 'Future financing/customer tools program', 'Recommended lender content', ['No lender route found.'], 'NOT_FOUND_IN_REPOSITORY', 'No implementation validation found.', 'Not certified.', ['Compliance review', 'affiliated business disclosure', 'partner approval'], [], 'Defer until lender-governance authorization.', 'Future Buyer Financing Experience program', true, 'Open requirement with legal/compliance dependencies.'),
  req('017', 'Where is the What is My Home Worth page?', 'Provide a dedicated seller valuation or home-worth page.', 'SELLER_EXPERIENCE', 'Supports seller acquisition.', 'CEP 1.0 / CAO', 'Seller valuation journey', ['app/sell/page.tsx includes HomeValueEstimator and app/api/valuation/route.ts exists; no dedicated /home-worth route found.'], 'PARTIALLY_IMPLEMENTED', 'Seller valuation flow exists but dedicated page/URL not found.', 'Seller journey certified under CEP/CAO, not dedicated page requirement.', ['Valuation compliance', 'route/content authorization'], [], 'Create dedicated page only if separately authorized.', 'Future seller acquisition or valuation page sprint', true, 'Functional seller intake exists at /sell, but the requested page is not distinct.'),
  req('018', 'The Brokerage Firm disclosure needs to be removed from the top of every page.', 'Remove or relocate top-of-page brokerage attribution if legally safe.', 'PUBLIC_TRUST', 'Reduces visual clutter while preserving required disclosure.', 'Public Trust / CEP', 'Brokerage attribution', ['app/layout.tsx renders BrokerageAttribution globally before main content.'], 'NOT_FOUND_IN_REPOSITORY', 'Current code still renders global top attribution.', 'Not certified.', ['Brokerage/counsel approval', 'public trust requirements'], ['Public trust records require approved disclosure handling.'], 'Requires executive and brokerage/legal decision before removal.', 'Future Public Trust disclosure review', true, 'Open requirement; removal is not authorized here.'),
  req('019', 'Simplify the Brokerage Firm disclosure because it is too long.', 'Simplify disclosure text while preserving required legal and brokerage content.', 'PUBLIC_TRUST', 'Improves readability and reduces friction.', 'Public Trust / CEP', 'Brokerage attribution and disclosure page', ['components/BrokerageAttribution.tsx renders short firm line plus summary; app/brokerage-disclosures/page.tsx contains detailed disclosures.'], 'PARTIALLY_IMPLEMENTED', 'Some disclosure content is separated, but top attribution remains and exact simplification not certified.', 'Not separately certified against this source requirement.', ['Brokerage/counsel approval'], [], 'Retain for legal/public-trust review.', 'Future Public Trust disclosure review', true, 'Requires counsel/brokerage approval before final status.'),
  req('020', 'Where is the Sundance Film Festival page?', 'Provide a Sundance Film Festival page if separately authorized.', 'EDITORIAL_CONTENT', 'Supports differentiated lifestyle and local-interest content.', 'Future editorial/content program', 'Local editorial content', ['No Sundance route found.'], 'NOT_FOUND_IN_REPOSITORY', 'No implementation validation found.', 'Not certified.', ['Content authorization', 'rights/trademark review', 'editorial calendar'], [], 'Defer to authorized editorial program.', 'Future Local Editorial Experience program', true, 'Open requirement.'),
  req('021', 'The Sundance Film Festival page should have its own URL.', 'Sundance page should be independently addressable by URL.', 'EDITORIAL_CONTENT', 'Supports direct discovery and sharing.', 'Future editorial/content program', 'Public content routing', ['No Sundance route found.'], 'NOT_FOUND_IN_REPOSITORY', 'No route validation found.', 'Not certified.', ['Content authorization', 'SEO review'], [], 'Defer with Sundance page requirement.', 'Future Local Editorial Experience program', true, 'Open requirement.'),
  req('022', 'There should be several articles written about Sundance once REIE starts producing articles.', 'Future article strategy should include Sundance-related articles.', 'EDITORIAL_CONTENT', 'Supports organic reach and lifestyle authority.', 'Future editorial/content program', 'Article strategy', ['app/articles/[slug]/page.tsx exists; no repository evidence of Sundance article content found.'], 'PLANNED', 'Article framework exists; content not found.', 'Not certified.', ['Editorial calendar', 'rights/trademark review'], [], 'Plan for future authorized editorial production.', 'Future Local Editorial Experience program', true, 'Content production is outside this governance review.'),
  req('023', 'Mobile content needs to be brought in on both left and right sides.', 'Improve mobile horizontal spacing so content does not feel crowded.', 'MOBILE_EXPERIENCE', 'Improves mobile readability and polish.', 'CEP 1.0', 'Responsive layout system', ['Public pages use px-7/sm:px-10 shells; CEP sprints performed responsive review.'], 'PARTIALLY_IMPLEMENTED', 'Needs source-specific mobile spacing QA.', 'Responsive behavior certified for CEP sprints, not this exact global requirement.', ['Mobile visual QA'], [], 'Retain as open responsive polish requirement.', 'Future CEP mobile polish sprint', true, 'Open because original mobile spacing complaint has not been globally reconciled.'),
  req('024', 'Map color filters do not show up initially; they appear only when zooming out.', 'Initial map styling/filter state should match intended design without requiring zoom changes.', 'SEARCH_MAP', 'Improves first impression and map trust.', 'CEP 1.0', 'Map initial render styling', ['SearchMap uses OpenTopoMap and optional Mapbox overlay; no three theme filters found.'], 'PARTIALLY_IMPLEMENTED', 'Map rendering certified generally; this exact color-filter behavior not certified.', 'Not certified against source requirement.', ['Map style/provider review', 'browser visual QA'], [], 'Keep open for authorized map visual review.', 'Future Search/Map visual styling sprint', true, 'Open map styling requirement.'),
  req('025', 'Water color is not close to established Electric Caribbean Blue.', 'Map water styling should match Electric Caribbean Blue where provider/style control permits.', 'SEARCH_MAP', 'Improves brand alignment.', 'CEP 1.0', 'Map basemap styling', ['Current map tile sources do not expose governed water-color control in repository code.'], 'NOT_FOUND_IN_REPOSITORY', 'No validation found for water color requirement.', 'Not certified.', ['Map provider/style authorization'], ['Third-party tile styling may limit water color control.'], 'Defer until map-style architecture authorization.', 'Future Search/Map visual styling sprint', true, 'Open requirement.'),
  req('026', 'Editorial Separation Principle adopted.', 'Editorial content, market commentary, lifestyle descriptions, local guidance, and community narratives must not become governed geographic facts without classification, source attribution, trust review, and activation approval.', 'GEOGRAPHIC_GOVERNANCE', 'Protects trust and prevents unsupported geographic claims.', 'GKM/GMA/EIP/GIS', 'Geographic knowledge governance', ['GKM and GMA docs; source document governance update.'], 'IMPLEMENTED_CERTIFIED', 'Prior GKM/GMA/EIP records certify governance principle.', 'Governance certified, no runtime activation.', ['Future activation authorization'], [], 'Retain as binding governance rule.', 'Maintenance governance', false, 'Source document records adoption.'),
  req('027', 'GKM 1.0 classified existing geographic knowledge without runtime activation.', 'Existing geographic knowledge inventory must remain separated from runtime activation, persistence, GIO population, property assignment, and customer-facing change.', 'GEOGRAPHIC_GOVERNANCE', 'Preserves evidence integrity.', 'GKM 1.0', 'Knowledge inventory governance', ['docs/project-atlas/executive-library/GKM-1.0-GEOGRAPHIC-KNOWLEDGE-MATRIX.md'], 'IMPLEMENTED_CERTIFIED', 'Certified in prior governance records.', 'No customer activation.', ['Future GIO activation gates'], [], 'Retain as certified governance.', 'Maintenance governance', false, 'Source document references certification commit.'),
  req('028', 'GMA 1.0 is prerequisite for all internal geographic mapping.', 'Canonical selection, mapping types, confidence, lifecycle, evidence, ambiguity stop rules, human review, and activation gates govern mapping.', 'GEOGRAPHIC_GOVERNANCE', 'Prevents incorrect geographic automation.', 'GMA 1.0', 'Mapping architecture', ['docs/project-atlas/executive-library/GMA-1.0-GEOGRAPHIC-MAPPING-ARCHITECTURE.md'], 'IMPLEMENTED_CERTIFIED', 'Certified in prior GMA records.', 'No customer activation.', ['Future mapping authorization'], [], 'Retain as certified prerequisite.', 'Maintenance governance', false, 'Source document references GMA certification.'),
  req('029', 'Editorial knowledge may not be converted into factual geography through automatic inference, frequency of use, runtime legacy, or AI proposal.', 'Geographic conversion requires explicit classification, source attribution, mapping evidence, trust review, human approval where required, and separate activation authorization.', 'GEOGRAPHIC_GOVERNANCE', 'Prevents AI/runtime overreach.', 'GMA/GKC/EIP', 'Geographic conversion governance', ['GMA and EIP governance records.'], 'IMPLEMENTED_CERTIFIED', 'Governance certified in prior records.', 'No runtime activation.', ['Future human approval workflows'], [], 'Retain as fail-closed rule.', 'Maintenance governance', false, 'Binding prohibition from source document.'),
  req('030', 'Internal geographic mapping, persistence, property assignment, search use, map use, public-page use, indexing, customer presentation, external-source mapping, and AI activation remain unauthorized until separately approved.', 'Geographic activation remains prohibited without separate authorization.', 'GEOGRAPHIC_GOVERNANCE', 'Protects public trust and provider boundaries.', 'GIS/GMA/EIP/EKCP', 'Geographic activation gates', ['GIS Sprint 8 docs', 'GMA/EIP/EKCP records.'], 'IMPLEMENTED_CERTIFIED', 'Multiple deterministic checks enforce no activation.', 'No customer activation.', ['Separate executive authorization'], [], 'Retain as active prohibition.', 'Maintenance governance', false, 'Source document lists current authorization boundary.'),
  req('031', 'Read-only mapping preview remains deterministic, non-authoritative, non-active, and no final canonical selection is authorized.', 'Preview records cannot become final mapping authority without separate approval.', 'GEOGRAPHIC_GOVERNANCE', 'Prevents accidental canonicalization.', 'GMA 1.0', 'Read-only mapping preview', ['lib/gma/readOnlyMappingPreviewFixtures.ts', 'GMA docs.'], 'IMPLEMENTED_CERTIFIED', 'Prior GMA checks/certifications validate preview-only behavior.', 'No production/customer activation.', ['Future canonical selection review'], [], 'Retain as certified boundary.', 'Maintenance governance', false, 'Source document lists preview ledger and issues.'),
  req('032', 'Internal Mapping Review Queue generated from preview ledger only; every item remains NOT_ELIGIBLE.', 'Internal mapping review queue remains deterministic review classification only.', 'GEOGRAPHIC_GOVERNANCE', 'Keeps review separate from activation.', 'GMA 1.0', 'Internal mapping review queue', ['lib/gma/internalMappingReviewQueue.ts', 'GMA docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in GMA records.', 'No production/customer activation.', ['Future decision fixture authorization'], [], 'Retain certified queue boundary.', 'Maintenance governance', false, 'Source document records queue status.'),
  req('033', 'Internal Review Decision Fixture validates representative decisions but does not authorize persistence, GIO population, final canonical selection, property assignment, runtime activation, customer-facing use, vendor mapping, scraping, or AI mapping.', 'Decision fixtures are deterministic governance only.', 'GEOGRAPHIC_GOVERNANCE', 'Keeps decisions testable without activation.', 'GMA 1.0', 'Review decision fixture', ['lib/gma/internalReviewDecisionFixture.ts', 'GMA docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in GMA records.', 'No production/customer activation.', ['Future persistence proof authorization'], [], 'Retain as certified fixture boundary.', 'Maintenance governance', false, 'Source document records fixture results.'),
  req('034', 'Internal quality readiness is not activation authority.', 'A READY quality result cannot authorize persistence, search, maps, property relationships, public pages, indexing, customer presentation, AI synthesis, or runtime activation.', 'ENTERPRISE_KNOWLEDGE_GOVERNANCE', 'Prevents quality score overreach.', 'EIP 1.0', 'Knowledge quality engine', ['lib/eip/enterpriseKnowledgeQualityEngine.ts', 'EIP Sprint 3 docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in EIP records.', 'No activation.', ['Future activation authorization'], [], 'Retain as certified governance rule.', 'Maintenance governance', false, 'Source document records EIP Sprint 3 rule.'),
  req('035', 'Internal Geographic Activation Readiness Ledger separates quality, readiness, authorization, and activation.', 'Readiness accounting must not become authorization or activation.', 'ENTERPRISE_KNOWLEDGE_GOVERNANCE', 'Keeps enterprise layers distinct.', 'EIP 1.0', 'Activation readiness ledger', ['EIP Sprint 4 docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in EIP records.', 'No activation.', ['Future authorization gates'], [], 'Retain as certified governance rule.', 'Maintenance governance', false, 'Source document records Sprint 4 boundary.'),
  req('036', 'Enterprise Knowledge Approval System replaces narrower Executive Review Packet and keeps approval separate from activation.', 'Approval request, decision record, audit trail, and policy govern knowledge approval without customer activation.', 'ENTERPRISE_KNOWLEDGE_GOVERNANCE', 'Supports governed approval without activation.', 'EIP 1.0', 'Knowledge approval system', ['lib/eip/enterpriseKnowledgeApprovalSystem.ts', 'EIP Sprint 5 docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in EIP records.', 'No activation.', ['Future activation authorization'], [], 'Retain as certified approval boundary.', 'Maintenance governance', false, 'Source document records architecture update.'),
  req('037', 'Sprint 6 production-internal geographic persistence pilot is limited to one approved Thornton municipality object and bounded rows.', 'Production-internal geographic persistence remains limited by approved pilot scope.', 'GEOGRAPHIC_GOVERNANCE', 'Proves controlled persistence without customer activation.', 'EIP/GIS', 'Production-internal geographic persistence', ['EIP Sprint 6 closure records in source document and repository history.'], 'IMPLEMENTED_CERTIFIED', 'Certified in prior records.', 'Production-internal only; no customer activation.', ['Future rollback or expansion authorization'], [], 'Retain as certified pilot boundary.', 'Maintenance governance', false, 'Source document records final counts.'),
  req('038', 'No customer visibility, property relationship, search consumption, map consumption, public page, SEO, indexing, analytics, AI, vendor, MLS, alert, CRM, email, or customer behavior activation occurred for Sprint 6.', 'Production-internal geographic pilot must remain non-customer-visible and non-integrated.', 'GEOGRAPHIC_GOVERNANCE', 'Protects customers and provider boundaries.', 'EIP/GIS/EKCP', 'Geographic activation separation', ['Source document Sprint 6 closure section; GIS/EKCP records.'], 'IMPLEMENTED_CERTIFIED', 'Prior certifications confirm zero customer activation.', 'No customer activation.', ['Separate activation authorization'], [], 'Retain as hard boundary.', 'Maintenance governance', false, 'Source document records zero customer visibility.'),
  req('039', 'Rollback remains available and requires separate authorization.', 'Rollback, retirement, deletion, second object, customer activation, and next sprint require separate authorization.', 'GEOGRAPHIC_GOVERNANCE', 'Preserves operational control.', 'EIP/GIS', 'Rollback governance', ['Source document Sprint 6 closure section.'], 'IMPLEMENTED_CERTIFIED', 'Certified in prior closure records.', 'No further action authorized.', ['Executive authorization'], [], 'Retain as governance boundary.', 'Maintenance governance', false, 'Source document records rollback boundary.'),
  req('040', 'EKCP adapter separates persistence, read retrieval, enterprise consumption, runtime activation, and customer visibility.', 'Enterprise consumption readiness must not activate runtime or customer visibility.', 'ENTERPRISE_KNOWLEDGE_GOVERNANCE', 'Protects layer boundaries.', 'EKCP 1.0', 'Enterprise geographic consumer adapter', ['lib/ekcp/enterpriseGeographicConsumerAdapter.ts', 'EKCP docs.'], 'IMPLEMENTED_CERTIFIED', 'Certified in EKCP records.', 'No runtime/customer activation.', ['Future EKCP sprint authorization'], [], 'Retain as certified architecture principle.', 'Maintenance governance', false, 'Source document includes EKCP certification and retained boundaries.'),
];

export function buildReieAdjustmentTraceabilityRegister(): ReieAdjustmentTraceabilityRegister {
  return {
    version: REIE_ADJUSTMENTS_TRACEABILITY_CONTRACT_VERSION,
    sourceDocument: {
      title: 'PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS',
      googleDocumentId: '1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs',
      modifiedTime: '2026-07-26T12:29:10.522Z',
      sourceReconciliationStatus: 'SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY',
    },
    policy: {
      strategicCompletionRequiresReconciliation: true,
      futureImplementationMustDeclareRelationship: true,
      supersededRequiresRationaleAndExecutiveApproval: true,
      implementationAuthorizationRequiredForOpenRequirements: true,
      runtimeActivationAuthorized: false,
    },
    requirements: reieAdjustmentRequirements,
  };
}

export function validateReieAdjustmentTraceabilityRegister(
  register: ReieAdjustmentTraceabilityRegister = buildReieAdjustmentTraceabilityRegister(),
): ReieAdjustmentTraceabilityValidationResult {
  const issues: string[] = [];
  const ids = new Set<string>();

  if (register.sourceDocument.sourceReconciliationStatus !== 'SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY') {
    issues.push('Source document must be reconciled from read-only Google Doc evidence or explicitly marked partial.');
  }
  if (register.policy.strategicCompletionRequiresReconciliation !== true) issues.push('Strategic completion reconciliation rule must be active.');
  if (register.policy.futureImplementationMustDeclareRelationship !== true) issues.push('Future implementation relationship rule must be active.');
  if (register.policy.supersededRequiresRationaleAndExecutiveApproval !== true) issues.push('SUPERSEDED rationale and executive approval rule must be active.');
  if (register.policy.runtimeActivationAuthorized !== false) issues.push('Requirements register must not authorize runtime activation.');

  for (const requirement of register.requirements) {
    if (ids.has(requirement.identifier)) issues.push(`Duplicate requirement identifier ${requirement.identifier}.`);
    ids.add(requirement.identifier);
    if (!/^REIE-ADJ-\d{3}$/.test(requirement.identifier)) issues.push(`Invalid requirement identifier ${requirement.identifier}.`);
    if (!requirement.originalRequirement) issues.push(`${requirement.identifier} is missing original requirement.`);
    if (!requirement.normalizedRequirement) issues.push(`${requirement.identifier} is missing normalized requirement.`);
    if (!requirement.owningProgram) issues.push(`${requirement.identifier} is missing owning program.`);
    if (!requirement.owningPlatformCapability) issues.push(`${requirement.identifier} is missing owning platform capability.`);
    if (!reieAdjustmentStatusValues.includes(requirement.implementationStatus)) issues.push(`${requirement.identifier} has invalid status.`);
    if (!requirement.recommendedDisposition) issues.push(`${requirement.identifier} is missing recommended disposition.`);
    if (requirement.implementationStatus === 'SUPERSEDED' && !requirement.supersededRationale) {
      issues.push(`${requirement.identifier} is marked SUPERSEDED without rationale.`);
    }
    if (requirement.implementationStatus === 'IMPLEMENTED_CERTIFIED' && !requirement.certificationEvidence?.length) {
      issues.push(`${requirement.identifier} is marked certified without evidence.`);
    }
  }

  if (register.requirements.length < 40) issues.push('Requirements register must include all identified source requirements.');
  if (!register.requirements.some((requirement) => requirement.implementationStatus !== 'IMPLEMENTED_CERTIFIED')) {
    issues.push('Unresolved requirements must remain visible.');
  }

  return { valid: issues.length === 0, issues };
}

function req(
  numericId: string,
  originalRequirement: string,
  normalizedRequirement: string,
  category: ReieAdjustmentRequirementCategory,
  customerValue: string,
  owningProgram: string,
  owningPlatformCapability: string,
  repositoryEvidence: string[],
  implementationStatus: ReieAdjustmentRequirementStatus,
  validationStatus: string,
  productionStatus: string,
  dependencies: string[],
  conflicts: string[],
  recommendedDisposition: string,
  proposedImplementationProgramOrSprint: string,
  executiveAuthorizationRequired: boolean,
  notes: string,
): ReieAdjustmentRequirement {
  const certificationEvidence = implementationStatus === 'IMPLEMENTED_CERTIFIED' ? repositoryEvidence : undefined;

  return {
    identifier: `REIE-ADJ-${numericId}`,
    originalRequirement,
    normalizedRequirement,
    category,
    customerValue,
    owningProgram,
    owningPlatformCapability,
    repositoryEvidence,
    implementationStatus,
    validationStatus,
    productionStatus,
    dependencies,
    conflicts,
    recommendedDisposition,
    proposedImplementationProgramOrSprint,
    executiveAuthorizationRequired,
    notes,
    certificationEvidence,
  };
}
