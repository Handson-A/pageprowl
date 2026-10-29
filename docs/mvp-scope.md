# Panelverse — MVP Scope
**Product:** Panelverse  
**Purpose:** Define the minimum viable release, its boundaries, and the features that must work before launch.

## 1. Product Objective

Panelverse is a web-based collaborative comic publishing platform connecting readers, independent creators, and creative studios.

The MVP must demonstrate the complete core product experience:

- Readers can discover and read published comics.
- Independent creators can create, manage, and publish comic series.
- Studios can organize members, manage studio-owned series, and collaborate.
- Contributors can work together through explicit, role-based permissions.
- Platform moderators can enforce content policies.

The MVP should deliver a coherent end-to-end experience rather than an exhaustive set of features.

## 2. MVP Principles

1. Reader and creator experiences are both first-class product concerns.
2. A single account can participate in personal and multiple studio contexts.
3. A series can be owned by an individual creator or a studio.
4. Studio membership does not automatically grant access to every studio series.
5. Permissions must be enforced on the server and through Supabase Row Level Security where applicable.
6. Published content must remain stable while creators prepare revisions.
7. Both page-based and vertical-scroll comics must be supported at launch.
8. Moderation and security are foundational requirements, not optional future enhancements.
9. Future extensibility must not become an excuse to overengineer the first release.

## 3. Included in the MVP

### 3.1 Accounts and profiles

- User registration, authentication, and sign-out.
- Personal profile management.
- Public creator profiles.
- Studio profiles and identities.
- Appropriate account and access controls.

One authenticated account can act as a reader, creator, contributor, studio member, or authorized moderator according to its permissions.

### 3.2 Public reader experience

- Public homepage.
- Series discovery and browsing.
- Search and genre-based filtering.
- Public series pages and episode lists.
- Public episode reading without mandatory account registration.
- Public creator and studio profiles.
- Following series.
- Bookmarking series or other explicitly defined reading items.

Advanced recommendation algorithms, personalized feeds, and synchronized reading progress are outside the initial scope.

### 3.3 Creator workspace

- Creator dashboard and series overview.
- Series creation and management.
- Draft and published episode management.
- Episode ordering.
- Contributor invitations and access management.
- Series-level and episode-level creative credits.
- Artwork and media asset management.
- Publication status visibility.
- Scheduled release management.
- Basic operational activity and actionable reminders.

### 3.4 Comic formats and editor

Both comic formats must be available at launch.

**Page-based comics**
- Upload and arrange individual pages.
- Reorder, replace, and remove pages.
- Preview the reading experience.

**Vertical-scroll comics**
- Assemble an ordered sequence of artwork or supported content blocks.
- Reorder, replace, and remove content items.
- Preview the continuous reading experience.

**Shared editor capabilities**
- Individual and batch artwork uploads.
- Upload validation and error reporting.
- Draft saving.
- Content ordering.
- Episode preview.
- Revision preparation and management.
- Basic episode metadata.

The editor is a comic publishing and assembly tool. Drawing tools, advanced panel composition, and professional-grade illustration capabilities are not required for the MVP.

### 3.5 Studios and collaboration

- Studio creation and profile management.
- Studio membership and invitations.
- Predefined studio roles.
- Studio-owned series.
- Series-level collaboration for independent creators and studio projects.
- Predefined series access roles.
- Invitations with explicit acceptance.
- Draft comments and review feedback.
- Separate creative credits and access permissions.
- Studio and personal workspace switching.

Custom permission builders and real-time collaborative editing are deferred.

### 3.6 Publishing and revisions

- Episode drafts.
- Revision history.
- Explicit publication of revisions.
- Immediate and scheduled publishing.
- Publication eligibility checks.
- Moderation requirements where applicable.
- Stable published versions while new revisions are prepared.
- Unpublishing distinct from permanent deletion.
- Authorized creator access to retained revisions.

Scheduled publication must not bypass mandatory review or other publication requirements.

### 3.7 Moderation and platform governance

The MVP must provide a usable moderation workflow that includes:

- User reports.
- Moderation cases that can group related reports.
- Restricted moderator interfaces.
- Case review and documented decisions.
- Proportionate enforcement actions.
- Removal of content from public availability when required.
- Warnings and requests for changes where appropriate.
- Temporary restrictions where justified.
- Appeals or review of moderation decisions.
- Auditable records of consequential moderation actions.

Moderator authority is separate from creator ownership and publishing permissions. Access to private content for moderation must be authorized and auditable.

Advanced automated content detection and moderation analytics are deferred.

### 3.8 Notifications

