# Panelverse UX Screen Specifications

## 1. Scope and interpretation

This document specifies the complete expected screen coverage for the agreed MVP, not new product scope. Decisions 45A–45F are locked and described in `decision-register.md`. Verify technical behavior against existing backend contracts; do not invent schema or permissions.

## 2. Route and shell map

Use the repository's established route conventions if they already exist. The following paths are conceptual examples, not a mandate to rename existing routes.

### Public routes
- `/` — homepage and story-first discovery
- `/browse` — search-led discovery and filters
- `/series/[seriesSlug]` — public series page
- `/series/[seriesSlug]/episodes/[episodeSlug]` — episode reader entry, with reader mode chosen from episode format
- `/login` — sign in
- `/signup` — account creation, only if included in the agreed authentication MVP
- `/forgot-password` — only if supported by the existing authentication scope

### Creator routes
- `/studio` — creator dashboard
- `/studio/series/[seriesId]` — series overview
- `/studio/series/[seriesId]/episodes` — episode list and management
- `/studio/series/[seriesId]/team` — team/collaboration view, limited to agreed collaboration scope
- `/studio/series/[seriesId]/settings` — series settings and publishing settings that are in MVP scope
- `/studio/series/[seriesId]/episodes/[episodeId]` — episode workspace
- Episode workspace sections/tabs: Production, Review, Preview, Publishing, subject to role and MVP permissions.

If existing route design differs, preserve the established route system and update this map rather than adding duplicate routes.

## 3. Public homepage — `/`

**Goal:** lead with stories and make browsing easy.

### Structure
1. Public header/navigation.
2. Featured comics/story collection using real published content.
3. Trending/new series sections only when real data and agreed MVP support them.
4. Genre or editorial collections only when supported by available data.
5. Secondary creator invitation.
6. Footer with existing public links.

### Actions
- Open a series.
- Navigate to browse/search.
- Enter creator/authentication flow where applicable.

### States
- Loading featured content.
- Normal populated homepage.
- Sparse catalog: show available published stories without fabricated sections.
- Empty catalog: explain that no published stories are available yet; do not show fake trending content.
- Load failure: explain and offer retry where useful.

### Responsive
- Stack feature content on mobile.
- Keep the first meaningful story/action visible quickly.
- Avoid large promotional areas pushing actual stories too far down the page.

## 4. Browse and discovery — `/browse`

**Goal:** search and filter published comics.

### Structure
- Prominent search field.
- Filters for genre and other fields only when supported by MVP data.
- Sorting options only where supported by the data/query implementation.
- Responsive comic grid.
- Visible applied filters with remove/clear behavior.
- Pagination or incremental loading according to existing implementation.

### Actions
- Submit or clear search.
- Apply/remove filters.
- Change supported sort.
- Open a series.

### States
- Initial/loading results.
- Results.
- Empty catalog.
- No matching results.
- Search/filter request failure.
- Invalid or stale query/filter values handled gracefully.

### Responsive
- Desktop filters may sit alongside results.
- Mobile filters use a compact sheet/drawer; applied filters remain visible and removable.
- Avoid exposing unsupported filters.

## 5. Public series page — `/series/[seriesSlug]`

**Goal:** communicate the story and provide a clear reading entry point.

### Structure
- Cover/artwork with fallback.
- Series title.
- Creator attribution.
- Synopsis.
- Primary Start Reading action when a published episode exists.
- Episode list in intended reading order.
- Relevant public metadata supported by the MVP.
- Continue Reading only when reliable reader-progress data exists and the feature is in scope.

### Actions
- Start or resume reading where supported.
- Open a listed published episode.
- Navigate back to discovery.

### States
- Loading.
- Series found with episodes.
- Series found but no published episodes: explain availability; do not expose private drafts.
- Missing cover/art fallback.
- Not found or unavailable.
- Network/server error.

### Permissions
- Only public series data and published episodes are visible to unauthenticated/public readers.
- A private series must not leak its title, draft content, team, or status through error messages.

## 6. Episode list

The episode list appears on the public series page and within the creator series workspace, with different visibility and actions.

