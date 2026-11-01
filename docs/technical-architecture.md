# PageProwl — Technical Architecture (formerly Panelverse)

**Status:** Architecture baseline  
**Product:** PageProwl (formerly Panelverse)  
**Stack:** Next.js 14 App Router, Supabase, Cloudinary, Vercel  
**Development model:** Solo developer with AI-assisted implementation

## 1. Architectural Goals

PageProwl must support public comic reading, independent creators, collaborative studios, multiple comic formats, revision-based publishing, and platform moderation.

The architecture must prioritize:

- Clear boundaries between public and private data.
- Server-enforced permissions.
- Reliable publishing and revision handling.
- Safe media uploads and asset lifecycle management.
- A relational data model with explicit ownership.
- Maintainable implementation for a solo developer.
- Incremental delivery without building speculative infrastructure.

The system should begin as a modular monolithic web application rather than a collection of microservices.

## 2. System Overview

### 2.1 Application components

**Next.js 14 App Router**
- Public website and reader experience.
- Creator and studio workspaces.
- Server-rendered public pages.
- Server-side application logic.
- Route handlers for appropriate API endpoints.
- Form actions and mutations using a consistent server-side pattern.
- Authentication-aware layouts and navigation.

**Supabase**
- PostgreSQL database.
- Authentication and session management.
- Row Level Security.
- Database migrations and constraints.
- Relational records for series, episodes, revisions, assets, memberships, publishing, and moderation.

**Cloudinary**
- Artwork storage and delivery.
- Image transformations and optimization.
- Media identifiers and delivery URLs.
- Controlled upload and asset-deletion workflows.

**Vercel**
- Next.js hosting and deployments.
- Environment-specific configuration.
- Scheduled invocation of publishing jobs where supported by the configured plan.
- Application logs and deployment diagnostics.

### 2.2 Request flow

A typical protected operation follows this flow:

1. The user submits an action through the application.
2. The server verifies the authenticated user.
3. The server validates input and loads the relevant resource.
4. Authorization is checked using server-side logic and database policies.
5. The operation is executed through the appropriate Supabase or Cloudinary integration.
6. The application returns a result and handles any required follow-up work.

The client must not be trusted to supply authoritative ownership, role, publication status, or moderation status.

## 3. Next.js Application Structure

Organize the application by route and business capability.

Proposed route groups:

- `(public)` — homepage, discovery, public series pages, creator profiles, studio profiles, and comic reading.
- `(auth)` — registration, login, account recovery, and related authentication screens.
- `(creator)` — personal creator dashboard and series workspaces.
- `(studio)` — studio dashboard, members, invitations, and settings.
- `(admin)` — restricted moderation and administrative interfaces.

Route groups organize the application but do not enforce authorization by themselves.

Use shared UI components for navigation, forms, feedback, loading states, and reusable editor controls. Keep domain-specific logic in clear modules rather than placing all business rules in page components.

Recommended logical modules:

- `auth`
- `profiles`
- `studios`
- `series`
- `collaboration`
- `episodes`
- `media`
- `publishing`
- `moderation`
- `discovery`
- `reader`
- `notifications`

These are logical boundaries, not a requirement to create a separate package for every module.

## 4. Authentication and Authorization

### 4.1 Authentication

Use Supabase Auth for user identity and sessions.

The Next.js integration must follow the supported server-side authentication pattern for the installed Supabase libraries. Use separate browser and server clients where appropriate, and correctly refresh authentication cookies according to the chosen integration.

Authentication establishes who the user is. It does not automatically grant access to a resource.

### 4.2 Authorization layers

Authorization should be enforced through complementary controls:

1. Server-side checks before privileged operations.
2. Supabase RLS policies for database access.
3. Database constraints for critical data integrity.
4. Restricted use of service-role credentials.
5. Appropriate Cloudinary upload and delivery controls.

Middleware may help redirect unauthenticated users, but it is not the sole authorization boundary.

### 4.3 Role categories

Keep these categories separate:

**Platform roles**
- Regular user.
- Moderator.
- Platform administrator.

**Studio roles**
- Studio owner.
- Studio administrator.
- Studio editor.
- Studio member.

**Series access roles**
- Owner.
- Editor.
- Contributor.
- Viewer.

**Creative credits**
- Writer.
- Artist.
- Letterer.
- Colorist.
- Editor.
- Other.

Creative credits do not grant access permissions.

### 4.4 Permission rules

- Series ownership belongs to exactly one user or one studio.
- Studio membership does not automatically grant access to every studio series.
- Explicit series access is required when studio roles do not already grant access under the documented policy.
- Accepted invitations establish the appropriate membership or access relationship.
- Leaving a studio removes access granted solely by studio membership.
- Independent series-level authorization may remain when it is valid and intended.
- Platform moderation privileges do not grant unrestricted creator-editing privileges.
- Access to private content for moderation must be authorized and auditable.

