# AGENTS.md — Panelverse

Read this fully. If a task conflicts with this file, stop and ask for clarity and priority. Do not resolve conflicts silently.

## What this project is
Panelverse is a web-based collaborative comic publishing platform for indie creator teams.
Two sides: a creator workspace (series, teams, roles, chapters, uploads, publishing) and a public reader(mobile friendly too) (vertical scroll + page-by-page, from the same chapter data).
Content hierarchy: Series → Volumes → Chapters → Pages.

## Current phase
**Phase 3: Application Skeleton and Shared Infrastructure.** Update this line when the phase changes.
Do NOT build MVP features (auth UI, series, chapters, reader, uploads) unless the task explicitly says so.
Roadmap order: Phase 0 foundation → Phase 1 DB + auth → series/teams/roles → chapters/uploads → readers. Community and monetization are later phases. Do not scaffold for them.

## Stack (fixed)
- Next.js (App Router), React, TypeScript (strict), handcrafted CSS
- Supabase: Postgres, Auth, Row Level Security
- Cloudinary for comic images
- npm only. Do not use yarn or pnpm. Do not commit other lockfiles.

## Hard rules: never do these without explicit human approval
1. Add any dependency. Propose it first with: what it is, why it's needed, the alternative without it.
2. Add Tailwind, a UI component library, Express, an ORM, or a state-management library.
3. Put service-role keys, Cloudinary API secrets, or any secret in client code, in `NEXT_PUBLIC_*` variables, or in git.
4. Create or edit `.env.local` with real values. Only maintain `.env.example` with placeholder names.
5. Disable RLS, write permissive policies like `using (true)`, or bypass auth "temporarily."
6. Trust client-supplied role, user id, or ownership data. Derive identity from the authenticated session on the server.
7. Run destructive commands (`git reset --hard`, force push, dropping tables, deleting migrations, `rm -rf` outside build dirs).
8. Edit an already-applied migration. Add a new one.
9. Store image binaries in the database. Store metadata and Cloudinary references only.
10. Make unpublished artwork publicly reachable by URL.

## Architecture rules
- Server Components by default. Add `"use client"` only for real browser interactivity, and keep those components small.
- Separate concerns: UI components do not contain data access or business logic. Put data access in `src/lib/` (or the existing equivalent), authorization checks on the server.
- Authorization is enforced in two places: server code AND RLS policies. Hiding UI only is not security.
- Roles are scoped per series. A role on one series never grants anything on another.
- Schema changes go through Supabase migrations in `supabase/migrations/`. Every table gets RLS enabled in the same migration that creates it.
- Add indexes only for real query patterns. Add constraints and foreign keys deliberately, and state the deletion behavior (cascade, restrict, set null) for each.
- Validate all user input on the server.
- Do not build speculative infrastructure for features not in the current phase.

## Design rules
- Dark, sleek, creator-first. Deep charcoal/navy base, a small number of high-contrast accents. Artwork is the star.
- Handcrafted CSS with CSS variables for design tokens. No generic SaaS dashboard look, no heavy gradients, no gratuitous animation.
- Must work on desktop, tablet, mobile.
- Accessibility: semantic HTML, keyboard navigation, labels, sufficient contrast, respect `prefers-reduced-motion`.
- The visual direction is provisional. Keep colors and spacing in tokens so it can change cheaply.

## How to work
- Do one coherent task at a time. Keep diffs small and focused. No drive-by refactors or reformatting of unrelated files.
- Inspect the actual repo before changing structure. The repo is the source of truth, not assumptions and not this file's description of it.
- Follow existing file structure and naming. If you think the structure should change, propose it and wait.
- Do not claim something works unless you ran it. Never fabricate command output or test results.
- If requirements are ambiguous, ask. Do not guess on schema, permissions, or security.

## Verification (run before saying a task is done)