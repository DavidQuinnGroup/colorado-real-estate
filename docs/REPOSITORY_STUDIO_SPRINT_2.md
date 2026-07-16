# Repository Studio™ — Sprint 2

## Scope

Sprint 2 extends Repository Studio with read-only enterprise search and governed relationship navigation.

Included:

- Enterprise Search page
- Object and relationship search results
- Search by object name, RID, CID, definition, purpose, and description
- Object-family filtering
- Relationship Navigator
- Relationship type, status, and traceability filters
- Relationship detail page
- Source-to-target navigation
- Search API
- Relationship collection API
- Relationship detail API
- Full replacement of `lib/repository/server.ts`

## Routes

- `/admin/repository/search`
- `/admin/repository/relationships`
- `/admin/repository/relationship/[relationshipRid]`
- `/api/admin/repository/search`
- `/api/admin/repository/relationships`
- `/api/admin/repository/relationship/[relationshipRid]`

## Mutation boundary

Sprint 2 is read-only.

It does not:

- Create or edit Repository objects
- Create or edit relationships
- Assign CIDs
- Resolve governance exceptions
- Change lifecycle state
- Modify stewardship
- Mutate Canon records
