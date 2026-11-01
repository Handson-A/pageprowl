# PageProwl — Implementation Plan (formerly Panelverse)

**Status:** Proposed build sequence  
**Stack:** Next.js 14 App Router, Supabase, Cloudinary, Vercel  
**Developer:** Solo developer with Antigravity assisting implementation

## 1. Objective

Implement PageProwl in small, verifiable increments.

Every phase should produce a working result, with clear acceptance criteria before moving to the next phase. Antigravity should not attempt to implement the entire product in one task.

## 2. Development Workflow

Use two long-lived branches:

- `main` — stable, verified code suitable for release.
- `dev` — integration branch for ongoing development.

Use descriptive feature and fix branches when useful, merging completed work into `dev`. Promote verified releases from `dev` to `main`.

Use commit prefixes consistently:
- `feat:` new functionality.
- `fix:` bug fixes.
- `docs:` documentation.
- `refactor:` code restructuring without intended behavior changes.
- `test:` tests.
- `chore:` tooling and maintenance.

Each implementation task must identify its scope, dependencies, files or modules affected, tests required, and acceptance criteria.

## 3. Phase 1 — Repository and Application Baseline

### Tasks
- Inspect the existing repository before making changes.
- Confirm the installed Next.js version and current App Router structure.
- Review existing documentation, dependencies, and configuration.
- Establish TypeScript, linting, formatting, and validation conventions.
- Establish environment-variable documentation.
- Configure a minimal, consistent application layout.
- Confirm the application runs locally and builds successfully.
- Confirm the deployment configuration is compatible with the chosen stack.

### Acceptance criteria
- The project starts locally.
- Production build succeeds.
- Linting and type checks run.
- Secrets are not committed.
- Existing working configuration is preserved unless a change is justified.

Do not regenerate the project or upgrade major dependencies without first inspecting the repository.

## 4. Phase 2 — Database Foundation and Authentication

### Tasks
- Create versioned Supabase migrations.
- Define the initial profiles model.
- Configure server-side Supabase authentication.
- Establish browser and server client utilities using the supported integration.
- Implement registration, login, sign-out, and required account flows.
- Define platform role handling.
- Establish initial RLS policies.
- Create tests for authenticated and unauthenticated access.

### Acceptance criteria
- Users can authenticate and maintain valid sessions.
- Protected operations reject unauthenticated requests.
- Users cannot access other users' protected data by changing identifiers.
- Database migrations can be applied reproducibly.

Do not implement all product tables at once. Introduce schema changes in dependency order.

## 5. Phase 3 — Profiles, Studios, and Permissions

### Tasks
- Implement personal and creator profiles.
- Implement studio creation and management.
- Implement studio memberships and predefined studio roles.
- Implement studio invitations and acceptance.
- Establish the initial permission helpers and database policies.
- Implement personal and studio workspace navigation.
- Test ownership, membership, and access boundaries.

### Acceptance criteria
- A user can create and manage a studio.
- Invitations grant access only after acceptance.
- Unauthorized users cannot change studio settings or membership.
- Studio membership does not automatically expose every series.
- Privileged platform roles remain distinct from creator permissions.

## 6. Phase 4 — Series and Collaboration

### Tasks
- Implement the series model with explicit individual or studio ownership.
- Enforce the exactly-one-owner constraint.
- Implement series memberships and invitations.
- Implement series access roles.
- Implement series-level and episode-level contributor credits.
- Implement basic creator dashboards and series workspaces.
- Add tests for permission differences between owners, editors, contributors, and viewers.

### Acceptance criteria
- Both individual-owned and studio-owned series work.
- Contributors can access only authorized series.
- Credits do not grant access.
- Removing a studio membership revokes access granted solely by that membership.
- The documented ownership-recovery process is restricted and auditable.

## 7. Phase 5 — Media and Comic Editing

### Tasks
- Integrate Cloudinary using a controlled upload strategy.
- Implement media asset records.
- Implement individual and batch uploads.
- Validate file types, dimensions, sizes, and upload results according to configured limits.
- Handle partial batch failures and retryable operations.
- Implement page-based content assembly.
- Implement vertical-scroll content assembly.
- Implement ordering, replacement, removal, draft saving, and previews.
- Protect private and unpublished artwork.
- Implement safe asset cleanup rules.

### Acceptance criteria
- Both comic formats can be assembled and previewed.
- Uploaded files are associated with the correct database records.
- Failed uploads do not silently create invalid content.
- Reordering content persists correctly.
- Deleting a draft reference does not delete an asset still needed elsewhere.
- Unauthorized users cannot upload to or modify another creator's content.

## 8. Phase 6 — Episodes, Revisions, and Publishing

