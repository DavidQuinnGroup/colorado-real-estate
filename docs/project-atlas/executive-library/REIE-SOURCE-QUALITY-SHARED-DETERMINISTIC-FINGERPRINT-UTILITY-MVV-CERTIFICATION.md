# Source Quality Shared Deterministic Fingerprint Utility MVV

Status: locally certified on an isolated branch. This additive utility provides a versioned, SHA-256, namespaced fingerprint for future explicitly governed Source Quality consumers.

The utility canonicalizes governance metadata only. It rejects undefined, bigint, functions, symbols, non-finite numbers, and non-plain objects. Object keys are sorted, arrays preserve order, and JSON escaping is deterministic.

The public API is `createSourceQualityNamespacedFingerprint(namespace, value)`. The hash primitive and serializer remain internal. Namespaces are domain-separated for Public Record, County Public Record, GIS/Public-Geospatial, Human-Reviewed, Normalization, Control, Assembly, Report, and Operational Manifest concerns.

Existing Public Record, County, Human-Reviewed, Normalization, Control, Assembly, Report, and Operational Manifest fingerprints are frozen and were not migrated or modified. The separate GIS fixture fingerprint utility remains separate.

This utility does not validate source classes, normalize evidence, authorize rights/access, ingest GIS data, or grant activation, retrieval, rendering, display, or legal-use authority. It is independent of Parcel Registry identity work.