**Recommended MVP baseline:** in-app notifications and essential transactional emails.

Examples include invitations, important publishing events, review feedback, and moderation decisions.

A configurable notification-preferences system, digest emails, and sophisticated real-time notification experiences are deferred.

### 3.9 Security and reliability

Required foundations include:

- Server-side authentication and authorization.
- Supabase Row Level Security where applicable.
- Input validation and secure upload handling.
- Controlled Cloudinary asset management.
- Protection of private drafts and unpublished content.
- Audit records for consequential administrative actions.
- Safe handling of failed uploads and publication jobs.
- Environment-specific configuration and secret management.
- Database backups and recovery procedures.
- Automated tests for critical authorization and publishing rules.
- Production error monitoring and operational logging.

These requirements apply even when the corresponding interface is simple.

## 4. Deferred Features

The following are outside the initial MVP unless later evidence justifies promoting an item into scope:

- Paid chapters, subscriptions, and creator monetization.
- Creator revenue sharing and payment processing.
- Reader comments, ratings, and community discussions.
- Advanced recommendation algorithms.
- Trending rankings and personalized discovery.
- Advanced creator analytics.
- Synchronized reading-progress tracking.
- Custom studio permission systems.
- Real-time collaborative editing.
- Advanced browser-based drawing and layout tools.
- Advanced automated moderation.
- Sophisticated notification preferences and digest systems.
- Complex volume and season management beyond what basic series organization requires.

The data model may accommodate future capabilities when doing so is straightforward and justified, but deferred features must not become hidden MVP dependencies.

## 5. Explicitly Out of Scope

The MVP is not intended to be:

- A professional digital illustration application.
- A complete social network for comic fans.
- A monetization platform with payment and revenue-sharing infrastructure.
- A real-time multiplayer editor.
- A fully automated content moderation system.

## 6. Data and Ownership Principles

The implementation must preserve these distinctions:

- User identity versus creator profile.
- Individual ownership versus studio ownership.
- Studio membership versus series access.
- Access roles versus creative specialties and credits.
- Logical episodes versus episode revisions.
- Revision workflow versus public availability.
- Media asset records versus the actual files stored in Cloudinary.
- Unpublishing versus permanent deletion.
- User reports versus moderation cases.

The relational schema must enforce critical relationships and constraints wherever practical.

## 7. MVP Acceptance Criteria

The MVP is ready for release only when the following end-to-end workflows work reliably.

### Reader workflow
- A visitor can discover a public series.
- The visitor can open its episode list and read a published episode without an account.
- An authenticated reader can follow a series and manage bookmarks.

### Independent creator workflow
- A creator can register, create a series, upload artwork, assemble an episode, and save a draft.
- The creator can prepare and publish a revision.
- A published episode remains readable while a separate revision is being prepared.
- The creator can schedule a release and see its status.

### Studio workflow
- An authorized user can create a studio and invite members.
- Accepted invitations establish the appropriate membership or access records.
- Studio roles and series permissions are enforced.
- Authorized collaborators can work on a series without being granted ownership automatically.

### Moderation workflow
- A reader can submit a report.
- A moderator can review the report, manage a case, and take an authorized action.
- Restricted content becomes unavailable publicly when required.
- Consequential actions are recorded and appropriately access-controlled.

### Security workflow
- Unauthorized users cannot access private drafts or restricted media through direct requests.
- Users cannot perform privileged actions simply by manipulating client-side requests.
- Supabase policies and server-side checks enforce the intended access boundaries.
- Critical publication, upload, and authorization failures are handled safely.

### Deployment workflow
- The application can be deployed to Vercel using environment-specific configuration.
- Supabase migrations and required security policies can be applied reproducibly.
- Cloudinary uploads and delivery work in the deployed environment.
- Critical workflows have automated tests and documented recovery procedures.

## 8. Scope Management

Any proposed feature must be evaluated against three questions:

1. Is it required to complete one of the core reader, creator, studio, or moderation workflows?
2. Is it necessary for security, legal compliance, data integrity, or operational reliability?
3. Can the MVP deliver the intended outcome with a simpler implementation?

Features that are not necessary for launch should be deferred rather than allowed to expand the release indefinitely.

## 9. Remaining Recommendations to Resolve During Architecture

The following are implementation details rather than reasons to reopen the product scope:

- Exact search technology and ranking behavior.
- Exact notification delivery and retry mechanisms.
- The minimum creator dashboard layout.
- Upload limits and accepted media specifications.
- Detailed moderation state transitions.
- Background job and scheduling implementation.
- Final database schema and migration sequence.

These will be documented in the technical architecture and implementation plan.