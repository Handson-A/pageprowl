# Deployment Notes

## Hosting

PageProwl is intended to be hosted on Vercel.


## Environment variables

Configure environment variables separately for local development, preview and production.

- Use development Supabase and Cloudinary credentials in local development.
- Use appropriate preview credentials for preview deployments.
- Use production credentials only in production.
- Never expose server-only secrets through `NEXT_PUBLIC_` variables.
- If a secret changes, update the relevant environment configuration and redeploy as required.

See `.env.example` for variable names and notes.

## Database migrations

Application deployment and database migration are separate operational concerns.

Before applying a migration to production:

1. Review the migration and its expected effects.
2. Confirm it has been tested in development.
3. Consider backward compatibility with the currently deployed application.
4. Ensure a recovery or rollback approach exists where appropriate.
5. Apply it deliberately to the intended database environment.
6. Verify the application and relevant data flows afterward.

Do not run destructive migrations automatically without explicit approval.

## Release checklist

- [ ] Changes have been reviewed and merged into `main`.
- [ ] Relevant lint, type-check, test, and build checks pass.
- [ ] Required environment variables are present in Vercel.
- [ ] Required database migrations have been applied deliberately.
- [ ] Production deployment succeeds.
- [ ] Key routes and authentication behavior have been smoke-tested.
- [ ] Upload and media behavior has been checked if affected.
- [ ] Any known issue or follow-up is documented.
