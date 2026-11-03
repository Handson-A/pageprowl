# PageProwl Architecture (formerly Panelverse)

## High-level structure

The following is the intended structure. Create directories when they are needed; Not necessarily adding empty folders merely to match this tree. The exact routes and features may evolve as product requirements are finalized.

```text
pageprowl/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── (workspace)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   ├── workspace/
│   │   ├── projects/
│   │   ├── comics/
│   │   ├── episodes/
│   │   ├── reader/
│   │   └── publishing/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── cloudinary/
│   │   ├── utils/
│   │   └── constants/
│   ├── hooks/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── AGENTS.md
├── package.json
└── README.md
```

## Responsibilities

### `src/app/`: routing and composition

The App Router directory defines URL routes, layouts, loading and error states, and Route Handlers. Keep route files focused on page composition and connecting routes to feature-level code. Avoid putting large business workflows directly in `page.tsx` files.

Route groups such as `(public)`, `(auth)`, and `(workspace)` organize routes without adding the group name to the URL. They are organizational choices, not security boundaries.

### `src/features/`: product capabilities

Feature directories own code specific to a product capability. A feature may contain:

- `components/` — UI used only by that feature.
- `actions/` — server-side mutations or action entry points where appropriate.
- `schemas/` — input validation schemas.
- `services/` — feature-level business logic or orchestration when useful.
- `types.ts` — feature-specific types that are not already generated from the database.

Do not create every subdirectory in advance. Add only what a feature needs.

Features should own their operations. Shared infrastructure belongs in `src/lib/`. Avoid making one enormous centralized data-access folder that mixes unrelated feature workflows.

### `src/components/`: shared UI

- `ui/` — generic, reusable UI primitives.
- `layout/` — shared structural components such as navigation and application shells.
- `shared/` — reusable components that do not naturally belong to one feature.

If a component is used by only one feature, keep it inside that feature until there is a genuine reuse case.

### `src/lib/`: infrastructure and shared utilities

Use this directory for external service clients and cross-cutting utilities, including:

- Supabase browser and server client factories.
- Cloudinary browser-safe configuration and server-only operations.
- General-purpose utilities and constants.

Keep privileged code server-only. Do not import secret-bearing modules into Client Components.

### `src/types/`: shared types

Use for types that are genuinely shared across features. Keep feature-specific types near their feature. Prefer generated Supabase database types for database rows instead of manually duplicating schema definitions.

### `supabase/`: database lifecycle

Store database migrations and seed data here. Migrations are the version-controlled record of schema changes. Do not make undocumented production-only schema changes.

### `tests/`: tests

Organize tests by purpose and use the test tooling actually configured in the project. Do not claim tests exist or pass unless they have been run.

## Data-access and business-logic rule

**Preferred approach: feature-owned operations.**

Keep business rules and operations near the feature that owns them. Use shared Supabase client factories from `src/lib/supabase/`. Introduce a service or data-access module when it improves clarity, reuse, or testability; do not create layers that only forward arguments without adding value.

Never trust client-submitted user IDs or ownership claims without verifying them against the authenticated session and authorization rules.

## Security boundaries

- Enforce access rules on the server and in Supabase Row Level Security policies.
- Validate all untrusted input on the server.
- Keep service-role keys, Cloudinary API secrets, and other privileged credentials server-only.
- Treat route groups, hidden buttons, and client-side checks as presentation—not authorization.
- Do not log passwords, access tokens, secret keys, or sensitive user content.
- Review upload authorization, file restrictions, and ownership before implementing media workflows.

## Styling

Use CSS Modules for component-level styles and global CSS for design tokens, resets, and global rules. Please do not introduce a styling framework without approval..