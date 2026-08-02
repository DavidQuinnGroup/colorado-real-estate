# REIE DXT Wave 1 Decision Architecture Plan

Program: REIE Decision Experience Transformation (DXT 1.0)
Phase: Wave 1 - Decision Architecture Planning
Status: PLANNING_ONLY_DOCUMENTATION_ONLY
Created: 2026-08-02
Repository baseline verified before planning: 5ee8d6b580644aa0c5646a855ac1bef9c5caaabb
Production deployment status: successful Vercel deployment for the same SHA, target `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/82kkx1AQS8z4kZoN5KGhsLyReQ3a`

## 1. Executive Decision-Architecture Finding

REIE has reached a hard-launched, governed public state, but its customer decision architecture is not yet strong enough to make the product feel like a premium decision platform. The issue is not that the product lacks information. The issue is that customers must still assemble the decision path themselves.

The production experience often answers too many adjacent questions on the same surface. It explains the system, reveals evidence, exposes inventory, shows routes, introduces trust boundaries, and offers multiple continuations before the customer has emotionally and cognitively resolved the current decision.

DXT Wave 1 defines the future architecture around one rule:

**Every page exists to help someone make one better decision.**

The Wave 1 outcome is a decision map, not implementation. It establishes what each surface owns, what it must make the customer feel, understand, and do next, and what content must be simplified, merged, moved lower, progressively disclosed, moved to destination pages, or removed.

## 2. Ideal REIE Decision Journey

The ideal REIE journey is:

1. Invitation
2. Orientation
3. Discovery
4. Comparison
5. Preparation
6. Verification
7. Focused property or place review
8. Advisory conversation
9. Next decision

The journey should feel like guided decision making, not a tour through a repository. Customers may skip stages depending on intent, but every transition should make sense without requiring the user to remember prior context.

The ideal emotional sequence is:

- Arrival: calm curiosity.
- Orientation: confidence that REIE has a useful point of view.
- Discovery: control without overload.
- Comparison: understanding of meaningful tradeoffs.
- Preparation: organized questions rather than pressure.
- Verification: clarity about what requires qualified review.
- Focused review: enough context to decide whether to keep going.
- Advisory: prepared conversation, not generic contact.
- Next decision: a clear continuation path.

## 3. Journey Stages And Surface Ownership

| Stage | Primary Owner | Supporting Surfaces | Notes |
| --- | --- | --- | --- |
| Invitation | Homepage | Global header, footer | Invite the customer to begin, not teach the whole system. |
| Orientation | Homepage, Search intro, Buyer, Seller, Market | Public Trust, Advisory | Explain where the customer is and why the surface matters. |
| Discovery | Search, Map, Market, Neighborhood | Homepage, Navigation | Make discovery feel guided rather than inventory-heavy. |
| Comparison | Search, Property cards, Compare, Market, Neighborhood | Buyer, Seller | Help customers see tradeoffs without scoring or recommending. |
| Preparation | Buyer, Seller, Buyer Financing Planner, Advisory | Property, Market, Neighborhood | Organize assumptions and unresolved questions. |
| Verification | Property, Financing, Advisory, Public Trust | Market, Neighborhood | Distinguish known context from qualified verification needs. |
| Focused property or place review | Property pages, Neighborhood, City market | Search, Map | Keep map/search context available while inspecting details. |
| Advisory conversation | Advisory and Contact | Buyer, Seller, Financing, Property | Convert research into a prepared professional conversation. |
| Next decision | Advisory, Search, Buyer, Seller, Grand Plan | Footer, continuations | Close the loop without starting a new manual. |

Stages may be skipped, but the product must not send customers backward without preserving context. Search, map, and property review need the strongest context retention because they are the highest-friction decision loop.

## 4. Governing Question For Every Major Surface

Each surface has exactly one primary question.

