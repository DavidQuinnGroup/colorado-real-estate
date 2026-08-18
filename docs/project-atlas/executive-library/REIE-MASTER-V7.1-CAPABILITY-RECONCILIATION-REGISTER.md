# REIE Master V7.1 Capability Reconciliation Register

Program: PROJECT ATLAS / REIE Product Experience, Capability, and Master-Vision Reconciliation
Date: 2026-08-18
Status: `MASTER_V7_1_INITIAL_MODULE_REGISTER_ESTABLISHED`
Scope: Executive-HQ supplied Modules 6, 7, 8, 10, and confirmed Module 16 Sundance requirements

## Operating Rule

This is an incremental reconciliation register, not a feature backlog. It
records the difference between supplied Master intent, later certified
architecture, repository evidence, and the next Executive decision. It does
not authorize implementation, visual redesign, provider access, data
retrieval, persistence, customer visibility, or production activation.

The register uses the adopted completion statuses from
`REIE-CUSTOMER-FACING-CAPABILITY-COMPLETION-STANDARD.md` and the following
capability classifications:

- `IMPLEMENTED_CERTIFIED_EQUIVALENT`
- `IMPLEMENTED_PARTIAL`
- `FOUNDATIONAL_ONLY`
- `NOT_IMPLEMENTED`
- `SUPERSEDED_BY_SAFER_ARCHITECTURE`
- `BLOCKED_BY_COMPLIANCE_REVIEW`
- `BLOCKED_BY_DATA_SOURCE`
- `EXECUTIVE_DECISION_REQUIRED`

Finite gap types are:

`NO_GAP`, `SURFACING_GAP`, `EXPERIENCE_GAP`, `FUNCTIONAL_GAP`,
`INTELLIGENCE_SOURCE_GAP`, `ARCHITECTURE_GAP`, `COMPLIANCE_GAP`,
`DOCUMENTATION_GAP`, `SUPERSEDED_NO_ACTION`, `UNKNOWN_REQUIRES_REVIEW`.

## Evidence Classification

- `DIRECT_EVIDENCE`: supplied by Executive HQ in the current package.
- `REPOSITORY_DERIVED`: observed in current code or certified repository docs.
- `UNKNOWN_REQUIRES_REVIEW`: not enough evidence to claim equivalence.

The Master text was not treated as fully repository-accessible. This first
register therefore maps only the supplied modules and preserves unknowns for
incremental expansion.

## Module 6: Strategic Financial Synthesis

