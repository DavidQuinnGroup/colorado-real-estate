# PROJECT ATLAS - Liquid Glass Intelligence Workspace Adoption V1

## Scope

The Agent Workspace Intelligence entry point is `/agent/prepare`. It organizes the existing read-only, session-only Property, Location, and Market preparation routes without changing their analytical adapters, data reads, admission rules, evidence truth, or mutation posture.

## Adopted Routes

- `/agent/prepare`: Intelligence landing that distinguishes Property, Location, and Market work.
- `/agent/prepare/property`: supported-property research, existing listing-fact briefing, and current competing-listing context.
- `/agent/prepare/place`: certified City orientation and location evidence.
- `/agent/prepare/market`: supported market observations and market-evidence posture.

## Presentation Rules

The routes use the existing Agent Liquid Glass profile and its resolved canvas, surface, field, action, focus, reduced-motion, and light/dark theme tokens. `IntelligenceWorkspace.module.css` is the bounded shared analytical presentation layer: it provides the responsive frame and maps existing analytical markup to the certified profile without moving data access or changing workflow behavior.

The landing uses the canonical information-class labels for governed fact, editorial context, and warning or limitation. Existing route-level evidence and limitation language remains visible and semantically distinct. Dense current-competing and current-snapshot analytical surfaces retain stable data treatment and responsive overflow behavior from their existing components.

## Certification Boundary

This adoption is presentation-only. It does not introduce persistence, new data, database/schema changes, evidence admission, provider activity, MLS sync, Typesense changes, Output mutation, Client Authorization mutation, email, CRM, alerts, or external contact. Production visual certification remains an Executive review gate after technical and non-destructive runtime checks pass.