| Surface | Governing Decision Question | Customer Feeling | Customer Understanding | Primary Next Action |
| --- | --- | --- | --- | --- |
| Global header/navigation | Where can I go next without losing the decision thread? | Oriented | The product has a small number of durable paths. | Choose the next major route. |
| Homepage | Why should I begin here? | Invited | REIE helps me start with context, not noise. | Start Search. |
| Search | Which homes deserve my attention? | In control | Inventory can be narrowed through context and criteria. | Refine or inspect a property. |
| Map/property discovery | Where does this option fit in place and context? | Spatially oriented | Map and list are the same decision workspace. | Select or compare a property without losing context. |
| Property | Should I spend more time on this property? | Focused | The property has known facts, open questions, and verification needs. | Continue review, return to Search, or prepare advisory questions. |
| Buyer | Am I prepared to buy? | Organized | Buying requires place, property, financing, timing, and verification readiness. | Continue to Search, Financing, or Advisory. |
| Buyer Financing Planner | Which financing assumptions should I verify? | Grounded | Estimates are educational and user-entered assumptions require professional review. | Prepare lender/professional questions. |
| Seller | What should I prepare before going to market? | Clear | Preparation, pricing context, evidence, and timing should precede request flow. | Prepare for seller advisory review. |
| Home Worth | What information is needed before a meaningful pricing conversation? | Realistic | Pricing conversation needs property facts, context, condition, and timing. | Request or prepare a seller review. |
| Market | What market context should shape my next decision? | Briefed | Market context should frame Search, Buyer, Seller, or Advisory choices. | Continue to Search or a relevant journey. |
| City-market routes | What does this city context change about my next step? | Locally oriented | City context is a lens for discovery, not a prediction. | Explore Search, neighborhoods, or advisory. |
| Neighborhood routes | What should I understand about this place? | Place-aware | Neighborhood context helps compare homes while preserving fair-housing boundaries. | Search this neighborhood or compare broader context. |
| Grand Plan | How does this real-estate decision fit into the life I am building? | Reflective | Real estate is connected to long-term life design and tradeoffs. | Connect decision goals to Search or Advisory. |
| Compare | What tradeoffs matter most between these alternatives? | Decisive | Alternatives can be compared by criteria and verification needs. | Continue with the strongest next review path. |
| Advisory | What should I ask before I decide? | Prepared | I can bring organized questions to a professional conversation. | Contact after preparation. |
| Contact | How do I begin a focused conversation? | Ready | Contact is the beginning of a conversation, not another information page. | Use an existing contact path. |
| Public Trust/disclosures | What are the limits of this information? | Safe | REIE supports preparation and verification, not unsupported conclusions. | Continue with appropriate caution. |
| Footer | What essential routes, trust references, and obligations remain available? | Reassured | Important legal, route, and trust references are accessible but secondary. | Navigate only if needed. |

## 5. One Hero Moment Per Major Surface

A Hero Moment establishes the surface's question, emotional promise, and primary action. It does not define final copy or visual design.

| Surface | Hero Moment Function | Primary Action |
| --- | --- | --- |
| Homepage | Invite the customer into REIE with one promise: begin with context before clicks. | Start Search. |
| Search | Establish Search as a guided decision workspace, not a raw inventory wall. | Refine or inspect. |
| Map/property discovery | Show that map and list are one persistent place-and-property workspace. | Select property while retaining context. |
| Property | Turn a listing into a focused decision brief. | Decide whether to continue review. |
| Buyer | Help the buyer answer whether they are prepared to move seriously. | Choose Search, Financing, or Advisory. |
| Buyer Financing | Organize assumptions and verification questions. | Prepare professional questions. |
| Seller | Clarify what should be prepared before going to market. | Prepare seller review. |
| Home Worth | Explain that pricing conversation needs context before estimate-seeking. | Prepare/request pricing conversation. |
| Market | Brief the customer on market context before the next property or strategy decision. | Continue to Search or journey. |
| City market | Translate city context into the next useful discovery path. | Explore market-aware Search. |
| Neighborhood | Orient the customer to place context without steering. | Search or compare. |
| Grand Plan | Connect the real-estate choice to the customer's broader life decision. | Identify next decision priority. |
| Compare | Focus attention on tradeoffs that matter. | Continue strongest option review. |
| Advisory | Convert research into prepared professional questions. | Contact after preparation. |
| Contact | Make beginning the conversation simple and focused. | Use current contact method. |
| Public Trust | State the product boundary at the moment trust is needed. | Continue with verification awareness. |
| Footer | Provide secondary route, legal, and trust continuity. | Navigate if necessary. |

No major page should present more than one equally weighted Hero Moment. If a page currently opens with multiple equal questions, that is decision-architecture friction.

## 6. Decision Friction Model

