# Boulder County Open Data Dataset Inventory 1

This inventory is based on repository review and official Boulder County Open Data / ArcGIS Hub records. It is provider-confirmation material only and is not legal advice. No activation, acquisition, persistence, or runtime use is authorized.

| Priority | Dataset | Catalog item | Source / status | Initial value | Gate |
| --- | --- | --- | --- | --- | --- |
| 1 | Address Points | `687530b74ad54686a98f50337574596f` | Boulder County Assessor GIS; `public_authoritative`; CC-BY-4.0 record | Address/city normalization and aggregate local context | High field-sensitivity review for full address, parcel, account, and tax district fields |
| 2 | Boulder County Parks and Open Space Park Boundaries | `ffbeca86d075420cafc960bba6e5d4e8` | Parks and Open Space; `public_authoritative`; custom license/disclaimer | Community/open-space context | Custom-license and approximate-boundary disclaimer review |
| 3 | Boulder County Open Space | `0ff5754576af44cbb0fddaf1995b767a` | Parks and Open Space; CC-BY-4.0 record | Protected-land context | Easement/ownership label and partner-name review |
| 4 | Traffic Stations | `aeb2b2385dec4ffea0320318e3f2248a` | Public Works; `public_authoritative`; CC-BY-4.0 record | Road/bike-count research prompts | Avoid commute, noise, safety, ranking, or predictive claims |
| 5 | BCPOS Trail Segments Dissolved | `42d04db5a2194b848f887b4a13ab7645` | Parks and Open Space; catalog extract indicates CC-BY-4.0 | Lifestyle context after closures/freshness review | Field/export details unresolved |
| 6 | Emergency Alert Flood Polygons | `3627536f5c274ffc80aa267632de3ca2` | Public safety/OEM collaboration; `public_authoritative`; CC-BY-4.0 record | High theoretical context, not first activation | Hazard/safety use is not authorized |
| 99 | Boulder Area Trailheads | `0e60d76e0da2469db5315677ee0ac277` | Parks and Open Space; `deprecated`; static as of 2026-05-11 | Negative-selection example | Do not activate; source recommends replacement pathway |

## Representative Fields

Address Points includes fields such as `CITY`, `POSTAL_CITY`, `ZIPCODE`, `FULL_ADDRESS`, `PARCEL_NUMBER`, `ACCOUNT_NUMBER`, `TAX_DIST_MUNI`, `LATITUDE`, and `LONGITUDE`.

Park Boundaries includes fields such as `PARK_GROUP`, `ParkGroupDescription`, `Acreage`, `DisplayAcres`, `MilesTrail`, `NumberRestrooms`, `ADAParking`, `ParkingLots`, and `PropertyDescription`.

Traffic Stations includes fields such as `TRAFFIC_COUNT`, `TRAFFIC_YEAR_COUNTED`, `BIKE_COUNT`, `BIKE_YEAR_COUNTED`, `STREET_NAME`, `PAVETYPE`, and `FUNCTIONAL_CLASS`.
