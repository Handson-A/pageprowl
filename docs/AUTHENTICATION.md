# Authentication Notes

## Provider

Panelverse uses Supabase Auth.

## Current status

The provider is selected, but the complete sign-in/sign-up experience, supported identity providers, recovery flow, and session behavior must be implemented and tested.

## Implementation principles

- Use the Supabase SSR integration compatible with the versions installed in the project.
- Keep browser and server client setup separate.
- Follow the provider's current guidance for cookie-based sessions in Next.js App Router.
- Validate authentication and authorization on the server for protected operations.
- Do not rely on client-side redirects or hidden UI as the only protection for private data.
- Avoid logging credentials, session tokens, or recovery links.
- Handle loading, expired-session, and authentication-error states deliberately.

## Middleware

If `src/middleware.ts` is used to refresh sessions or handle broad route behavior, keep it focused. Middleware is not a substitute for authorization checks in server-side operations or Supabase Row Level Security.

Do not assume every route under a route group is protected; route groups are organizational only.

## Authorization

Authentication answers who the user is. Authorization answers what the user is allowed to do. These are separate checks.

Before implementing collaboration, define how ownership, membership, roles, and permissions are represented and enforced. Database policies and server-side mutations must agree on the same rules.

## Open decisions

- Sign-in methods and supported providers.
- Email confirmation requirements.
- Password recovery and account recovery.
- Profile creation and synchronization.
- Session refresh and sign-out behavior.
- Roles and permission model for collaborative projects.
- Account deletion and associated content handling.