Decision Friction is any moment where the customer must work harder than necessary to feel, understand, or act.

Friction categories:

- Hesitation: the next action is unclear.
- Fragmentation: attention splits across too many routes, CTAs, panels, labels, or concepts.
- Flat hierarchy: headings, labels, body copy, metadata, and links feel visually equivalent.
- Density: content prevents scanning or creates scroll fatigue.
- Competing CTAs: multiple actions appear equally important.
- Internal language: repository, governance, evidence, status, or implementation language replaces customer language.
- Dominant disclosure: trust or compliance language leads the emotional experience instead of supporting it.
- Lost context: the user loses map, Search, property, journey, or prior decision state.
- Memory burden: the customer must remember information from a previous page.
- Documentation feel: the page reads like a report, manual, or internal status output.

Severity:

- CRITICAL: blocks broad adoption or damages the central decision path.
- HIGH: materially increases cognitive load or weakens trust/usability.
- MODERATE: creates friction but does not block the journey.
- LOW: polish-level issue for later waves.

Primary effect:

- TRUST
- USABILITY
- COMPREHENSION
- ORIENTATION
- CONTINUITY
- DELIGHT

## 7. Ranked Friction Inventory

| Rank | Friction | Severity | Primary Effect | Surfaces | Planning Disposition |
| --- | --- | --- | --- | --- | --- |
| 1 | Search starts as large inventory rather than guided workspace. | CRITICAL | USABILITY | Search, map, property discovery | First implementation program. |
| 2 | Clicking into a listing removes map/search context from the customer's mental model. | CRITICAL | CONTINUITY | Search, property | Search/property workspace planning. |
| 3 | Search popup or preview interaction disappears before the customer can act. | CRITICAL | USABILITY | Search map/list | Define persistent selected-property state. |
| 4 | Map style and perceived behavior change across zoom levels. | HIGH | ORIENTATION | Search map | Define consistent map experience expectations. |
| 5 | Homepage becomes manual-like below hero. | HIGH | DELIGHT | Homepage | Simplify post-hero sequence. |
| 6 | Buyer page is long, repetitive, and hard to navigate. | HIGH | COMPREHENSION | Buyer, financing | Simplify and consolidate. |
| 7 | Financing content is duplicated and visually undifferentiated. | HIGH | COMPREHENSION | Buyer, financing | Consolidate into planner/destination/progressive path. |
| 8 | Market reads like internal governance/report output. | HIGH | COMPREHENSION | Market, city routes | Translate into customer briefing. |
| 9 | Topic headings, labels, links, and body copy lack enough role separation. | HIGH | ORIENTATION | All major surfaces | Define hierarchy standard. |
| 10 | Customers cannot intuitively understand where they are, have been, or should go next. | HIGH | CONTINUITY | Navigation, Search, Buyer, Market, Property | Define journey state and continuation model. |
| 11 | Seller page lacks strong progressive hierarchy. | MODERATE | USABILITY | Seller, Home Worth | Define seller preparation sequence. |
| 12 | Neighborhood pages are evidence-rich but emotionally thin. | MODERATE | DELIGHT | Neighborhood | Sequence place orientation before evidence. |
| 13 | Global headers do not yet feel like one premium product system. | MODERATE | ORIENTATION | Header, mobile nav | Assess independently from disclosure hold. |
| 14 | Footer and lower-page trust content risk exposing internal production/governance language. | MODERATE | TRUST | Footer, Public Trust | Move internal language away from customer path. |
| 15 | Brokerage disclosure is visually dominant. | MODERATE | DELIGHT | Global top of page | EXTERNAL_REVIEW_HOLD. |

## 8. Section Disposition Inventory

Disposition options: KEEP, SIMPLIFY, MERGE, MOVE LOWER, PROGRESSIVELY DISCLOSE, MOVE TO DESTINATION PAGE, REMOVE, EXTERNAL_REVIEW_HOLD.