Use database functions or carefully structured policies where they simplify repeated membership and role checks. Avoid recursive RLS policy dependencies.

## 5. Database Architecture

Use PostgreSQL as the source of truth for application metadata, relationships, authorization-relevant records, and publication state.

### 5.1 Core entities

**Accounts**
- Supabase Auth identity.
- `profiles`
- `creator_profiles`

**Studios**
- `studios`
- `studio_members`
- `studio_invitations`

**Series and collaboration**
- `series`
- `series_members`
- `series_invitations`
- `contributor_credits`

**Episodes and content**
- `episodes`
- `episode_revisions`
- Format-specific revision content records.
- `media_assets`

**Publishing**
- Publication state records or equivalent fields.
- Scheduled publication jobs or scheduling records.
- Publication event history where required.

**Moderation**
- `reports`
- `moderation_cases`
- `moderation_actions`
- Restricted `audit_logs`

**Reader experience**
- `series_follows`
- `bookmarks`

Exact names and columns should be finalized in the data-model specification before implementation.

### 5.2 Series ownership

The `series` table contains:

- `owner_user_id`
- `owner_studio_id`

Exactly one owner must be assigned. Enforce this with a database constraint and appropriate foreign keys.

Avoid a generic polymorphic owner ID where a normal foreign key cannot verify the referenced record.

### 5.3 Episodes and revisions

An episode represents the logical episode. Each revision represents a specific version of its content.

The episode must distinguish:
- Its latest working revision.
- Its currently published revision, when one exists.

A draft revision must not overwrite the content currently served to readers.

A revision may be approved without being published, and a scheduled revision may be approved but not yet publicly available.

### 5.4 Comic content

Use relational content records for essential relationships and ordering.

Page-based content uses ordered page records. Vertical-scroll content uses ordered content blocks or equivalent records.

Both formats share the episode, revision, media, and publishing foundations.

Use JSON only for genuinely flexible format-specific properties. Do not put critical foreign-key relationships inside JSON documents.

### 5.5 Data integrity

Use:
- Foreign keys.
- Unique constraints.
- Check constraints.
- Appropriate indexes.
- Explicit status transitions.
- Transactions for operations that must succeed or fail together.

Potential integrity rules include:
- Exactly one series owner.
- Unique membership per user and target.
- Unique invitation tokens or secure token hashes.
- Valid revision ordering.
- Unique content positions within a revision where appropriate.
- Referential integrity for media assets.
- Valid publication-state transitions.

Critical rules should be enforced in PostgreSQL where practical, not solely in application code.

## 6. Media and Cloudinary

### 6.1 Responsibilities

Supabase stores media metadata and relationships. Cloudinary stores, transforms, and delivers image files.

The database should track information such as:
- Asset ID.
- Uploader.
- Cloudinary public identifier.
- Resource type.
- File format.
- Dimensions and size.
- Upload status.
- Relevant timestamps.
- Ownership and usage relationships.

### 6.2 Upload flow

1. The creator selects individual files or a batch.
2. The server verifies authentication and upload authorization.
3. File types, sizes, and expected formats are validated.
4. The application creates or authorizes the upload using an appropriate Cloudinary integration.
5. The file is uploaded.
6. The resulting Cloudinary identifier and validated metadata are recorded.
7. The asset becomes available for use only after its record is successfully established.

Use appropriately restricted signed uploads or server-mediated uploads. Never expose Cloudinary API secrets to the browser.

Batch uploads must handle partial failures, retries, and visible progress without silently losing the intended reading order.

### 6.3 Asset deletion

Removing an image from a draft must not automatically delete the underlying file.

Before deleting an asset:
- Verify that it is not referenced by a published revision.
- Verify that it is not referenced by another retained revision or authorized use.
- Apply retention and legal requirements.
- Perform deletion through a controlled workflow.
- Record consequential operations where appropriate.

Cloudinary and PostgreSQL cannot participate in one atomic transaction. Use explicit asset states and retryable cleanup operations to handle failures safely.

## 7. Publishing Architecture

### 7.1 Separate workflow from availability

Revision workflow and public availability are distinct concepts.

A revision can be drafted, submitted for review, approved, rejected, scheduled, or published according to the defined lifecycle.

Public availability determines which revision readers can access and whether that content is currently permitted to be public.

Do not let a draft edit implicitly change the published version.

### 7.2 Publication operation

A publishing operation must verify:

1. The user has permission to publish.
2. The revision belongs to the intended episode.
3. The revision satisfies required validation rules.
4. Any mandatory moderation requirements have been met.
5. The requested publication time and state are valid.

Then update the authoritative publication state in a transaction where possible.

Readers should resolve the currently published revision through a controlled server-side query or equivalent database operation. They must not select arbitrary unpublished revisions.

### 7.3 Scheduled publishing

Use a database-backed schedule as the authoritative record of pending releases.