| Master module / capability | Direct Master evidence | Current certified equivalent and repository implementation | Customer-facing state | Agent/admin state | Supersession / compliance | Classification | Gap / priority | Dependencies / next decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 6.a Pre-Discovery Brief Integration | `DIRECT_EVIDENCE`: pre-discovery brief integration | Buyer preparation, financing education, and Advisory question preparation in `/buy`, `BuyerFinancingDecisionPlanner`, and `AdvisoryHandoffGuide` | `PARTIALLY_IMPLEMENTED` | Decision workspaces and advisory preparation exist | Later certified preparation-first boundary supersedes any automatic approval or recommendation behavior | `IMPLEMENTED_PARTIAL` | `EXPERIENCE_GAP` / P1 | Define the governed brief contract before adding more financial outputs |
| 6.b Advanced Features | `DIRECT_EVIDENCE`: advanced lending, investment, narrative, logistics, and Sundance yield scope | Separate financing, financial, seller, market, and logistics foundations; no unified Module 6 Hub | `PARTIALLY_IMPLEMENTED` | Foundations are distributed across code and admin review | Do not treat distributed foundations as full Hub equivalence | `EXECUTIVE_DECISION_REQUIRED` | `ARCHITECTURE_GAP` / P0 | Decide whether the scope remains educational preparation or is rearchitected under compliance review |
| 6.1 Advanced Lending Suite / Digital Loan Officer | `DIRECT_EVIDENCE`: Digital Loan Officer | `/buy`, `BuyerFinancingDecisionPlanner`, `FinancingConfidenceEducation`, and user-assumption calculator; explicit no-approval/no-lender-workflow boundary | `PARTIALLY_IMPLEMENTED` | No lender workflow or provider integration | Certified safer successor is preparation and education, not a Digital Loan Officer | `SUPERSEDED_BY_SAFER_ARCHITECTURE` | `COMPLIANCE_GAP` / P0 | Executive decision on retained educational scope; no lender integration in this package |
| 6.1.1 Loan Type Logic Engine | `DIRECT_EVIDENCE`: loan type logic | `lib/marketMetrics.ts` contains FHA and conventional calculations; `financialEngine.ts` contains a broader matrix; no certified customer loan-type engine | `PARTIALLY_IMPLEMENTED` | Internal code exists without full equivalence certification | Rates, eligibility, and lender outcomes remain outside authority | `IMPLEMENTED_PARTIAL` | `COMPLIANCE_GAP` / P1 | Counsel and lender-governance review before expansion |
| 6.1.1.1 FHA Modeling | `DIRECT_EVIDENCE`: FHA modeling | `calculateFHAPayment` and educational user-input paths | `PARTIALLY_IMPLEMENTED` | Deterministic calculation foundation | Not a qualification or loan-product recommendation | `IMPLEMENTED_PARTIAL` | `COMPLIANCE_GAP` / P1 | Confirm permitted assumptions and disclosure language |
| 6.1.1.2 Conventional Modeling | `DIRECT_EVIDENCE`: conventional modeling | `calculateConventionalPayment` and user-assumption scenario calculator | `PARTIALLY_IMPLEMENTED` | Deterministic calculation foundation | Not a quote, approval, or affordability conclusion | `IMPLEMENTED_PARTIAL` | `COMPLIANCE_GAP` / P1 | Confirm permitted assumptions and verification boundary |
| 6.1.1.3 Specialty Loans | `DIRECT_EVIDENCE`: specialty loans | No certified specialty-loan implementation or source evidence found | `NOT_FOUND_IN_REPOSITORY` | No governed workflow found | Requires product, provider, and compliance decisions | `NOT_IMPLEMENTED` | `INTELLIGENCE_SOURCE_GAP` / P1 | Decide whether to keep, defer, or deprecate the concept |
| 6.1.2 Total Cost of Living Calculator | `DIRECT_EVIDENCE`: TCOL calculator | `calculateTCOL` in `lib/financialEngine.ts`; related assumptions appear in financing/market code; no certified dedicated TCOL surface | `PARTIALLY_IMPLEMENTED` | Calculation foundation exists | Financial advice and property-specific completeness remain blocked | `IMPLEMENTED_PARTIAL` | `SURFACING_GAP` / P1 | Reconcile assumptions, source freshness, and customer-surface boundary |
| 6.1.2.1 North Star Integration | `DIRECT_EVIDENCE`: North Star integration | Product North Star governs experience direction; no certified financial integration contract | `FOUNDATIONAL_ONLY` | Governance reference only | Visual direction does not create financial authority | `FOUNDATIONAL_ONLY` | `ARCHITECTURE_GAP` / P1 | Define decision moment and evidence contract first |
| 6.1.2.2 Local Tax & HOA Sync | `DIRECT_EVIDENCE`: local tax and HOA sync | User-entered assumptions and questions; no governed live sync | `NOT_FOUND_IN_REPOSITORY` | No authorized provider/data sync | Data source and rights are unresolved | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Source, rights, freshness, and compliance review |
| 6.1.3 Amortization Visualizer | `DIRECT_EVIDENCE`: amortization visualizer | Principal-and-interest arithmetic exists; no dedicated amortization visualizer or certified schedule surface found | `NOT_FOUND_IN_REPOSITORY` | Calculation foundation only | Must remain educational if pursued | `NOT_IMPLEMENTED` | `FUNCTIONAL_GAP` / P1 | Executive decision and financial disclosure review |
| 6.2 Investment Intelligence Hub | `DIRECT_EVIDENCE`: portfolio and investment intelligence hub | No certified customer investment hub; existing language explicitly rejects investment recommendations and suitability conclusions | `NOT_FOUND_IN_REPOSITORY` | Some financial foundations exist, not an investment system | Safer architecture supersedes automatic investment authority | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Executive decision with legal/compliance review |
| 6.2.1 Portfolio Goal Alignment | `DIRECT_EVIDENCE`: portfolio goal alignment | No repository evidence of a governed portfolio profile or goal engine | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Suitability and fiduciary implications unresolved | `EXECUTIVE_DECISION_REQUIRED` | `COMPLIANCE_GAP` / P0 | Decide whether to deprecate or rearchitect as question preparation |
| 6.2.2 Cash Flow Engine | `DIRECT_EVIDENCE`: cash flow engine | Financial and market calculations exist but no certified investment cash-flow product | `FOUNDATIONAL_ONLY` | Backend-like foundations only | Not investment analysis authority | `BLOCKED_BY_COMPLIANCE_REVIEW` | `FUNCTIONAL_GAP` / P0 | Define permitted educational scope and source requirements |
| 6.2.2.1 Hard Costs | `DIRECT_EVIDENCE`: hard costs | TCOL and ownership-cost assumptions provide partial educational foundation | `PARTIALLY_IMPLEMENTED` | Calculation foundations | Completeness and source provenance remain open | `IMPLEMENTED_PARTIAL` | `INTELLIGENCE_SOURCE_GAP` / P1 | Define verified inputs and limitation display |
| 6.2.2.2 GC Reserve / CAPEX | `DIRECT_EVIDENCE`: GC reserve / CAPEX | `calculateCAPEXReserve` and `MarketChart` references exist | `FOUNDATIONAL_ONLY` | Calculation foundation | No property-condition authority or recommendation | `IMPLEMENTED_PARTIAL` | `COMPLIANCE_GAP` / P1 | Reconcile model assumptions and professional handoff |
| 6.2.3 Profitability Visualization | `DIRECT_EVIDENCE`: profitability visualization | No certified investment-profitability surface found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Investment recommendation risk | `BLOCKED_BY_COMPLIANCE_REVIEW` | `FUNCTIONAL_GAP` / P0 | Executive decision required |
| 6.2.3.1 Break-Even Analysis | `DIRECT_EVIDENCE`: break-even analysis | No certified break-even contract found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Investment and tax assumptions unresolved | `NOT_IMPLEMENTED` | `FUNCTIONAL_GAP` / P1 | Decide whether to retain as education |
| 6.2.3.2 Equity & Appreciation Projection | `DIRECT_EVIDENCE`: equity and appreciation projection | Related chart/calculation code exists, but certified public authority is explicitly absent | `FOUNDATIONAL_ONLY` | Calculation foundation only | No appreciation forecast, valuation, or investment conclusion authority | `SUPERSEDED_BY_SAFER_ARCHITECTURE` | `COMPLIANCE_GAP` / P0 | Do not expose without an executive and compliance decision |
| 6.3 Strategic Narrative Generation | `DIRECT_EVIDENCE`: AI summary and strategy bridge | `generateFinancialNarrative` exists; current customer experience uses bounded educational and question-preparation language | `FOUNDATIONAL_ONLY` | Code foundation, no AI activation | Recommendation and investment language require safer successor | `SUPERSEDED_BY_SAFER_ARCHITECTURE` | `COMPLIANCE_GAP` / P0 | Decide whether to retain deterministic educational summaries |
| 6.3.1 AI Summary Logic | `DIRECT_EVIDENCE`: AI summary logic | No authorized AI activation for financial decisions | `NOT_FOUND_IN_REPOSITORY` | AI remains deferred | No AI or model-provider activation | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Separate AI governance decision |
| 6.3.2 Strategy Bridge | `DIRECT_EVIDENCE`: strategy bridge | Decision workspaces and Advisory continuation provide bounded question handoff | `PARTIALLY_IMPLEMENTED` | Advisory preparation exists | No automatic strategy recommendation | `IMPLEMENTED_PARTIAL` | `EXPERIENCE_GAP` / P1 | Define human-review handoff contract |
| 6.4 Logistics & Moving Cost Estimator | `DIRECT_EVIDENCE`: logistics and moving cost estimator | `/api/logistics` and moving/logistics preparation evidence exist; no unified Module 6 surface | `PARTIALLY_IMPLEMENTED` | Supporting infrastructure exists | No hidden transfer or customer-data mutation authorized | `IMPLEMENTED_PARTIAL` | `SURFACING_GAP` / P1 | Reconcile with Module 8 transition logic |
| 6.4.1 Net Proceed Accuracy | `DIRECT_EVIDENCE`: net proceed accuracy | Seller/home-worth preparation exists, not certified net-proceeds authority | `FOUNDATIONAL_ONLY` | Seller preparation foundations | Valuation, costs, and tax inputs require review | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Decide permitted seller-preparation scope |
| 6.4.2 Transition Modeling | `DIRECT_EVIDENCE`: transition modeling | Seller/buyer workspaces and logistics route provide partial preparation | `PARTIALLY_IMPLEMENTED` | Cross-journey foundations | No automatic sell-to-buy recommendation | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P1 | Reconcile with Module 8 integration-layer decision |
| 6.5 Sundance Yield Model | `DIRECT_EVIDENCE`: Sundance yield model and festival multiplier | Sundance route is editorial orientation only; no yield, rental projection, multiplier, license forensic, or ROI engine | `PARTIALLY_IMPLEMENTED` | No yield model | Must remain separate from editorial route and investment authority | `NOT_IMPLEMENTED` | `COMPLIANCE_GAP` / P0 | Executive decision on deprecation or rearchitecture |

