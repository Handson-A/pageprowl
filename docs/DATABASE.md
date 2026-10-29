# Database Notes

## Provider

Panelverse uses Supabase Postgres.

## Schema management

- Store schema changes as SQL migrations under `supabase/migrations/`.
- Use clear, ordered migration filenames.
- Review migrations before applying them to shared or production environments.
- Keep generated TypeScript database types synchronized with the actual schema.
- Use seed data for repeatable local development where helpful.
- Do not make undocumented schema changes directly in production.

## Data modeling principles

When designing the schema, explicitly consider:

- Identity and profile data.
- Project and comic ownership.
- Collaboration and membership roles.
- Comic and episode structure.
- Page ordering and media references.
- Publication state and public visibility.
- Created/updated timestamps and required indexes.
- Data retention and deletion behavior.

These are design topics to resolve; they are not a declaration of finalized tables.

## Security and Row Level Security

Enable and test Row Level Security for tables exposed through Supabase's client-facing API. Policies must express the actual access model.

At minimum, design and test rules for:

- Reading public published content.
- Reading private projects only for authorized members.
- Creating and modifying content according to ownership and role.
- Preventing unauthorized changes to membership or role assignments.
- Protecting private drafts and unpublished media references.

Do not assume that an authenticated user is authorized to access every record. Test policies for anonymous users, ordinary authenticated users, project members, and privileged roles as applicable.

## Credentials

Use the public Supabase URL and publishable/anon key only in the intended public client configuration. Any service-role key is privileged and must remain server-only. Never place a service-role key in a `NEXT_PUBLIC_` variable or commit it.

## Open decisions

Finalize these through explicit design work before implementing dependent features:

- Initial entity model and relationships.
- Collaboration roles and permissions.
- Public/private content rules.
- Migration and seed workflow.
- Backup and recovery expectations.
