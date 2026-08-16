# PROJECT ATLAS - Weld County Assessor Source Quality Evidence MVV Certification

Date: 2026-08-16

## Scope

This certification records a source-specific Source Quality evidence MVV for `SRC-WELD-COUNTY-ASSESSOR`.

The MVV is certification-reference only. It does not ingest, download, request, scrape, transform, display, or activate Weld County Assessor data.

## Source Binding

- Source ID: `SRC-WELD-COUNTY-ASSESSOR`
- Source class: `COUNTY_ASSESSOR`
- Source confirmation: `EXACT_SOURCE_ID_CONFIRMED`
- Evidence reference: `SQE-WELD-COUNTY-ASSESSOR-CERT-001`
- Certification ID: `CERT-WELD-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001`
- Field sensitivity posture: `RESTRICTED_OR_UNREVIEWED`
- Manifest eligibility posture: `READY_WITH_KNOWN_GAPS`

## Evidence Posture

The evidence package intentionally preserves unknown or incomplete posture for:

- Rights
- Technical access
- Freshness
- Attribution
- Provenance
- Fee posture

The package permits deterministic Source Quality conversion and assembly with known gaps only. It does not grant source activation, customer display, claim use, legal use, public-search automation, or data reuse authority.

## Weld Semantic Firewalls

- Historical Property Card material is not current assessor evidence.
- Data Download availability is not rights, reuse, automation, or display authority.
- Property Map or GIS channels do not certify parcel authority, title, or legal status.
- Sales Explorer and assessment channels do not certify market value or appraisal truth.
- Weld County Assessor evidence cannot inherit Boulder, Arapahoe, Broomfield, Jefferson, or Larimer source findings.
- Raw county property data is not accepted by this evidence package.
- Assessor records are not title, deed validity, treasurer tax status, parcel GIS, permits, recorder, or current-ownership guarantees.

## Validation

Direct checker:

```bash
./node_modules/.bin/jiti scripts/checkSourceQualityWeldCountyAssessorEvidence.ts
```

Required package regression checks:

```bash
./node_modules/.bin/jiti scripts/checkSourceQualityPublicRecordEvidenceConversionContract.ts
./node_modules/.bin/jiti scripts/checkSourceQualityCountyEvidenceConversionContract.ts
./node_modules/.bin/jiti scripts/checkSourceQualityOperationalManifest.ts
npm run check:reie-source-registry-grand-plan-advancement
npm run typecheck
git diff --check
```

## Protected-System Confirmation

This MVV does not perform provider calls, ArcGIS/API calls, Data Download access, Property Card access, Property Map access, Sales Explorer access, property search, CORA, database writes, schema changes, Typesense/Search mutation, queues/workers, email/CRM, deployment, or production configuration.