## Module 7: Senior Transitions Hub

| Master capability | Direct Master evidence | Repository implementation and related evidence | Customer-facing state | Agent/admin state | Supersession / compliance | Classification | Gap / priority | Dependencies / next decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7 Senior Transitions Hub | `DIRECT_EVIDENCE`: named Hub | No senior-specific route or exact named Hub found; seller, home-worth, financial, moving, property, CRM, and Advisory foundations exist | `NOT_FOUND_IN_REPOSITORY` | Related operational surfaces exist | Do not infer senior equivalence from generic journeys | `EXECUTIVE_DECISION_REQUIRED` | `ARCHITECTURE_GAP` / P0 | Decide whether to retain as a distinct Hub |
| 7.1 Maintenance-Free Living Logic | `DIRECT_EVIDENCE`: maintenance-free living | Seller/home-worth and ownership-cost prompts provide adjacent preparation only | `FOUNDATIONAL_ONLY` | No senior-specific logic | Health, care, and suitability implications require review | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Define allowed neutral orientation scope |
| 7.1.1 Hidden Cost Analyzer | `DIRECT_EVIDENCE`: hidden cost analyzer | TCOL/CAPEX foundations and seller questions are adjacent, not senior-specific | `FOUNDATIONAL_ONLY` | Calculation foundations only | No complete cost or care authority | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Decide whether cost questions can be retained |
| 7.1.2 Scenario Modeling | `DIRECT_EVIDENCE`: scenario modeling | Financing and market scenario foundations exist; no senior-transition scenarios | `FOUNDATIONAL_ONLY` | Distributed calculations | Requires guardrails and no suitability conclusion | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P1 | Define scenario contract |
| 7.1.3 Facility Database Integration | `DIRECT_EVIDENCE`: facility database | No facility database, source, rights, or integration found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Data source, privacy, and freshness unresolved | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Source and compliance decision |
| 7.2 Retirement Funding & Equity Bridge | `DIRECT_EVIDENCE`: retirement funding and equity bridge | Home-worth and financial foundations are not retirement or equity advice | `FOUNDATIONAL_ONLY` | No senior financial workflow | Tax, financial, suitability, and legal boundaries apply | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Executive decision required |
| 7.2.1 Cash-Out Projector | `DIRECT_EVIDENCE`: cash-out projector | No certified cash-out or retirement projector found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Financial advice risk | `NOT_IMPLEMENTED` | `COMPLIANCE_GAP` / P0 | Decide whether to deprecate |
| 7.2.2 Medicare & Tax Guardrail Prompts | `DIRECT_EVIDENCE`: Medicare and tax prompts | No exact Medicare or senior tax prompt contract found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Mandatory legal/medical/tax review | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Executive and counsel decision |
| 7.3 Senior-Specific Inventory Filters | `DIRECT_EVIDENCE`: senior-specific filters | Search/property filters exist, but no senior-specific structural or care filters | `PARTIALLY_IMPLEMENTED` | Search foundations exist | Care and suitability implications unresolved | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Decide permitted neutral filters |
| 7.3.1 Structural Compatibility | `DIRECT_EVIDENCE`: structural compatibility | No exact senior-specific filter found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Property facts require source and verification | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P1 | Define factual, non-suitability scope |
| 7.3.2 Proximity to Care | `DIRECT_EVIDENCE`: proximity to care | No care-facility source or filter found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Source, privacy, and suitability review | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Source and compliance decision |
| 7.4 Estate & Heir Integration / Legacy Portal | `DIRECT_EVIDENCE`: estate, heir, and legacy portal | No heir, estate, document-vault, or legacy portal route found; CRM and advisory persistence are not equivalent | `NOT_FOUND_IN_REPOSITORY` | CRM/admin foundations do not establish a vault | Privacy, document, legal, and persistence boundaries | `BLOCKED_BY_COMPLIANCE_REVIEW` | `ARCHITECTURE_GAP` / P0 | Executive decision before any persistence design |
| 7.4.1 Invite an Heir | `DIRECT_EVIDENCE`: heir invitation | No implementation found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Identity, consent, and account boundary required | `NOT_IMPLEMENTED` | `COMPLIANCE_GAP` / P0 | Decide whether to retain |
| 7.4.2 Document Vaulting | `DIRECT_EVIDENCE`: document vaulting | No document vault or authorized persistence surface found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Security, privacy, retention, and legal review required | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Separate persistence authorization |