| Surface | Section/Pattern | Disposition | Reason |
| --- | --- | --- | --- |
| Global | Brokerage disclosure treatment | EXTERNAL_REVIEW_HOLD | External Compass Marketing review pending; do not change. |
| Global | Brand/navigation row | SIMPLIFY | Must orient, but needs stronger consistency later. |
| Homepage | Hero invitation | KEEP | Directly supports first decision. |
| Homepage | Multiple journey clusters below hero | MERGE | Useful individually, excessive together. |
| Homepage | Long platform explanation | MOVE TO DESTINATION PAGE | Invitation should not become manual. |
| Homepage | Search orientation | SIMPLIFY | Supports primary action. |
| Homepage | Market/Grand Plan/advisory teasers | MOVE LOWER | Useful after Search invitation is established. |
| Search | Map/list toggle | KEEP | Central workspace control. |
| Search | Full criteria controls | PROGRESSIVELY DISCLOSE | Too much before intent is established. |
| Search | Search summary/status panels | SIMPLIFY | Should orient, not crowd. |
| Search | Property result inventory | SIMPLIFY | Needs decision-card hierarchy. |
| Search | Saved/search/share lower controls | MOVE LOWER | Not first-decision-critical. |
| Map | Hover-only/popup behavior | PROGRESSIVELY DISCLOSE | Needs persistent selected state, no implementation now. |
| Property | Price/address/facts | KEEP | Customer needs immediate facts. |
| Property | Decision orientation | KEEP | Should frame the page earlier and more clearly. |
| Property | Dense evidence detail | PROGRESSIVELY DISCLOSE | Verification depth should follow orientation. |
| Property | Search return path | KEEP | Continuity is critical. |
| Buyer | Hero purpose | SIMPLIFY | Must answer preparedness. |
| Buyer | Orientation/compare/verify/decide sequence | MERGE | Strong model, but currently too long. |
| Buyer | Financing education duplication | MERGE | Should point to planner or focused section. |
| Buyer | Long educational blocks | PROGRESSIVELY DISCLOSE | Keep depth after intent. |
| Buyer Financing | Core planner | KEEP | Decision-support value is clear. |
| Buyer Financing | Disclosure reminders | SIMPLIFY | Required but should stay adjacent. |
| Seller | Seller hero | SIMPLIFY | Must establish preparation. |
| Seller | Preparation/pricing/property review/request | SIMPLIFY | Needs clearer staged flow. |
| Home Worth | Pricing request explanation | SIMPLIFY | Needs context-before-estimate framing. |
| Market | Hero/report-style opening | SIMPLIFY | Should become briefing-first. |
| Market | Internal evidence/governance terms | MOVE LOWER | Translate or move lower. |
| Market | City/neighborhood route discovery | SIMPLIFY | Needs scannable discovery path. |
| Neighborhood | Place orientation | KEEP | Must create practical understanding first. |
| Neighborhood | Evidence and limitations | MOVE LOWER | Necessary but should follow place orientation. |
| Neighborhood | Lifestyle-neutral context | KEEP | Valuable if fair-housing safe. |
| Grand Plan | Life decision framing | KEEP | Differentiating long-range REIE path. |
| Compare | Tradeoff model | SIMPLIFY | Needs stronger primary question. |
| Advisory | Preparation before contact | KEEP | Recently productized; aligns with DXT. |
| Contact | Contact methods | SIMPLIFY | Should begin conversation, not become another content page. |
| Public Trust | Required boundaries | KEEP | Trust-safe and necessary. |
| Public Trust | Dense early explanations | MOVE LOWER | Support trust without dominating. |
| Footer | Legal/trust obligations | KEEP | Required access. |
| Footer | Duplicative governance/status language | SIMPLIFY | Should not distract customers. |

## 9. Homepage Architecture

Governing question: Why should I begin here?

Desired feeling: invited, curious, calm.

Desired understanding: REIE helps the customer begin with context rather than noise.

Primary action: Start Search.

Future architecture:

1. Protected brokerage disclosure remains unchanged during external review.
2. Product invitation Hero Moment.
3. One primary Search action.
4. Minimal orientation: REIE helps with Search, context, preparation, and advisory.
5. One compressed path selector only if it clarifies the start, not as a directory.
6. Trust boundary in brief support position.
7. Lower-page continuations to Buyer, Seller, Market, Grand Plan, and Advisory.
8. Destination-page links for deeper platform explanations.

Current friction:

- Dense post-hero clusters make the page feel like a manual.
- Multiple paths compete before the customer has begun.
- Depth appears too soon.

Disposition:

- Keep the invitation.
- Simplify journey clusters.
- Move platform explanation to destination pages.
- Move secondary continuations lower.
- Preserve brokerage disclosure under external-review hold.

