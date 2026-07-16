# Repository Studio™ — Sprint 1

## Scope

Sprint 1 establishes the first read-only operational interface to the REIE Enterprise Repository.

Included:

- Repository dashboard
- Repository health metrics
- Governance watchlist
- Enterprise object explorer
- Enterprise object search
- Object detail view
- Incoming relationship view
- Outgoing relationship view
- Read-only Repository APIs

## Routes

- `/admin/repository`
- `/admin/repository/objects`
- `/admin/repository/object/[rid]`
- `/api/admin/repository/health`
- `/api/admin/repository/objects`
- `/api/admin/repository/object/[rid]`

## Security boundary

All Supabase access occurs server-side with `SUPABASE_SERVICE_ROLE_KEY`.

The installed REIE integration adds a scoped middleware boundary for
`/admin/repository/:path*` and `/api/admin/repository/:path*`. It uses the
existing `REIE_ADMIN_API_KEY` / `ADMIN_API_KEY` convention and accepts
`x-admin-key`, `Authorization: Bearer <key>`, or `adminKey`. Local development
remains open only when no admin key is configured, matching the existing admin
API pattern.

## Sprint 1 limitations

This package intentionally does not include:

- Object creation
- Object editing
- CID assignment
- Approval mutations
- Stewardship mutations
- Relationship mutations
- Graph visualization
- Impact analysis
- AI Brand Brain integration

Those belong to later governed sprints.