## Module 8: Multi-Dimensional Strategy Suite

| Master capability | Direct Master evidence | Repository implementation | Customer-facing state | Agent/admin state | Interpretation | Classification | Gap / priority | Dependencies / next decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8 Multi-Dimensional Strategy Suite | `DIRECT_EVIDENCE`: named Suite | `app/grand-plan`, buyer/seller/property/market/financing workspaces, compare, offer preparation, logistics, and Advisory handoff are distributed | `PARTIALLY_IMPLEMENTED` | Related admin and CRM preparation exists | Best current interpretation is an integration/orchestration layer over existing products, not a complete unified product | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P0 | Executive decision: unified product or explicit orchestration layer |
| 8.1 Sell-to-Buy Transition Logic | `DIRECT_EVIDENCE`: sell-to-buy transition | Seller and buyer workspaces plus Grand Plan provide adjacent preparation | `PARTIALLY_IMPLEMENTED` | Advisory/CRM handoff foundations | No automatic transaction strategy or hidden context transfer | `IMPLEMENTED_PARTIAL` | `EXPERIENCE_GAP` / P1 | Define cross-journey contract |
| 8.1.1 Equity Bridge | `DIRECT_EVIDENCE`: equity bridge | Home-worth and financial foundations do not establish equity bridge authority | `FOUNDATIONAL_ONLY` | No certified bridge workflow | Valuation and financial evidence unresolved | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Source and compliance review |
| 8.1.2 Contingency Timeline | `DIRECT_EVIDENCE`: contingency timeline | No exact contingency timeline engine found; Grand Plan can organize questions | `FOUNDATIONAL_ONLY` | Advisory preparation only | Contract/legal meaning requires professional review | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Decide neutral planning scope |
| 8.1.3 Intertwined Assessment | `DIRECT_EVIDENCE`: intertwined assessment | Cross-route decision workspaces exist without a certified combined assessment | `FOUNDATIONAL_ONLY` | Distributed intelligence foundations | No combined suitability or recommendation conclusion | `SUPERSEDED_BY_SAFER_ARCHITECTURE` | `COMPLIANCE_GAP` / P0 | Preserve question preparation only |
| 8.2 Listing Prep & Tactical Concessions Engine | `DIRECT_EVIDENCE`: listing prep and concessions | `/sell`, `SellerReadinessGuide`, `sellerDecisionWorkspace`, and offer preparation foundations | `PARTIALLY_IMPLEMENTED` | Seller update/admin preparation exists | No tactical recommendation authority certified | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Define bounded seller-preparation successor |
| 8.2.1 Prep ROI Calculator | `DIRECT_EVIDENCE`: prep ROI | No certified prep ROI calculator found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Valuation and return claims require review | `NOT_IMPLEMENTED` | `COMPLIANCE_GAP` / P0 | Executive decision required |
| 8.2.2 Scenario Modeling / Strategy Choice | `DIRECT_EVIDENCE`: scenario modeling and strategy choice | Seller strategy and preparation prompts exist; no certified strategy-choice engine | `FOUNDATIONAL_ONLY` | Human review preparation exists | No automated recommendation | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P1 | Define decision-support limits |
| 8.2.3 Probability of Sale | `DIRECT_EVIDENCE`: probability of sale | No probability-of-sale implementation found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Prediction and claim risk | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Decide whether to deprecate |
| 8.3 Strategy Generator / Backend Logic | `DIRECT_EVIDENCE`: strategy generator | `lib/strategyGenerator.ts`, buyer/seller/property decision workspaces | `PARTIALLY_IMPLEMENTED` | Deterministic foundations | Current safer architecture keeps outputs preparatory and bounded | `IMPLEMENTED_PARTIAL` | `SURFACING_GAP` / P1 | Map to a coherent orchestration contract |
| 8.3.1 Offer Strategy / Buyer | `DIRECT_EVIDENCE`: buyer offer strategy | `offerPreparationReadiness.ts` and buyer preparation exist | `PARTIALLY_IMPLEMENTED` | Offer preparation foundations | No legal, negotiation, or outcome authority | `IMPLEMENTED_PARTIAL` | `COMPLIANCE_GAP` / P1 | Define professional handoff boundary |
| 8.3.2 Marketing Strategy / Seller | `DIRECT_EVIDENCE`: seller marketing strategy | Seller readiness and seller decision workspace exist | `PARTIALLY_IMPLEMENTED` | Seller preparation/admin surfaces | No automated marketing recommendation certification | `IMPLEMENTED_PARTIAL` | `EXPERIENCE_GAP` / P1 | Define bounded strategy education |
| 8.3.3 Negotiation Playbook | `DIRECT_EVIDENCE`: negotiation playbook | No exact negotiation playbook found | `NOT_FOUND_IN_REPOSITORY` | No equivalent | Legal and agency boundaries apply | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Executive/counsel decision |
| 8.4 Tactical Moving & Getting Ready Logistics | `DIRECT_EVIDENCE`: moving and readiness logistics | `/api/logistics`, moving preparation, seller/buyer readiness | `PARTIALLY_IMPLEMENTED` | Advisory preparation exists | No automatic transition command or persistence | `IMPLEMENTED_PARTIAL` | `SURFACING_GAP` / P1 | Reconcile with Module 6 logistics |
| 8.4.1 Moving Cost Estimator | `DIRECT_EVIDENCE`: moving cost estimator | Logistics route/foundation exists; no full certified estimator evidence in this review | `FOUNDATIONAL_ONLY` | No unified estimator surface | Assumptions and provider/source questions remain | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Define assumptions and evidence posture |
| 8.4.2 Post-Closing Strategy | `DIRECT_EVIDENCE`: post-closing strategy | No exact post-closing strategy surface found; Advisory can prepare questions | `FOUNDATIONAL_ONLY` | Advisory handoff only | Legal/transaction completion boundaries | `NOT_IMPLEMENTED` | `ARCHITECTURE_GAP` / P1 | Executive decision required |