### Tasks
- Implement logical episodes and separate revisions.
- Define and document valid revision-state transitions.
- Distinguish latest working revision from current published revision.
- Implement draft management and revision history.
- Implement publication eligibility checks.
- Implement immediate publication.
- Implement scheduled releases and database-backed job records.
- Implement safe, idempotent publication processing.
- Implement unpublishing separately from permanent deletion.
- Add integration tests for publishing and revision isolation.

### Acceptance criteria
- A creator can prepare a new revision without changing the currently published content.
- Readers see only the currently published revision.
- Scheduling does not bypass mandatory review.
- Repeated job execution does not produce duplicate publication events.
- Publication failures are visible and recoverable.
- Unpublishing removes public availability without automatically destroying retained work.

## 9. Phase 7 — Public Reader Experience and Discovery

### Tasks
- Implement the public homepage.
- Implement discovery and genre browsing.
- Implement PostgreSQL-backed search and pagination.
- Implement public series pages and episode lists.
- Implement the page-based reader.
- Implement the vertical-scroll reader.
- Implement public creator and studio profiles.
- Implement follows and bookmarks.
- Add responsive layouts and accessible reading controls.

### Acceptance criteria
- Visitors can discover and read public comics without registration.
- Both comic formats render correctly.
- Unpublished or restricted revisions cannot be reached through public routes.
- Search and genre filters return appropriate results.
- Authenticated readers can manage follows and bookmarks.

## 10. Phase 8 — Review Collaboration and Notifications

### Tasks
- Implement draft comments and review feedback.
- Implement in-app notifications.
- Add essential transactional email flows.
- Cover invitations, review feedback, publishing events, and moderation notifications.
- Add delivery status and retry handling where required.

### Acceptance criteria
- Comments and notifications are visible only to authorized recipients.
- Important invitations and workflow events are delivered reliably enough for launch.
- Failed email delivery does not silently corrupt the underlying workflow.
- Notification processing avoids unintended duplicates.

## 11. Phase 9 — Moderation and Platform Administration

### Tasks
- Implement user reports.
- Implement moderation cases and report grouping.
- Implement restricted moderation interfaces.
- Implement proportionate enforcement actions.
- Implement content restriction and restoration workflows.
- Implement appeals or review of moderation decisions.
- Implement audit records for consequential actions.
- Test moderator access to private content and all enforcement boundaries.

### Acceptance criteria
- Users can submit reports.
- Moderators can review cases and record decisions.
- Required restrictions affect public availability correctly.
- Moderators cannot silently modify creator work through privileged shortcuts.
- Consequential actions are auditable.
- Appeals and subsequent decisions do not erase the original record.

## 12. Phase 10 — Security, Reliability, and Release Readiness

### Tasks
- Review all RLS policies and server-side authorization checks.
- Test direct requests that attempt to bypass the UI.
- Review Cloudinary upload and delivery access.
- Review secret handling and environment configuration.
- Verify migration and deployment procedures.
- Verify scheduled-job authentication and retry behavior.
- Confirm backup and recovery arrangements.
- Test major reader, creator, studio, and moderation workflows.
- Resolve launch-blocking defects.
- Document known limitations and operational procedures.

### Acceptance criteria
- Critical permissions are tested.
- Private drafts and restricted assets are protected.
- Critical workflows pass end-to-end tests.
- Production builds and migrations are reproducible.
- Monitoring and recovery procedures are documented.
- No known critical security or data-integrity issue remains unresolved.

## 13. Antigravity Task Protocol

For each assigned task, Antigravity should:

1. Inspect the existing implementation and relevant documentation.
2. Summarize its understanding and identify dependencies.
3. Make only changes necessary for the assigned scope.
4. Follow the established conventions and avoid unrelated refactoring.
5. Add or update tests for affected behavior.
6. Run relevant lint, type, build, and test checks.
7. Report changed files, migrations, checks run, failures, and remaining risks.
8. Stop at the defined acceptance boundary rather than starting unrelated work.

If a requirement conflicts with the agreed architecture, Antigravity should report the conflict instead of silently choosing a different design.

## 14. Definition of Done

A feature is not complete merely because its interface exists.

A feature is done when:
- Its intended workflow works end to end.
- Authorization is enforced on the server and database as appropriate.
- Input and failure cases are handled.
- Relevant automated tests pass.
- Required migrations and environment variables are documented.
- Public and private behavior matches the specification.
- Documentation is updated where necessary.
- The changes are reviewable and ready to integrate into `dev`.

## 15. Delivery Strategy

Implement and verify one coherent capability at a time.

Prioritize dependencies and security foundations before complex interfaces. Avoid implementing every screen with placeholder data and attempting to connect everything at the end.

The release should emerge from a sequence of working, tested increments rather than one large implementation pass.