# Panelverse Technical Stack

## Status

This document records the agreed high-level stack. Package versions, exact service configuration, and implementation details must be verified in the repository before being treated as complete.

## Approved stack

| Concern | Decision | Notes |
|---|---|---|
| Web framework | Next.js 14 | Use the App Router. Keep the application on the agreed major version unless the project owner approves an upgrade. |
| Language | TypeScript | Keep strict type checking enabled where practical. Avoid `any` unless justified. |
| Routing and rendering | Next.js App Router | Prefer Server Components; use Client Components only where browser interactivity is needed. |
| Styling | Native CSS | Use CSS Modules for component-specific styles and global CSS for resets, tokens, and genuinely global rules. Do not add Tailwind or another styling framework without approval. |
| Database | Supabase Postgres | Database schema changes must be versioned through migrations. |
| Authentication | Supabase Auth | Use the supported server-rendering integration appropriate to the installed Supabase packages. |
| Media | Cloudinary | Use Cloudinary for image/media storage and transformations. Keep API secrets server-side. |
| Hosting | Vercel | Production deployment is associated with `main`; `dev` can be configured as a preview/staging environment. |
| Source control | GitHub | Use `main`, `dev`, and short-lived task branches. |
| Package manager | npm | Commit `package-lock.json` and use `npm ci` for reproducible installs. |

## Dependency and version policy

- Keep Next.js on major version 14 unless migration is explicitly approved.
- Choose mutually compatible versions of Next.js, React, TypeScript, Supabase libraries, and other dependencies.
- Commit the lockfile.
- Do not run broad dependency upgrades as part of an unrelated feature.
- Before adding a dependency, explain why the existing stack cannot reasonably meet the requirement.
- Do not copy integration examples written for a different major version without checking compatibility.

## Rendering conventions

- Prefer Server Components for route pages, layouts, and server-side data reads.
- Add `"use client"` only when a component requires client-side state, effects, event handlers, or browser APIs.
- Keep client component boundaries as small as reasonably possible.
- Do not expose server-only modules, secrets, or privileged SDK clients to client components.
- Use Route Handlers or Server Actions when appropriate for server-side mutations, and validate inputs on the server.

## CSS conventions

- Use `*.module.css` for component-scoped styles.
- Keep global resets, design tokens, global typography, and base element styles in `src/app/globals.css` and related global CSS files if introduced.
- Prefer reusable CSS custom properties for shared design tokens.
- Avoid inline styles for substantial component styling.
- Do not introduce a CSS framework without approval.

## Supabase conventions

- Separate browser and server Supabase client setup.
- Use Supabase migrations for schema changes.
- Keep generated database types in sync with the schema.
- Enable and test Row Level Security for tables exposed through the client-facing API.
- Do not rely on UI visibility as an access-control mechanism.
- Treat service-role credentials as privileged secrets and use them only in server-only code when there is a clear need.

## Cloudinary conventions

- Browser-visible configuration may include the Cloudinary cloud name and other explicitly public values.
- Never expose the Cloudinary API secret to the browser.
- For signed uploads, generate signatures on the server after validating the user's authorization.
- Restrict upload types, sizes, and destinations according to the product requirements.
- Store only the media identifiers and metadata needed by the application in the database; document the final media model when designed.

## Deployment conventions

- Vercel is the intended hosting platform.
- Configure production and preview environment variables separately.
- Treat `main` as production-ready.
- Use preview deployments to review changes before production when available.
- Database migrations must be applied deliberately to the intended environment; do not assume a deployment automatically makes every database change safe.

## Changes to this document

Any change to the agreed stack - especially framework major versions, database/auth provider, media provider, styling approach, or deployment platform - requires the project owner's approval and an update to this document.