## 10. Search Architecture

Governing question: Which homes deserve my attention?

Desired feeling: in control, not overwhelmed.

Desired understanding: Search is a persistent decision workspace where list, map, criteria, and property preview stay connected.

Primary action: refine or inspect a property.

Future architecture:

1. Protected disclosure/header state.
2. Search Hero Moment: what inventory is being explored and what decision the customer is making.
3. Persistent list/map workspace model.
4. Criteria visible in a compact summary first, full controls progressively disclosed.
5. Selected-property state persists until replaced or dismissed.
6. Property preview supports action before full navigation.
7. Map and list remain conceptually synchronized.
8. Property review should preserve a clear return path to the same discovery context.

Required planning topics:

- Map persistence.
- List/map continuity.
- Property-selection behavior.
- Click versus hover behavior.
- Selected-property state.
- Property preview interaction.
- Retaining map while reviewing a property.
- Criteria visibility.
- Consistent map style expectations across zoom levels.
- Reduced cognitive load.

Non-goals:

- No Search algorithm change.
- No map provider change.
- No saved search expansion.
- No telemetry, personalization, CRM, or persistence.

## 11. Property Architecture

Governing question: Should I spend more time on this property?

Desired feeling: focused.

Desired understanding: This property has facts, context, unknowns, and verification needs.

Primary action: continue review, return to Search, or prepare advisory questions.

Future architecture:

1. Property Hero Moment with address, price, facts, and decision question.
2. First-screen decision brief: why this may or may not deserve more time, stated as prompts not conclusions.
3. Context links to market, neighborhood, financing assumptions, and advisory.
4. Verification questions before exhaustive data detail.
5. Dense facts and evidence progressively disclosed.
6. Persistent return-to-Search context where feasible and separately authorized.

Non-goals:

- No valuation conclusion.
- No suitability claim.
- No investment recommendation.
- No automatic advice.

## 12. Buyer Architecture

Governing question: Am I prepared to buy?

Desired feeling: organized.

Desired understanding: Buying requires readiness across search, place, property, financing assumptions, timing, and verification.

Primary action: choose Search, Financing, or Advisory based on the customer's readiness gap.

Future architecture:

1. Buyer Hero Moment framed around preparedness.
2. Short readiness sequence: place, property, financing, timing, verification.
3. Financing presented once as a path into the Buyer Financing Planner, not duplicated explanation.
4. Education progressively disclosed after the customer chooses a readiness topic.
5. Advisory transition as prepared conversation.

Disposition:

- Simplify manual-like sections.
- Merge duplicated financing information.
- Move deeper education to progressive sections or destination pages.

## 13. Seller Architecture

Governing question: What should I prepare before going to market?

Desired feeling: clear and deliberate.

Desired understanding: Seller readiness includes preparation, pricing context, property review, buyer objections, timing, and conversation readiness.

Primary action: prepare for seller advisory review.

Future architecture:

1. Seller Hero Moment around preparation before exposure.
2. Staged seller model: prepare, price context, property review, request conversation.
3. Home Worth relationship clarified: Home Worth collects/frames pricing conversation needs; Seller explains readiness.
4. Request flow appears after the value of preparation is clear.
5. Avoid overwhelming users before they understand why information matters.

## 14. Home Worth Architecture

Governing question: What information is needed before a meaningful pricing conversation?

Desired feeling: realistic.

Desired understanding: A pricing conversation requires property facts, condition, timing, market context, and professional review.

Primary action: prepare/request a seller pricing conversation.

Future architecture:

1. Pricing conversation Hero Moment.
2. Explain inputs needed for meaningful review.
3. Avoid instant valuation certainty.
4. Connect to Seller readiness and Advisory/Contact.
5. Keep request path simple and non-overwhelming.

## 15. Market Architecture

Governing question: What market context should shape my next decision?

Desired feeling: briefed.

Desired understanding: Market context frames the next Search, Buyer, Seller, or Advisory step; it does not predict outcomes.

Primary action: continue to Search or the relevant journey.

Future architecture:

1. Market Hero Moment as customer briefing.
2. First answer: what context matters now?
3. Visual/scannable market path and route discovery.
4. City and neighborhood discovery begin from customer questions.
5. Internal terms translated or moved out of the initial view.
6. Evidence and limitation language appears after the customer understands the briefing.