### Public variant
- Compact vertical list.
- Sequence/number and title.
- Optional thumbnail and publication date when data exists.
- Direct reading action.
- Published episodes only, in intended reading order.

### Creator variant
- Includes permitted draft/private episodes.
- Displays status and management actions according to role.
- Does not show controls the current user cannot use.

### States
- Loading.
- Empty series/episode list.
- Populated list.
- Load error.
- Permission denied for private creator view.

## 7. Reader entry and vertical-scroll reader

**Goal:** present a webcomic/webtoon episode in a calm, dark reading environment.

### Structure
- Dark reader background.
- Series and episode context.
- Artwork in correct order, scaled without distortion.
- Minimal controls: episode navigation, exit/back to series, and progress/settings only where supported.
- Clear episode-end/next-episode transition.

### Behavior
- Episode format determines the default mode.
- Natural vertical scrolling.
- Controls must not persistently obscure artwork.
- If reader progress is stored, use reliable data and respect authentication/ownership rules; do not invent progress.

### States
- Loading episode metadata and artwork.
- Artwork loading/fallback.
- Empty or unavailable published episode.
- Reader error with retry/recovery.
- End of episode with next published episode when available.
- No next episode.
- Not found/unavailable without leaking private content.

## 8. Reader entry and paginated reader

**Goal:** provide a traditional page-by-page comic reading experience.

### Structure
- Same dark reader environment as vertical mode.
- Current page artwork with appropriate containment.
- Previous/next controls.
- Current page/total pages only if total count is reliable.
- Exit/back to series and episode navigation.

### Behavior
- Buttons and keyboard controls where appropriate.
- Touch/swipe may supplement buttons, never replace accessible controls.
- Keyboard shortcuts must not interfere with text entry or assistive technology.
- No distortion or unintended cropping of artwork.

### States
- Loading.
- Page transition/loading.
- First page (previous disabled).
- Last page (next disabled or replaced with episode transition).
- Missing/unavailable page asset.
- Episode unavailable/not found.
- Recoverable request error.

## 9. Authentication screens

Authentication routes and exact methods must match the existing Supabase configuration and agreed MVP.

### Sign in
- Clearly labeled email/credential fields for configured method.
- Submit, loading, validation error, and authentication error states.
- Link to account creation or recovery only if those flows are supported.
- Preserve safe field values after recoverable errors; never expose secrets.

### Sign up
- Include only if account creation is part of the agreed MVP.
- Explain required fields.
- Validation and duplicate/invalid-account errors should be clear without leaking account-sensitive information.

### Password recovery
- Include only if supported by the configured authentication flow.
- Confirmation must not disclose whether an account exists.
- Show success/error feedback in plain language.

### Shared states
- Submitting.
- Invalid form.
- Authentication/provider failure.
- Session expired.
- Already authenticated (redirect only to an appropriate safe destination).
- Network failure.

## 10. Creator dashboard — `/studio`

**Goal:** help creators resume work and find their next action.

### Structure
- Main action(s): Create Series and Continue Working, only when supported by the locked MVP.
- My Series.
- Recent Projects.
- Pending Tasks such as reviews, only for tasks the current user can act on and only where supported.
- Publishing status and recent activity only when backed by real data and included in MVP.

### Behavior
- Prioritize actionable work over analytics.
- Clicking an item opens the relevant workspace.
- Do not show data from projects the user cannot access.

### States
- Initial loading.
- Populated dashboard.
- No series yet: show an in-scope create action if permitted.
- No pending tasks.
- Partial data failure where possible; otherwise page-level error.
- Unauthorized/session expired.

### Responsive
- Stack sections on mobile.
- Keep primary actions reachable.
- Collapse creator navigation as defined in the design system.

## 11. Series workspace — `/studio/series/[seriesId]`

**Goal:** provide a series-level overview with contextual navigation.

### Structure
- Series header: cover, title, status/visibility only if those fields exist in the agreed model.
- Overview.
- Episodes.
- Team/collaboration area only to the extent allowed by the locked collaboration scope.
- Settings and publishing configuration only where in MVP scope.

