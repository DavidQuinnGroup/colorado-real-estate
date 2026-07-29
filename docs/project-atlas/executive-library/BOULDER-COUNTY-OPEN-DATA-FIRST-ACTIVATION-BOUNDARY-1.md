# Boulder County Open Data First Activation Boundary 1

This boundary is a planning gate only. No activation is authorized.

## Recommended First Boundary

| Dataset | Reason |
| --- | --- |
| `BCOD-ADDRESS-POINTS` | Strongest normalization and city-context utility, but only if sensitive fields are excluded or counsel-approved. |
| `BCOD-PARK-BOUNDARIES` | Strong community-context value with low privacy sensitivity, but custom license/disclaimer review is required. |

Maximum initial datasets: 2.

## Explicitly Not Included

- Emergency Alert Flood Polygons: high sensitivity; no hazard/safety activation.
- Boulder Area Trailheads: deprecated/static.
- Trail Segments Dissolved: defer until field/export/closure relationship is confirmed.
- Traffic Stations: defer until product language avoids commute, safety, noise, and ranking claims.

## Exit Criteria Before Any Future Activation

- Provider confirmation answers all required questions.
- Counsel approves license hierarchy, storage, transformation, aggregation, attribution, field exclusions, and display language.
- Additive evidence persistence migration is separately authorized.
- No-write acquisition adapter is separately authorized and validated.
- Public copy/disclaimer review is complete.

## Prohibited Runtime Effects

Provider execution, scheduled acquisition, database writes, Prisma/schema changes, customer-facing dataset display, public GIS, search indexing, AI interpretation, and property-level scoring remain not authorized.