Remove or move from initial customer view:

- Evidence state.
- Governed snapshot.
- Certification state.
- Implementation posture.
- Internal route/source terms.

## 16. Neighborhood Architecture

Governing question: What should I understand about this place?

Desired feeling: place-aware without being steered.

Desired understanding: Neighborhood context helps compare homes through practical, lifestyle-neutral factors and verification boundaries.

Primary action: search this neighborhood or compare broader market context.

Future architecture:

1. Neighborhood Hero Moment around place orientation.
2. Practical orientation before evidence: location pattern, access context, housing pattern, verification needs.
3. Fair-housing-safe language and no desirability claims.
4. Evidence and limitations after orientation.
5. Property availability and market context as continuation, not first burden.

## 17. Grand Plan Architecture

Governing question: How does this real-estate decision fit into the life I am building?

Desired feeling: reflective and grounded.

Desired understanding: Real estate is one part of a larger life-design and decision-priority system.

Primary action: identify the next decision priority and continue to Search, Buyer/Seller, or Advisory.

Future architecture:

1. Grand Plan Hero Moment as life-context orientation.
2. Fewer abstract explanations, more decision prompts.
3. Connect to Search, financing readiness, seller readiness, and advisory only where relevant.
4. Preserve no-advice and no-guarantee boundaries.

## 18. Compare Architecture

Governing question: What tradeoffs matter most between these alternatives?

Desired feeling: decisive.

Desired understanding: Alternatives should be compared by criteria, context, uncertainty, and verification needs.

Primary action: continue the strongest next review path.

Future architecture:

1. Compare Hero Moment focused on tradeoffs.
2. Use prompt-based comparison, not scoring.
3. Preserve no recommendation, no ranking, no suitability conclusion.
4. Connect back to Search/property review and advisory.

## 19. Advisory Architecture

Governing question: What should I ask before I decide?

Desired feeling: prepared and calm.

Desired understanding: Advisory converts REIE research into a professional conversation and identifies what requires verification.

Primary action: contact after preparation.

Future architecture:

1. Keep preparation-before-contact model.
2. Reduce visual dominance of boundary language while preserving substance.
3. Keep static journey topics, prompt-only questions, privacy expectations, and professional boundaries.
4. Avoid turning Advisory into CRM intake, scheduling, lead scoring, or automated advice.

## 20. Contact Architecture

Governing question: How do I begin a focused conversation?

Desired feeling: ready.

Desired understanding: Contact is the beginning of a conversation; it should not feel like another information page.

Primary action: use an existing contact path.

Future architecture:

1. Contact Hero Moment focused on beginning.
2. Minimal preparation reminder.
3. Current contact methods remain unchanged unless separately authorized.
4. No new forms, backend changes, scheduling, CRM, persistence, or automation.

## 21. Global Header And Navigation Architecture

Governing question: Where can I go next without losing the decision thread?

Findings:

- Navigation is functional but does not yet feel like one premium product system.
- Active-state, spacing, route hierarchy, and CTA hierarchy should be assessed separately from the protected brokerage disclosure.
- Navigation should reinforce the decision model: Search as dominant discovery, Buyer/Seller as preparation, Market/Neighborhood as context, Advisory/Contact as conversation.

Protected hold:

The brokerage disclosure treatment is protected as `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`. No recommendation in this plan authorizes removal, shortening, relocation, restyling, wording change, footer move, route change, or Compass requirement inference.

## 22. Footer Architecture

Governing question: What essential routes, trust references, and obligations remain available?

Findings:

- Footer should remain secondary, stable, and trust-supporting.
- Legal, brokerage, route, sitemap, and public trust obligations should remain available.
- Dense governance or production-status language should not compete with primary customer decisions.
- Any brokerage-disclosure placement question remains under external review.

Disposition:

- Keep required legal/trust access.
- Simplify duplication where allowed by later authorization.
- Move internal production/governance references away from customer-facing priority positions where feasible and authorized.

## 23. Information Hierarchy Standard

Wave 1 defines hierarchy functions, not fonts, sizes, colors, CSS tokens, or final visual design.

Required roles:

1. Page-level decision question: the single thing this surface helps answer.
2. Hero Moment: emotional promise plus primary action.
3. Directional heading: tells the customer where they are in the journey.
4. Supporting heading: names a subdecision or context area.
5. Body copy: explains only what is needed to continue.
6. Disclosure: supports trust at the relevant moment without becoming the page's emotional center.
7. Action label: names the next step in customer language.
8. Status or evidence metadata: available when useful, visually subordinate, and never confused with the main decision.

Current problem:

Headings, links, labels, directional phrases, metadata, and body copy often compete. Future implementation must create stronger relative emphasis so the customer can scan by role.

## 24. Progressive Disclosure Model

Immediate:

- Page decision question.
- Emotional promise.
- One primary action.
- Minimal orientation and required protected disclosures.

After user intent is established:

- Criteria, comparison, evidence categories, financing assumptions, seller readiness topics, market details, neighborhood details, and advisory preparation topics.

After interaction:

- Expanded filters.
- Selected property details.
- Map/list contextual overlays.
- Detailed verification prompts.
- Long-form evidence and source limitations.

Moved to destination pages where appropriate:

- Platform explanation.
- Extended REIE difference content.
- Deep buyer/seller education.
- Detailed market or neighborhood methodology.
- Disclosure libraries or trust references, where permitted.

Available but not dominant:

- Brokerage disclosure remains protected in current form during external review.
- Professional boundaries.
- Fair-housing and source-rights limitations.
- Public Trust references.

## 25. Mobile Decision Architecture

Mobile must be designed independently, not compressed from desktop.

Global mobile rules:

- One first-screen question.
- One first-screen action.
- Maximum two visible action choices in a major viewport.
- Single-column progression.
- Progressive disclosure for filters, long explanations, evidence detail, and route clusters.
- Back/forward must preserve perceived journey continuity.
- Touch actions must be stable and obvious.
- Avoid dense card walls, report-like copy, and internal metadata in first view.

Surface expectations:

| Surface | First-screen Question | First-screen Action | Mobile Disposition |
| --- | --- | --- | --- |
| Homepage | Why should I begin here? | Start Search. | Keep invitation; defer manual-like content. |
| Search | Which homes deserve attention? | Refine or inspect. | Compact criteria; persistent map/list state. |
| Map | Where does this option fit? | Select property. | Persistent selected state; no disappearing popup. |
| Property | Should I spend more time here? | Continue review or return. | Decision brief before dense facts. |
| Buyer | Am I prepared? | Choose readiness path. | Short staged model; financing consolidated. |
| Financing | Which assumptions need verification? | Review assumptions/questions. | Keep planner linear and bounded. |
| Seller | What should I prepare? | Prepare review. | Progressive seller stages. |
| Home Worth | What is needed for pricing conversation? | Prepare/request review. | Avoid instant-estimate framing. |
| Market | What context matters now? | Continue to Search/journey. | Briefing before route lists. |
| Neighborhood | What should I understand here? | Search/compare. | Place orientation before evidence. |
| Grand Plan | How does this fit my life? | Identify next priority. | Prompt-based, not essay-first. |
| Compare | What tradeoffs matter? | Continue review. | One comparison focus at a time. |
| Advisory | What should I ask? | Contact after preparation. | Preparation before contact, concise boundaries. |
| Contact | How do I begin? | Use contact path. | Contact methods without information wall. |

## 26. Destination-Page Recommendations

Destination pages are useful after the primary decision architecture is clarified. They should not become a dumping ground for excess content.

Recommended future destination candidates:

- REIE difference / why REIE.
- Buyer education depth.
- Seller preparation depth.
- Financing readiness explanation beyond the planner.
- Market methodology and limitations.
- Neighborhood methodology and fair-housing-safe orientation.
- Public Trust and disclosures, subject to brokerage review constraints.

Do not extract destinations before Search/property decision flow is planned. New routes remain unauthorized.

## 27. Protected Boundaries

Wave 1 planning does not authorize:

- runtime code changes;
- CSS changes;
- route changes;
- component changes;
- navigation changes;
- footer changes;
- brokerage disclosure changes;
- Search behavior changes;
- map behavior changes;
- property behavior changes;
- API changes;
- Prisma changes;
- persistence;
- CRM;
- telemetry;
- providers;
- deployment configuration changes;
- production-data mutation;
- external publication;
- DXT Wave 2, Wave 3, or Wave 4 implementation.

