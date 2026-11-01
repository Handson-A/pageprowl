# PageProwl — Decision Register & Scope Guard (formerly Panelverse)

**Phase 2 status: CLOSED.** The visual direction, MVP screen coverage, and decisions 45A–45F are locked. This register records the agreed meaning of those choices for implementation.

## 1. Locked Phase 2 design decisions

| Decision | Locked direction |
|---|---|
| 2.1 Overall direction | Hybrid Universe: one recognizable brand with purpose-built public, reader and creator-workspace experiences |
| 2.2 Brand personality | Bold Creative Collective with a premium storytelling influence |
| 2.3 Palette | Ink `#171717`, Paper `#F7F0E3`, Comic Red `#E44735`, Golden Yellow `#F2C14E`; verify semantic-token contrast before use |
| 2.4 Typography | Inter for UI/body; Space Grotesk for headings and brand accents |
| 2.5 Components | Soft & Modern: moderate rounding, subtle borders, restrained shadows, clear interaction states |
| 2.6 Theme | Light-first platform; dark environments for both reading modes; user-selectable theme is not MVP scope |
| 2.7 Responsive approach | Responsive/mobile-capable; desktop optimized for full creator production; mobile supports browsing, reading and essential creator actions |
| 2.8 Navigation | Separate public and creator navigation |
| 2.9 Icons | Minimal editorial line icons; comic-inspired accents mainly for branding/promotional areas |
| 2.10 Device navigation | Desktop full sidebar; tablet compact/collapsible navigation; mobile drawer or compact navigation |
| 2.11 Reader modes | Vertical-scroll and paginated reading; episode format determines the default |
| 2.12 Breakpoints | Mobile `<640px`; large mobile `640–767px`; tablet `768–1023px`; desktop `1024–1279px`; wide desktop `≥1280px` |
| 2.13 Reader controls | Minimal, context-aware controls; accessible alternatives to gestures; clear navigation and progress where supported |
| 2.14 Homepage | Story-first discovery with featured comics/collections and secondary creator invitation |
| 2.15 Browse | Search-led discovery, supported filters/sort, visible removable filters, responsive grid and mobile filter sheet |
| 2.16 Series page | Story-first presentation, cover, creator attribution, synopsis, Start Reading, and published episode list |
| 2.17 Episode list | Compact vertical list with reading order and only supported metadata; public pages show published episodes only |
| 2.18 Dashboard | Action-oriented creator dashboard; My Series, recent projects, permitted pending tasks, publishing status and recent activity where real data exists |
| 2.19 Series workspace | Series overview with contextual navigation; team/settings actions only where authorized and in scope |
| 2.20 Episode workspace | Structured Production, Review, Preview and Publishing areas, constrained by the approved editor/upload scope |
| 2.21 Collaboration | Contextual feedback, reviewer identity, review status, and permitted response/resolution actions |
| 2.22 Publishing | Draft, In Review, Ready to Publish, Published; validate requirements and permissions server-side; keep review and publication status distinct when required |
| 2.23 Screen coverage | Complete MVP screen and essential-state coverage without expanding scope |

## 2. Locked MVP decisions 45A–45F

### 45A — A: Complete publishing journey

Support the agreed journey from creator production through review and publication to public discovery and reading. Keep each step within the remaining decisions and existing MVP boundaries.

### 45B — C: Structured episode editor

Provide an episode workspace to manage uploaded artwork, organize pages (or panels only where the data model actually supports them), set reading order and edit episode metadata. Do not build a full drawing canvas, lettering suite or advanced image editor.

### 45C — A: Batch upload with page organization

Allow multiple image files to be selected and uploaded together, show progress and failures, allow manual arrangement into the correct reading order, and save the episode. Do not add automatic sorting, image editing or advanced media processing unless separately approved.

### 45D — B: Reading with essential convenience features

Provide vertical-scroll and paginated readers, clear page/episode navigation and basic context-appropriate controls. Remember reading progress where supported by the agreed data model. Do not add bookmarks, advanced customization or extra social reading features.

### 45E — B: Structured team collaboration

Authorized team members work within assigned permissions. Provide contextual feedback, clear review status and permitted response/resolution actions. Do not add real-time chat, advanced annotations or expanded team-management tools beyond the agreed MVP.

### 45F — B: Basic administrative moderation

Enforce publishing permissions and required fields, and provide a limited authorized workflow to review reported/flagged content, take appropriate actions, display status and retain basic records of actions. Do not add automated detection, advanced reporting queues, appeals, moderation analytics or configurable policy workflows.

## 3. Project and implementation context

- Product: PageProwl (formerly Panelverse), a collaborative comic publishing platform for a team of creators.
- Stack: Next.js 14 App Router, TypeScript, Supabase, Cloudinary and Vercel.
- Solo developer workflow: `main` and `dev` branches; conventional commit prefixes such as `feat:` and `fix:`.
- Antigravity is the coding agent; the developer owns repository setup and project decisions.

## 4. Non-negotiable scope and engineering rules

- These decisions define the MVP boundary; do not add adjacent features merely because they are common on other platforms.
- Never expose drafts, unpublished episodes or private creator content on public routes.
- Enforce authentication and authorization on the server/data-access boundary. Hiding a button is not security.
- Use real production data; do not fabricate trending/popularity metrics, activity, analytics or team members.
- Do not invent tables, fields, roles, permissions, allowed transitions, upload limits or authentication flows. Inspect the repository and existing contracts first.
- Keep review status distinct from publication status where the model requires it.
- Keep the publishing lifecycle labels: Draft, In Review, Ready to Publish and Published. Validate actual transitions against the existing implementation and agreed workflow.
- Keep upload behavior to batch upload, progress/failure feedback, manual page ordering and saving.
- Keep moderation limited to authorized review/action/status/basic action records.
- Do not add subscriptions, payments, analytics-heavy dashboards, real-time chat, advanced annotation, scheduled publishing, advanced reader features, advanced moderation, or unapproved team/auth flows.
- Keep secrets and privileged Supabase credentials server-side.
- Avoid destructive schema/data changes without explicit approval.

## 5. Technical details to resolve during Phase 3

These are implementation details, not reasons to reopen the locked design or MVP decisions. Inspect the repository and current schema first; ask for a decision only if a choice materially changes product behavior or requires an unapproved scope change.

1. **Reading progress:** establish the minimal supported persistence contract, including signed-in/signed-out behavior, based on the current schema and authentication model. If it cannot be supported without changing agreed scope, report the constraint rather than inventing a feature.
2. **Artwork contract:** confirm supported formats, upload limits already configured, storage references, page-order representation and failure/retry behavior. Confirm whether “panels” are represented in the model; otherwise implement page ordering only.
3. **Roles and permissions:** map existing roles/memberships to allowed creator, reviewer, publisher and moderation actions. Do not invent roles or member-management features.
4. **Moderation record:** map flagged-content status and basic action records to existing tables/contracts; propose a minimal schema change only if necessary, and request approval before consequential schema changes.
5. **Authentication:** implement only the authentication flows already approved/configured; do not assume signup or password recovery is in scope just because a conceptual route appears in the screen spec.

## 6. Phase 2 completion record

- [x] Visual direction and design system documented.
- [x] MVP screen and essential-state coverage defined.
- [x] Decisions 45A–45F recorded with their confirmed meanings.
- [x] In-scope collaboration, publishing and moderation boundaries documented.
- [x] Out-of-scope features listed.
- [x] Antigravity implementation handoff prepared.

Phase 2 is closed. Repository inspection, technical-contract verification, implementation, and testing are Phase 3 work.
