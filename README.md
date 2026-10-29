# Panelverse

Panelverse is a web-based, collaborative comic publishing platform for creators, with a public-facing experience for readers and viewers.

This repository contains the Panelverse application. The project is being developed by a solo project owner with AI-assisted implementation. The project owner is the final authority on product scope and architectural decisions.

## Technology stack

- **Framework:** Next.js 14 with the App Router
- **Language:** TypeScript
- **Styling:** Native CSS, using CSS Modules for component-level styles
- **Database:** Supabase Postgres
- **Authentication:** Supabase Auth
- **Media management:** Cloudinary
- **Hosting and deployments:** Vercel
- **Source control:** GitHub

See [the technical stack](docs/TECH_STACK.md) and [architecture guide](docs/ARCHITECTURE.md) for the project's conventions.

## Project status

The repository and Supabase account are established. The technology choices and high-level workflow are agreed. Features, database schema, detailed authorization policies, and final visual design will be implemented and documented incrementally.

Do not treat illustrative folder names, route examples, or future feature ideas in the documentation as proof that those features already exist.

## Getting started

The exact commands depend on the initial project setup and the package versions committed to `package.json`. Once the application is initialized:

1. Install the supported Node.js LTS version and npm.
2. Clone the repository.
3. Install dependencies using the committed lockfile:

   ```bash
   npm ci
   ```

4. Create a local `.env.local` based on `.env.example`.
5. Fill in the development credentials for Supabase and Cloudinary as needed. Never use production secrets for local development.
6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000`.

If the project scripts or required environment variables differ from these examples, update this README and `.env.example` together.

## Environment variables

See [`.env.example`](.env.example) for the expected variable names and notes. `.env.local` must not be committed. Public variables prefixed with `NEXT_PUBLIC_` are exposed to browser code and must never contain secrets.

## Git workflow

- `main` is the stable, production-ready branch.
- `dev` is the integration branch for ongoing work.
- Use short-lived branches such as `feat/comic-reader`, `fix/auth-redirect`, and `docs/setup-guide`.
- Merge tested work into `dev`; merge `dev` into `main` for releases.
- Use Conventional Commits, for example `feat: add comic reader`.

See [Development](docs/DEVELOPMENT.md).

## Documentation

- [Technical stack](docs/TECH_STACK.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development workflow](docs/DEVELOPMENT.md)
- [Database notes](docs/DATABASE.md)
- [Authentication notes](docs/AUTHENTICATION.md)
- [Deployment notes](docs/DEPLOYMENT.md)
- [Agent instructions](AGENTS.md)

Some documents intentionally describe policies and future setup work. Mark a setup task complete only after it has actually been implemented and verified.

## Project principles

1. Keep the implementation understandable and maintainable for a solo developer.
2. Prefer Next.js and the selected services over unnecessary infrastructure.
3. Keep feature-specific business logic near its feature.
4. Enforce authorization on the server and in database policies, not only in the UI.
5. Never commit secrets.
6. Make small, reviewable changes and verify them before claiming completion.
7. Ask the project owner before making significant architectural changes.
