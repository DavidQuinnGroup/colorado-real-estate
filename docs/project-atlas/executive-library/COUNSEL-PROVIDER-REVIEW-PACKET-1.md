# Counsel and Provider Review Packet(tm) 1.0

Status: `COUNSEL_PROVIDER_REVIEW_PACKET_CREATED`

Date: July 29, 2026

## Proposed REIE Use Case

REIE seeks to store and transform selected official source data into non-predictive, city-level real estate decision intelligence. The first intended public use is educational city-level context, not individual-owner intelligence, legal advice, investment advice, valuation, or property-condition conclusions.

## Exact Source Fields Requested

Initial field requests should be limited to:

- Source identity and dataset name
- Geographic subject
- Observation date and effective date
- Parcel or city-level geography where permitted
- Property/housing type category where permitted
- Permit type/category where permitted
- Plan/project name and status where permitted
- Freshness and supersession metadata
- Public-display eligibility
- Attribution text

## Internal Use

Internal use would support evidence completeness, deduplication, conflict review, editorial certification, and future guide-readiness review.

## Derived Intelligence Use

Derived use would be aggregate, non-predictive, and city-level. It would not expose private owner details or individual property conclusions.

## Public Display Use

Public display would show only approved, attributed, city-level observations after source rights, Fair Housing review, editorial review, and freshness review.

## Storage Duration

Storage duration is unresolved. Counsel/provider confirmation is required before durable persistence.

## Attribution Model

Attribution should include source entity, dataset/record name, observation or access date, license or terms statement, and limitation language.

## Redistribution Behavior

REIE should not redistribute raw datasets or downloaded documents. Public output should be limited to approved derived observations.

## Automated Retrieval Frequency

Automated retrieval frequency is not authorized. Future frequency should be source-specific and respect terms, rate limits, freshness, and operational need.

## Privacy and Fair Housing Controls

Controls include no demographic targeting, no protected-class suitability, no school or safety ranking, no crime scoring, no owner-level customer display, no forecasts, no investment recommendations, and no customer-facing partial evidence.

## Questions Requiring Written Approval

1. Can REIE store selected source fields for internal evidence review?
2. Can REIE transform source fields into aggregate city-level observations?
3. Can REIE display derived observations publicly with attribution?
4. Are there source-specific retention or deletion obligations?
5. Are there rate limits or automation restrictions?
6. Are there prohibited fields that must not be stored or displayed?
7. What attribution text is required?
8. Are fees, credentials, contracts, or account terms required?

## Recommended Decision

Recommended decisions are source-specific and remain preliminary:

- Boulder County Open Data: `APPROVE_WITH_CONDITIONS`
- City of Boulder permit/open-data exports: `PROVIDER_CONFIRMATION_REQUIRED`
- Boulder County Assessor: `LEGAL_REVIEW_REQUIRED`
- Boulder County Accela: `PROVIDER_CONFIRMATION_REQUIRED`
- Boulder County Recorder: `LEGAL_REVIEW_REQUIRED`
- Municipal planning records: `PROVIDER_CONFIRMATION_REQUIRED`
- DQG-owned imagery: `APPROVE_WITH_CONDITIONS`
- Licensed imagery: `PROVIDER_CONFIRMATION_REQUIRED`
- Existing MLS-derived city intelligence: `APPROVE`

This packet is not legal advice and does not issue final legal conclusions.