## Module 10: DQG Master App And Master Control Panel Logic

| Master capability | Direct Master evidence | Repository implementation | Functional equivalence finding | Classification | Gap / priority | Next decision |
| --- | --- | --- | --- | --- | --- | --- |
| 10 Master Control Panel | `DIRECT_EVIDENCE`: Master App and MCP | `/admin` and `components/admin/MasterControlPanel.tsx`; protected control-state, intake, CRM, MLS, alert, and search operations | Internal operational MCP exists, but existence alone is not Module-10 equivalence | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P0 | Compare the intended private-app operator against current operational control scope |
| 10.1 Global Visibility Toggles | `DIRECT_EVIDENCE`: global visibility toggles | Control state includes mode, public exposure, map precision, private layer, strategy gate, and kill switch | Meaningful partial equivalence; exact Master toggle semantics are not certified | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Define canonical toggle contract |
| 10.1.1 Map Data | `DIRECT_EVIDENCE`: map data toggle | Map precision/area-cloud controls and map operations are present | Partial map masking/control, not complete Master behavior equivalence | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Reconcile map authority and control states |
| 10.1.2 Valuation Detail | `DIRECT_EVIDENCE`: valuation detail toggle | No exact MCP valuation-detail toggle found | No functional equivalence evidence | `NOT_IMPLEMENTED` | `FUNCTIONAL_GAP` / P1 | Decide whether this remains internal-only |
| 10.1.3 Lending Scenarios | `DIRECT_EVIDENCE`: lending scenarios toggle | Financing tools exist outside MCP; no exact MCP toggle found | No functional equivalence evidence | `NOT_IMPLEMENTED` | `ARCHITECTURE_GAP` / P1 | Decide whether MCP should orchestrate financing visibility |
| 10.1.4 Dynamic Jittering Logic | `DIRECT_EVIDENCE`: dynamic jittering | Area-cloud/map precision masking exists; exact jitter implementation not established | Partial safety-adjacent map masking, not proven equivalence | `IMPLEMENTED_PARTIAL` | `FUNCTIONAL_GAP` / P1 | Define whether jittering is required and verify privacy semantics |
| 10.1.5 Reveal Protocol | `DIRECT_EVIDENCE`: reveal protocol | No exact Reveal Protocol contract found | No functional equivalence evidence | `NOT_IMPLEMENTED` | `ARCHITECTURE_GAP` / P0 | Executive decision before any reveal behavior |
| 10.2 Strategy Gate / 40-60 Split | `DIRECT_EVIDENCE`: Strategy Gate and 40-60 split | `strategyGate` exists in control state, but exact 40-60 behavior was not established | Partial control-field foundation only | `EXECUTIVE_DECISION_REQUIRED` | `ARCHITECTURE_GAP` / P0 | Define exact semantics, owner, and compliance boundary |