Brokerage disclosure is specifically recorded as:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## 28. Proposed Implementation Waves

The following sequence is evaluated for future authorization only:

### DXT Wave 1A - Homepage Invitation And Global Hierarchy

Objective: turn the homepage into a focused invitation and define global hierarchy rules without changing protected brokerage disclosure.

Risk: medium.

### DXT Wave 1B - Search And Property Persistent Decision Workspace

Objective: redesign Search, map/list continuity, selected-property state, property preview, and property handoff around decision context.

Risk: high.

### DXT Wave 1C - Buyer And Seller Journey Simplification

Objective: simplify Buyer and Seller into clear readiness journeys and consolidate duplicated financing content.

Risk: medium.

### DXT Wave 1D - Market And Neighborhood Discovery Architecture

Objective: transform Market and Neighborhood from report/evidence feel into customer briefings and place orientation.

Risk: medium.

### DXT Wave 1E - Advisory, Contact, Grand Plan, Compare, And Destination Extraction

Objective: refine terminal and supporting decision surfaces after upstream flow is stabilized.

Risk: medium.

## 29. Recommended First Bounded Implementation Program

Recommended first program:

`REIE_DXT_WAVE_1B_SEARCH_AND_PROPERTY_PERSISTENT_DECISION_WORKSPACE`

Why this outranks Wave 1A:

Homepage friction is real, but Search and property discovery are the core public value path and the largest customer-experience gap. The production UX assessment identified Search, map interaction, and property pages as the top P0 issues. Fixing the homepage first would improve invitation, but it would still send customers into the highest-friction workspace.

Why this must be bounded:

Search, map, property cards, and property page continuity are interactive and high-risk. The implementation should be planned separately and should not bundle Buyer/Seller, Market/Neighborhood, Advisory, Contact, or site-wide visual language into one authorization.

Likely future scope, if separately authorized:

- Search first-screen decision hierarchy.
- Compact criteria summary and progressive filters.
- Persistent list/map state model.
- Persistent selected-property state.
- Property preview interaction.
- Property-card decision hierarchy.
- Property page Search-return context.
- Mobile Search/map/property interaction model.
- Deterministic checks for prohibited recommendations, persistence, telemetry, and route/provider boundaries.

## 30. Acceptance And Certification Requirements

Future implementation must prove:

- one governing question per changed surface;
- one Hero Moment per changed surface;
- brokerage disclosure unchanged unless external guidance authorizes otherwise;
- Search remains accessible and healthy;
- map remains healthy;
- property routes remain healthy;
- no Search ranking or provider behavior changes unless separately authorized;
- no telemetry, CRM, personalization, persistence, or hidden context transfer;
- no valuation certainty, suitability, affordability, qualification, recommendation, steering, or protected-class proxy;
- mobile flow has no horizontal overflow, critical overlap, or clipped decision content;
- keyboard and screen-reader paths remain usable;
- Back/Forward behavior is coherent;
- source-rights and evidence boundaries remain intact;
- typecheck, lint, build, focused deterministic checks, route smoke, Search/map smoke, property-route safety, public trust, fair-housing review, and production certification pass under separate authorization.

## 31. Open Questions

1. What guidance will Compass Marketing provide for top-of-page brokerage disclosure treatment?
2. Should Search retain current route structure while changing interaction model, or will future planning require a route-level workspace concept?
3. What is the acceptable non-persistent mechanism for returning from property to the same perceived Search context?
4. Should property preview become a panel, drawer, inline state, or other bounded interaction during future implementation planning?
5. Which internal market/evidence labels must remain publicly visible for trust, and which can move to lower sections or destination pages?
6. Which destination pages are worth creating after the Search/property architecture is stabilized?

## 32. Exact Next Authorization Gate

`READY_FOR_REIE_DXT_WAVE_1B_SEARCH_AND_PROPERTY_PERSISTENT_DECISION_WORKSPACE_PRODUCT_SPECIFICATION`

This gate should authorize product specification and interaction model only unless explicitly expanded. It must not authorize implementation, runtime changes, brokerage disclosure changes, Search behavior changes, map behavior changes, property behavior changes, APIs, Prisma, telemetry, CRM, persistence, providers, route creation, deployment changes, or production certification.

## Planning Outcome

Status: `REIE_DXT_WAVE_1_DECISION_ARCHITECTURE_READY`