### Behavior
- Series-wide information remains distinct from episode production.
- Role-appropriate actions only.
- Confirm destructive or consequential changes where applicable.
- Unsaved-change warnings only where the interface actually supports editable forms.

### States
- Loading.
- Series overview.
- Empty episode list.
- Not found/unavailable.
- Permission denied.
- Save failure/success where editing exists.

## 12. Episode production workspace

**Goal:** give creators a structured place to manage episode production without inventing an elaborate editor.

### Structure
- Episode header: title/sequence and applicable status.
- Contextual sections: Production, Review, Preview, Publishing.
- Production controls strictly limited to the selected editor/upload workflow decisions.
- Clear navigation back to series and episode list.

### Behavior
- Respect Decision 45B (editor scope) and 45C (upload workflow); their option descriptions must be copied from the canonical decision record before implementation.
- Use server-side validation for consequential transitions.
- Distinguish saving/uploading from completed actions.
- Avoid losing form state on recoverable failures where feasible.

### States
- Loading episode.
- Draft/working state.
- Upload in progress, success, failure, or retry only as supported by the chosen upload workflow.
- Save pending/success/failure only if saving is part of the chosen workflow.
- Missing required information for a transition.
- Permission denied.
- Episode unavailable/not found.

## 13. Review area

**Goal:** support the agreed contextual review workflow.

### Structure
- Episode/series context.
- Review items or feedback tied to the relevant content.
- Reviewer identity and feedback status where supported by the data model.
- Response/resolve actions only if allowed by the locked collaboration scope and the user's role.

### Behavior
- Episode review area is the source of truth; dashboard summaries link back to it.
- Do not add real-time chat, advanced image annotation, or other collaboration features unless explicitly included in the canonical MVP decisions.
- Keep review status separate from publication status if the model treats them separately.

### States
- No review feedback yet.
- Feedback present.
- Pending action.
- Resolved/closed only if that state exists in the agreed model.
- Loading/error.
- Permission denied.

## 14. Preview and publishing area

**Goal:** let authorized creators verify an episode and publish it through an explicit lifecycle.

### Locked lifecycle
- Draft
- In Review
- Ready to Publish
- Published

The exact allowed transitions and roles must follow the canonical MVP rules. Do not assume every role can move an item between every state.

### Structure
- Preview of the content as readers will experience it.
- Current lifecycle status.
- Readiness/validation messages.
- Publish action for authorized users when requirements are satisfied.
- Confirmation for the consequential publish action.

### Behavior
- Validate required content and permissions on the server.
- Published means publicly available.
- Do not add scheduled publishing unless it is explicitly in the MVP decision record.
- A failed publish must leave the content in a consistent state and explain how to recover.

### States
- Preview loading.
- Preview available.
- Missing required content.
- In review/not ready.
- Ready to publish.
- Publishing in progress.
- Publish success.
- Publish failure.
- Already published.
- Permission denied.
- Episode unavailable/not found.

## 15. Team and permissions

Only expose team controls and roles included in the agreed collaboration MVP.

- Show the current user's access clearly when useful.
- Hide or disable unauthorized actions consistently; server-side authorization remains authoritative.
- A UI check is not a security boundary.
- Do not reveal private series/episode existence to unauthorized users.
- Invitation, role editing, member removal, and similar actions must only be implemented if explicitly in the canonical MVP scope.

## 16. Moderation and reporting

Decision 45F = B: implement basic administrative moderation only. Authorized users can review reported/flagged content, take the permitted actions, see the status, and retain basic action records. Enforce permissions server-side. The exact report source, available action types, status values and persistence contract must follow existing product/data contracts; document a genuine gap before proposing a minimal change.

Do not add automated detection, advanced reporting queues, appeals, moderation analytics or configurable policy workflows. Any in-scope moderation UI must define appropriate loading, empty, error, success and permission states. This section does not authorize a broader moderation console.

## 17. Global state and route behavior

Every data-driven route should account for:

- loading;
- populated state;
- empty state where meaningful;
- request failure;
- not found/unavailable;
- permission denied;
- expired session where authentication is required.

Use shared patterns, but tailor the copy and recovery action to the screen. Do not show raw exception details, private data, or stack traces.
