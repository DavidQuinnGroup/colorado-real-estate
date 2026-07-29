# Boulder County Open Data Activation Gate 1

Status: `BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_1_COMPLETE`

Date: 2026-07-29

This is a documentation and readiness gate only. It is not legal advice, does not issue final legal conclusions, and does not authorize provider activation, acquisition, scraping, persistence, schema changes, Prisma changes, API changes, public GIS, customer-facing dataset display, or production runtime changes.

## Executive Outcome

Boulder County Open Data remains the strongest first external-source candidate for REIE city intelligence because the county publishes an official open-data catalog, identifies public datasets such as parcels, zoning, property information, open space, and trails, and states a broad open-data license posture unless noted otherwise. Dataset-level metadata still creates real activation gates: custom item licenses, address/account field sensitivity, deprecated/static records, and hazard-adjacent public-safety data.

## Official Source Basis

- Boulder County Open Data page: `https://bouldercounty.gov/government/open-data/`
- Boulder County Open Data definition: `https://bouldercounty.gov/government/open-data/definition/`
- Boulder County Open Data terms page: `https://bouldercounty.gov/government/open-data/open-data-terms-of-use/`
- Boulder County ArcGIS Hub dataset API: `https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items`

## Recommendation

Proceed only to provider/counsel review for a two-dataset first activation boundary:

1. `BCOD-ADDRESS-POINTS`
2. `BCOD-PARK-BOUNDARIES`

No activation should occur until provider confirmation and counsel approval resolve storage, transformation, aggregation, attribution, field exclusions, rate limits, retention, public copy, and disclaimers.

## Hard Gates

- Provider confirmation required.
- Counsel review required.
- Future additive persistence migration required.
- No use of existing market-data persistence as the durable external-source evidence store.
- No public GIS or map-layer activation.
- No customer-visible parcel, owner, account, address, hazard, or property-specific derived scoring.