## Module 16: Sundance Film Festival Intelligence Hub

| Master / adjustment requirement | Direct evidence | Current repository evidence | Customer-facing state | Separation rule | Classification | Gap / priority | Next decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Module 16 Sundance Film Festival Intelligence Hub | `DIRECT_EVIDENCE`: Sundance identified as Module 16 | `app/sundance-film-festival/page.tsx`, sitemap entry, production certification, and bounded editorial authority markers | `PARTIALLY_IMPLEMENTED` | Existing route is not a complete live Intelligence Hub | `IMPLEMENTED_PARTIAL` | `ARCHITECTURE_GAP` / P0 | Decide Hub scope, sources, freshness, rights, and production evidence |
| Sundance editorial route | `DIRECT_EVIDENCE`: own URL | `/sundance-film-festival` is a real route with orientation, source boundaries, and continuity links | `IMPLEMENTED_CERTIFIED_EQUIVALENT` for bounded editorial orientation | Do not call it a live event guide or complete Hub | `NO_GAP` for current bounded scope | P1 maintenance | Preserve current certification and expand only by authorization |
| Sundance editorial/article program | `DIRECT_EVIDENCE`: multiple articles intended | Article route framework exists, but no Sundance article set was found | `FOUNDATIONAL_ONLY` | Editorial production is separate from live intelligence and yield modeling | `NOT_IMPLEMENTED` | `FUNCTIONAL_GAP` / P1 | Content, rights, trademark, and calendar decision |
| Sundance live intelligence | `DIRECT_EVIDENCE`: implied Intelligence Hub scope | Page explicitly excludes live schedule, ticketing, booking, and current event facts | `NOT_FOUND_IN_REPOSITORY` | Requires current sources and freshness certification | `BLOCKED_BY_DATA_SOURCE` | `INTELLIGENCE_SOURCE_GAP` / P0 | Source and rights decision |
| Sundance Yield Model | `DIRECT_EVIDENCE`: Module 6.5 | No rental projection, multiplier, licensing forensics, or executive ROI model | `NOT_FOUND_IN_REPOSITORY` | Separate from Module 16 editorial route | `BLOCKED_BY_COMPLIANCE_REVIEW` | `COMPLIANCE_GAP` / P0 | Decide whether to deprecate or separately rearchitect |

## Reconciliation Conclusion

The current repository has substantial certified decision-preparation,
editorial, financial-calculation, seller, buyer, Advisory, and operational
foundations. It does not establish full equivalence to the supplied Master
Modules 6, 7, 8, 10, or 16. The most important unresolved distinction is that
Module 8 is currently best understood as an integration/orchestration layer
over existing products, pending Executive decision on whether a unified Suite
is required.

No item marked partial, foundational, blocked, or decision-required authorizes
implementation in this package.
