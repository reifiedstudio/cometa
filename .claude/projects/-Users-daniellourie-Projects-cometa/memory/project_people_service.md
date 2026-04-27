---
name: People/Directory service — next priority
description: Next service to build is a people/directory service that provides org structure, departments, roles, and enables routing/notifications across all services
type: project
---

Next priority service after notes-api is a **people/directory service** — the connective tissue the ERP is missing.

**Why:** Every service currently knows users only through Clerk auth tokens. Nobody knows org structure — who's in which department, who reports to whom, who approves what. This blocks intelligent routing and notifications.

**How to apply:** This service unlocks capabilities across the entire platform:
- Tasks: auto-route to correct department head for approval
- Signatures: look up who's authorised to sign
- Intake: assign documents to the right person by type
- AI: answer "who handles procurement?" or "who's the CFO's delegate?"
- Notifications/announcements: broadcast to a department or team (feature of people service, not a separate service)

**Core model:** departments, roles, reporting lines, contact details, availability/leave status.

**Decision:** Announcements/notifications should be a feature within the people service, not a standalone service — "notify finance team" requires knowing who's in finance first.
