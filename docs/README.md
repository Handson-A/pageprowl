# Panelverse — Phase 2 Design & MVP Scope Pack

**Status: CLOSED — design direction and MVP scope decisions are locked.**

This folder contains the approved Phase 2 design and UX handoff for Panelverse. It is intended to be copied into the repository's `docs/` directory.

## Files

- `design-system.md` — brand direction, visual tokens, typography, responsive behavior, accessibility and component styling.
- `ux-screen-specs.md` — conceptual route map, screen responsibilities, behavior and essential states.
- `component-inventory.md` — reusable component inventory and expected variants.
- `decision-register.md` — locked Phase 2 decisions, MVP decisions 45A–45F and scope boundaries.
- `antigravity-handoff.md` — implementation constraints, suggested build order and acceptance checklist.

## Source-of-truth rules

1. The locked MVP decisions and existing project architecture determine product behavior. These design documents describe the agreed UX; they do not authorize extra features.
2. Route paths are conceptual examples. Inspect the repository and preserve existing conventions where practical.
3. Inspect the current Supabase schema, authentication setup and Cloudinary integration before deciding data contracts. Do not invent tables, columns, roles, permissions or lifecycle transitions.
4. Where a necessary implementation detail is not specified, document the question and ask before making a consequential product or schema decision. Routine implementation choices that do not change product behavior can be made by the coding agent.
5. Use real data in production. Any seed or fixture content must be clearly development-only. Never fabricate popularity, activity, analytics or team information.

## Locked project context

- Product: Panelverse, a collaborative comic publishing platform for creators and readers.
- Stack: Next.js 14 App Router, TypeScript, Supabase, Cloudinary and Vercel.
- Workflow: solo developer, `main` and `dev` branches, conventional commit prefixes such as `feat:` and `fix:`.
- Coding agent: Antigravity.

## Phase 3 handoff note

Phase 2 is closed as a design and scope decision phase. This does not mean the application is implemented or tested. During Phase 3, resolve the narrow technical details identified in `decision-register.md` by inspecting the repository and documenting any genuine blockers—without reopening settled product scope.
