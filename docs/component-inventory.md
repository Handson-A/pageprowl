# Panelverse Reusable Component Inventory

This is a reusable UI inventory, not a mandate to create a component for every row. Reuse existing components when they meet the requirements; avoid premature abstraction.

## 1. Application shells and navigation

| Component | Responsibilities | Key variants/states |
|---|---|---|
| `PublicLayout` | Public header, content frame, footer | desktop/mobile |
| `PublicHeader` | Public navigation and creator/auth entry | default, compact/mobile |
| `CreatorLayout` | Authenticated workspace shell | desktop, tablet, mobile |
| `CreatorSidebar` | Workspace navigation and active location | expanded, collapsed, drawer |
| `WorkspaceHeader` | Breadcrumb/context, title, primary action | series, episode |
| `ReaderLayout` | Dark reading environment | vertical, paginated |
| `MobileNavigationDrawer` | Compact navigation on small screens | open, closed, focus-managed |
| `Breadcrumbs` | Context and parent navigation | responsive truncation |

## 2. Design primitives

| Component | Responsibilities | Key states |
|---|---|---|
| `Button` | Primary and secondary actions | default, hover, focus, active, disabled, loading |
| `IconButton` | Compact named action | same button states; accessible label required |
| `TextField` | Labeled text entry | default, focused, invalid, disabled |
| `TextArea` | Multi-line entry | default, focused, invalid, disabled |
| `Select` | Supported single/multi selection | default, open, invalid, disabled |
| `Checkbox` / `RadioGroup` | Form selection | selected, unselected, disabled |
| `FormField` | Label, control, hint, error | default, invalid |
| `StatusBadge` | Lifecycle/status label | only statuses defined by the model |
| `Avatar` | Creator/reviewer identity | image, fallback, unavailable |
| `Tooltip` | Short supplemental guidance | keyboard and pointer accessible |
| `Dialog` | Confirmation/focused task | open, closed, submitting |
| `Sheet` | Mobile filters or focused compact panel | open, closed |
| `Toast` / `InlineNotice` | Success, warning, error, info feedback | semantic variants |
| `Skeleton` | Loading placeholder | content-shaped |
| `EmptyState` | Explain missing content and allowed next action | compact, page-level |
| `ErrorState` | Explain failure and recovery | inline, page-level |
| `NotFoundState` | Safe unavailable/not-found presentation | public, creator |
| `PermissionState` | Access unavailable | generic safe message |
| `ConfirmActionDialog` | Confirm consequential action | cancel, confirm, pending |

## 3. Discovery and public content

| Component | Responsibilities | Key variants/states |
|---|---|---|
| `FeaturedSeries` | Prominent story-led feature | populated, unavailable |
| `SeriesCard` | Cover, title, creator, approved metadata | grid, compact/list |
| `SeriesGrid` | Responsive collection of series cards | loading, results, empty |
| `SeriesMetadata` | Display supported public metadata | compact, full |
| `SearchBar` | Browse query entry | idle, submitting, clearable |
| `FilterPanel` | Filters supported by real data | desktop panel, mobile sheet |
| `AppliedFilterChips` | Visible/removable active filters | empty, populated |
| `SortControl` | Supported sort choices | selected, disabled |
| `EpisodeList` | Ordered episode list | public, creator |
| `EpisodeListItem` | Episode number/title/thumbnail/date/status | public, creator |
| `CreatorAttribution` | Creator identity and link if available | compact, full |
| `ArtworkFallback` | Missing cover/page image fallback | cover, thumbnail, page |

## 4. Creator workspace

| Component | Responsibilities | Key variants/states |
|---|---|---|
| `DashboardSection` | Group actionable dashboard content | populated, empty, loading |
| `ProjectList` | Current user's accessible series/projects | compact, full |
| `TaskSummary` | Pending permitted work | pending, none, error |
| `SeriesHeader` | Series identity and allowed actions | view, edit if in scope |
| `WorkspaceTabs` | Contextual workspace sections | series, episode |
| `EpisodeHeader` | Episode identity and status | draft/other defined states |
| `ProductionPanel` | Chosen editor/upload workflow only | idle, working, error |
| `UploadProgress` | Progress feedback if supported by upload contract | idle, uploading, success, failure |
| `PreviewPanel` | Reader-like preview | loading, ready, unavailable |
| `ReviewThread` | Contextual feedback only to agreed scope | empty, active, resolved if supported |
| `ReviewItem` | Feedback author, text, state, allowed actions | readable, actionable |
| `PublishPanel` | Readiness, status, publish action | blocked, ready, publishing, published, error |
| `PublishConfirmation` | Consequential publish confirmation | ready, submitting |
| `PermissionGuard` | UX gating based on known permission state | allowed, denied/loading |

## 5. Reader components

| Component | Responsibilities | Key variants/states |
|---|---|---|
| `ReaderToolbar` | Minimal context-aware reader controls | visible, compact |
| `ReaderProgress` | Progress if reliable and in scope | current/total, unavailable |
| `VerticalEpisodeContent` | Ordered continuous artwork | loading, populated, asset error |
| `PaginatedEpisodeContent` | One page at a time | first, middle, last, loading |
| `PageNavigation` | Previous/next page | disabled edges, pending transition |
| `EpisodeNavigation` | Previous/next episode or series return | available, unavailable |
| `ReaderSettings` | Only agreed reading settings | closed, open |
| `EpisodeEndPanel` | Episode completion and next-step links | next available, end of series |

## 6. Rules for component implementation

- Use the same semantic tokens across components; avoid per-page ad hoc colors.
- Components must not bypass server authorization.
- Prefer composition over a large component with many unrelated booleans.
- Keep variants tied to actual product states.
- Every interactive component needs keyboard behavior and a visible focus state.
- Every asynchronous action needs a clear pending and failure behavior.
- Keep data-fetching and mutation ownership consistent with the existing architecture.
- Do not add a component for a feature that is not part of the canonical MVP.