A scheduled job should:
- Find due publication jobs.
- Recheck eligibility at execution time.
- Verify required approvals and permissions.
- Publish only eligible revisions.
- Record the result.
- Retry transient failures safely.
- Avoid duplicate publication events.

Scheduled publishing must be idempotent. Repeated execution must not publish multiple competing versions or bypass moderation.

Vercel Cron can invoke the processing endpoint, subject to configured platform limits. Protect the endpoint with a secret and process due jobs in bounded batches. If reliability requirements outgrow this approach, introduce a dedicated queue or worker later.

## 8. Moderation Architecture

Moderation is a platform-level responsibility separate from creator workflows.

### 8.1 Reports and cases

Store reports individually. Allow moderators to group related reports into moderation cases.

A report is an allegation, not proof of a violation.

### 8.2 Enforcement

Support proportionate actions such as:
- Warnings.
- Required changes.
- Temporary restrictions.
- Removal from public availability.
- Other documented actions appropriate to platform policy.

Urgent restrictions may be applied when justified by policy. All consequential actions should record the responsible actor, target, reason, timestamp, and relevant case.

### 8.3 Access control

Moderation interfaces must be restricted. Moderator access to private content must be purpose-limited and auditable.

Appeals and subsequent decisions should be represented without silently overwriting the original moderation record.

Do not make moderation decisions depend on client-side flags.

## 9. Notifications and Background Processing

Use a simple, database-backed notification system initially.

Recommended responsibilities:
- Persist in-app notifications.
- Record delivery attempts for essential emails where appropriate.
- Send invitation and important workflow emails.
- Process scheduled publications.
- Retry transient failures.
- Prevent duplicate execution through idempotency keys or equivalent constraints.

Background jobs must be observable and recoverable. A scheduled endpoint returning success does not by itself prove that every job completed successfully.

Avoid adding a dedicated queue infrastructure until measured needs justify it.

## 10. Search and Discovery

Start with PostgreSQL-backed search and structured metadata.

Support:
- Series titles and descriptions.
- Creator and studio names.
- Genres.
- Relevant series metadata.
- Pagination and basic filters.

Add suitable indexes and use PostgreSQL full-text search or other native search capabilities where appropriate.

Do not introduce an external search service solely in anticipation of future scale. Evaluate a dedicated service when actual search requirements justify it.

## 11. Security and Privacy

Required safeguards include:
- Server-side input validation.
- RLS policies for protected database operations.
- Least-privilege database and API access.
- Restricted service-role credentials.
- Secure invitation handling.
- Protected private media.
- Rate limits for sensitive endpoints.
- Secure upload validation.
- Safe error messages that do not expose secrets.
- Controlled administrative access.
- Audit logging for consequential actions.
- Data retention and deletion policies.

Do not assume that an unguessable URL alone makes private content secure.

Define how published artwork is delivered publicly and how drafts or restricted assets are protected. The selected Cloudinary delivery strategy must match those access requirements.

## 12. Testing Strategy

Prioritize automated tests for:
- Authentication and session handling.
- Ownership and role checks.
- RLS policy behavior.
- Studio membership and series access.
- Invitation acceptance and expiry.
- Draft isolation from published revisions.
- Scheduled publication and retry behavior.
- Moderation restrictions.
- Upload validation and asset deletion safeguards.

Add integration tests for the main reader, creator, and studio workflows.

Test critical permission rules using users with different roles, including unauthorized users. A successful UI test alone does not establish that the underlying data is protected.

## 13. Deployment and Environments

Use Vercel for deployment and Supabase for the managed database and authentication.

Maintain separate development and production configuration. Use preview deployments where practical without allowing them to modify production data accidentally.

Keep secrets in the appropriate environment configuration, never in source control.

Database schema changes must be versioned through migrations. Apply migrations in a deliberate order and verify them before production release.

Document:
- Required environment variables.
- Supabase project setup.
- Cloudinary configuration.
- Migration and seed procedures.
- Deployment procedure.
- Backup and recovery process.
- Operational troubleshooting steps.

## 14. Architectural Decisions Deferred

Do not prematurely commit to:
- Microservices.
- Dedicated message brokers.
- External search engines.
- Real-time collaboration infrastructure.
- Complex caching layers.
- Advanced analytics platforms.

Choose these only when a concrete product or operational requirement justifies the added complexity.

## 15. Architecture Acceptance Criteria

The architecture is ready for implementation when:
- Core entities and relationships are documented.
- Authorization boundaries are explicit.
- RLS and server-side enforcement responsibilities are clear.
- Media upload and deletion flows are defined.
- Revision and publication transitions are documented.
- Scheduled jobs are safe to retry.
- Moderation actions and private-content access are controlled.
- Required environment configuration and migrations are specified.
- Critical security and publishing tests are identified.

This document is the architecture baseline. Exact schema definitions and state-transition tables belong in the corresponding detailed specifications.