# REIE Arapahoe County Treasurer Conversion Acceptance MVV Certification

Certification ID: `CERT-ARAPAHOE-COUNTY-TREASURER-CONVERSION-ACCEPTANCE-001`

## Exact Mapping

`SRC-ARAPAHOE-COUNTY-TREASURER` maps to the existing finite conversion class `COUNTY_TREASURER`.

This is an exact-source acceptance only. It does not introduce wildcard County Treasurer acceptance, provider aliases, EXP/SRA aliases, payment aliases, extract aliases, Certificate of Taxes Due aliases, lien aliases, Public Trustee aliases, Assessor aliases, Recorder aliases, GIS aliases, or generic county Treasurer trust.

## Conversion Boundary

The Public Record conversion core and County specialization require:

- exact source ID
- exact `COUNTY_TREASURER` class
- `EXACT_SOURCE_ID_CONFIRMED`
- controlled certification reference
- structured evidence references only

The conversion path does not authorize Tax Search automation, payment, extract download, certificate purchase or use, lien operations, retrieval, customer display, redistribution, legal use, database writes, Search/Typesense mutation, or runtime activation.

## Stability

Boulder County Treasurer remains accepted through its existing exact source ID and class. Arapahoe County Assessor remains separately accepted as `COUNTY_ASSESSOR`. No Boulder Treasurer or Arapahoe Assessor rights, access, freshness, attribution, fee, or provenance posture is inherited by Arapahoe County Treasurer.
