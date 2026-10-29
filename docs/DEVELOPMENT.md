# Development Workflow

## Prerequisites

Install a Node.js version compatible with the committed Next.js 14 and package versions, plus npm and Git. The exact Node.js version should be recorded in project configuration once the initial setup is complete.

You will also need access to the development Supabase project and Cloudinary account for tasks that use those services.

## Local setup

After the application has been initialized:

1. Clone the GitHub repository.
2. Install dependencies with `npm ci`.
3. Copy `.env.example` to `.env.local`.
4. Fill in local development credentials.
5. Start the app with `npm run dev`.
6. Run the available lint, type-check, test, and build scripts before submitting a change.

Do not invent a command if it is not present in `package.json`. Update this document when scripts are added or changed.

## Branch strategy

Use two long-lived branches:

- `main` — stable, production-ready code.
- `dev` — integration branch for active development.

Use short-lived branches for individual tasks:

- `feat/<short-description>` — new functionality.
- `fix/<short-description>` — bug fixes.
- `docs/<short-description>` — documentation.
- `refactor/<short-description>` — code restructuring without intended behavior changes.
- `test/<short-description>` — test-only changes.
- `chore/<short-description>` — maintenance and tooling.

Examples:

```text
feat/creator-workspace
fix/auth-redirect
docs/local-setup
refactor/comic-data-access
```

### Normal workflow

1. Start from an up-to-date `dev`.
2. Create a short-lived branch for one focused task.
3. Make small, reviewable commits.
4. Run relevant checks.
5. Review the diff and confirm no secrets or unrelated changes are included.
6. Merge the task branch into `dev`.
7. Verify the integrated result in the development/preview environment.
8. When `dev` is ready for release, merge it into `main`.
9. Confirm the production deployment and basic smoke checks.

For a small documentation-only change, the project owner may choose a simpler workflow. Preserve the principle that `main` remains stable.

## Commit messages

Use Conventional Commits:

```text
feat: add comic creation workflow
fix: correct authentication redirect
docs: document local setup
refactor: simplify comic data access
style: format CSS and TypeScript
test: cover publishing permissions
chore: update development tooling
```

Use `style` for formatting or stylistic changes that do not change application behavior. Use `feat` for user-visible functionality and `fix` for bug fixes.

Keep commit subjects concise and describe the change, not the act of making a change. Do not claim a test passed in a commit message unless it was run.

## Quality checks

Before merging, run the checks that exist in `package.json`, commonly:

- ESLint.
- TypeScript type checking.
- Relevant unit or integration tests.
- Production build.

Also manually check the affected user flow when practical. If a check cannot be run, say so clearly rather than claiming it passed.

## Working with Antigravity

- Keep each task scoped to the current phase and feature.
- Ask the agent to inspect existing code and instructions before editing.
- Review the proposed plan for broad or risky changes.
- Inspect the final diff.
- Do not accept unrelated formatting or dependency changes without a reason.
- Do not let the agent commit secrets, change production data, or make major architectural changes without approval.
- Ask for a summary of files changed, commands run, results, and known limitations.

## Environment and secrets

- Use `.env.local` for local secrets; never commit it.
- Keep production and preview credentials separate.
- Do not copy production secrets into local development or preview environments without an explicit need and approval.
- Rotate a secret if it is accidentally exposed.
- `NEXT_PUBLIC_` variables are bundled for browser access and must not contain secrets.

## Database changes

- Make schema changes through migrations in `supabase/migrations/`.
- Review migrations before applying them to shared or production environments.
- Test policies and migrations against the intended development environment.
- Never assume a code deployment safely applies a database migration.
- Avoid destructive changes unless the project owner explicitly approves them and a recovery plan exists.

## Definition of done

A task is complete when:

- The requested behavior is implemented within scope.
- Authorization and validation are handled where relevant.
- Relevant checks have been run and their results reported.
- The diff contains no accidental secrets or unrelated changes.
- Documentation is updated if setup, behavior, or architecture changed.
- Known limitations are stated clearly.
