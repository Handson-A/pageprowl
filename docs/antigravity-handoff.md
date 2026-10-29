# Antigravity Implementation Handoff — Panelverse Phase 2

## Objective

Phase 2 design and scope decisions are closed. Implement the approved Panelverse UI/UX from this specification pack without expanding MVP scope. The design system and screen specifications are the UI source of truth; the canonical MVP decision log remains authoritative for product behavior and feature scope.

## Existing stack and workflow

- Next.js 14 App Router
- TypeScript
- Supabase
- Cloudinary
- Vercel
- Solo developer workflow with `main` and `dev` branches
- Commit prefixes such as `feat:`, `fix:`, and other conventional commit types

Do not upgrade or replace the stack, change branch strategy, or introduce a new service without explicit approval.

## Before coding

1. Inspect the repository structure, package scripts, existing routes, components, styles, Supabase client/server utilities, database types, and Cloudinary upload integration.
2. Read the canonical MVP decisions and existing architecture/setup documentation.
3. Compare the proposed conceptual routes with existing routes. Preserve established conventions where possible.
4. Read `decision-register.md` for the confirmed meanings of Decisions 45A–45F. These decisions are locked; do not reopen them or expand their scope.
5. Report any conflict between the current code/schema and the specification before making broad changes.

## Implementation constraints

- No scope expansion. Do not add subscriptions, payments, analytics dashboards, real-time chat, advanced annotations, scheduled publishing, or other features unless the canonical MVP decisions explicitly include them.
- Do not invent database tables, fields, roles, lifecycle transitions, upload behavior, or permission rules. Inspect the existing schema and canonical decisions first.
- Treat UI permission checks as presentation only. Enforce authorization in server-side operations and data access.
- Never expose unpublished episode content through public pages or public data queries.
- Use actual published data for public discovery. No fake trending/popularity numbers, fake activity, or fabricated creator/team data in production.
- Keep publishing status distinct from review status if the underlying model does.
- Preserve the locked lifecycle labels: Draft, In Review, Ready to Publish, Published. Validate exact allowed transitions against the canonical decision log.
- Implement the structured episode editor and batch upload/manual page-ordering workflow exactly as documented in `decision-register.md`.
- Reuse existing dependencies and components when appropriate. Do not install a library merely to replace a small existing utility.
- Keep secrets and privileged Supabase credentials server-side. Never expose service-role credentials to the browser.
- Validate all user-controlled inputs at the appropriate server boundary.
- Provide accessible labels, focus states, keyboard behavior, and responsive layouts.
- Avoid destructive changes to schema/data without explicit approval.

## Recommended build sequence

### Step 1 — Audit and plan
- Inspect the repo and summarize existing architecture.
- Map current routes to the screen specification.
- Identify missing shared components and unclear product decisions.
- Produce a concise implementation plan before substantial changes.

### Step 2 — Design foundations
- Add semantic color tokens, typography, spacing, radii, shadows, and focus styles.
- Establish button, form, badge, card, dialog/sheet, skeleton, empty, error, and permission patterns.
- Confirm contrast and responsive behavior.

### Step 3 — Application shells
- Implement/align public, creator, and reader shells.
- Implement adaptive creator navigation and mobile navigation.
- Confirm route protection and safe redirect behavior.

### Step 4 — Public reading and discovery
- Homepage and browse/search.
- Public series page and public episode list.
- Vertical-scroll reader and paginated reader.
- Public loading, empty, error, and unavailable states.

### Step 5 — Creator workspace
- Dashboard.
- Series overview and episode list.
- Episode workspace, using only the agreed editor/upload workflow.
- Contextual review and preview.

### Step 6 — Publishing and access control
- Implement the exact approved lifecycle and transitions.
- Add server-side validation and authorization.
- Handle publish confirmation, pending, success, failure, and permission states.

### Step 7 — Authentication and regression
- Align auth screens with actual Supabase configuration and MVP scope.
- Test session expiry, unauthorized access, private-resource behavior, and responsive states.
- Fix issues before adding polish.

This order may be adapted to the repository, but the scope constraints remain.

## Acceptance checklist

### Design system
- [ ] Semantic tokens used instead of scattered palette values.
- [ ] Inter and Space Grotesk loaded correctly, with fallbacks.
- [ ] Shared component states are consistent.
- [ ] Contrast, focus, keyboard, and reduced-motion behavior reviewed.

### Responsive
- [ ] Tested below 640px, 640–767px, 768–1023px, 1024–1279px, and 1280px+.
- [ ] No unintended horizontal page overflow.
- [ ] Creator navigation adapts by viewport.
- [ ] Reader controls remain discoverable and artwork is not obscured.

### Public experience
- [ ] Only public/published content is exposed.
- [ ] Discovery uses real data and supported filters.
- [ ] Empty catalog and no-result states are distinct.
- [ ] Missing cover/artwork fallbacks are present.
- [ ] Both reader modes work for the intended episode formats.

### Creator experience
- [ ] Dashboard only shows resources/tasks the user may access.
- [ ] Series-level and episode-level navigation are distinct.
- [ ] Editor and upload behavior match canonical Decisions 45B and 45C.
- [ ] Review behavior matches canonical Decision 45E.
- [ ] Basic moderation supports authorized flagged-content review, appropriate actions, status, and basic action records only.

### Publishing and security
- [ ] Only permitted roles can perform each lifecycle transition.
- [ ] Server-side validation prevents invalid publication.
- [ ] Publish success/failure is clearly communicated.
- [ ] Private-resource errors do not leak existence or content.
- [ ] No privileged keys or secrets are exposed client-side.

### Quality
- [ ] Loading, empty, error, not-found, and permission states are implemented for applicable screens.
- [ ] Forms show field-level and/or form-level errors as appropriate.
- [ ] Async actions prevent accidental duplicate submissions.
- [ ] No dead buttons or misleading controls.
- [ ] Existing tests/lint/type checks/build pass, or failures are reported accurately.

## Expected output from Antigravity

For each implementation task:
1. Brief summary of changes.
2. Files changed.
3. Decisions/assumptions applied.
4. Tests and checks run with actual results.
5. Remaining blockers or questions.

Do not report a check as passing unless it was run and passed.
