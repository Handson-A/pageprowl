-- ========================================================================
-- PageProwl Phase 7 Migration: Reader Accounts and Publishing
-- Implements Reader Library, Reading Progress Sync, Notification Preferences,
-- Release History, and Scheduled Publishing Calendar Infrastructure
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Extend Episode Status Check Constraint
-- ------------------------------------------------------------------------
-- Distinctly distinguishes: draft, in_production, in_review, revisions_required,
-- approved, scheduled, published, and unpublished.

alter table public.episodes drop constraint if exists episodes_status_check;
alter table public.episodes
  add constraint episodes_status_check
  check (status in ('draft', 'in_production', 'in_review', 'revisions_required', 'approved', 'scheduled', 'published', 'unpublished'));

-- ------------------------------------------------------------------------
-- 2. Extend Scheduled Publications Table
-- ------------------------------------------------------------------------
-- Add series_id link for faster studio publishing calendar and release aggregation

alter table public.scheduled_publications
  add column if not exists series_id uuid references public.series(id) on delete cascade;

create index if not exists idx_scheduled_pub_series on public.scheduled_publications(series_id, scheduled_for);
create index if not exists idx_scheduled_pub_due on public.scheduled_publications(status, scheduled_for)
  where status = 'scheduled';

-- ------------------------------------------------------------------------
-- 3. Release Events (Durable Publishing Lifecycle History)
-- ------------------------------------------------------------------------
-- Preserves durable history of meaningful publishing events:
-- submitted_for_approval, approved, rejected, resubmitted, scheduled,
-- rescheduled, schedule_cancelled, published, unpublished, republished

create table if not exists public.release_events (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  revision_id uuid references public.episode_revisions(id) on delete set null,
  event_type text not null check (
    event_type in (
      'submitted_for_approval',
      'approved',
      'rejected',
      'resubmitted',
      'scheduled',
      'rescheduled',
      'schedule_cancelled',
      'published',
      'unpublished',
      'republished'
    )
  ),
  actor_id uuid references public.profiles(id) on delete set null,
  scheduled_for timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_release_events_episode on public.release_events(episode_id, created_at desc);
create index if not exists idx_release_events_series on public.release_events(series_id, created_at desc);
create index if not exists idx_release_events_type on public.release_events(event_type);

-- ------------------------------------------------------------------------
-- 4. Reader Library (Personal Saved Series for Readers)
-- ------------------------------------------------------------------------

create table if not exists public.user_libraries (
  user_id uuid not null references public.profiles(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

create index if not exists idx_user_libraries_user on public.user_libraries(user_id, created_at desc);
create index if not exists idx_user_libraries_series on public.user_libraries(series_id);

-- ------------------------------------------------------------------------
-- 5. Extend Series Follows with Granular Notification Toggle
-- ------------------------------------------------------------------------

alter table public.series_follows
  add column if not exists notify_new_episodes boolean not null default true;

-- ------------------------------------------------------------------------
-- 6. Reader Notification Preferences
-- ------------------------------------------------------------------------

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notifications_enabled boolean not null default true,
  notify_new_episodes boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 7. Reading Progress & Synchronized History
-- ------------------------------------------------------------------------
-- Stores reader progress, last read page, scroll offset percentage,
-- completion status, and chronological activity timestamps.

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  page_number integer not null default 1,
  scroll_offset_percent numeric(5,2) not null default 0,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, episode_id)
);

create index if not exists idx_reading_progress_user_recent on public.reading_progress(user_id, last_read_at desc);
create index if not exists idx_reading_progress_series on public.reading_progress(user_id, series_id);
create index if not exists idx_reading_progress_episode on public.reading_progress(episode_id);

-- ------------------------------------------------------------------------
-- 8. Extend Notification Types
-- ------------------------------------------------------------------------

alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('invitation', 'review', 'publishing', 'moderation', 'system', 'task', 'mention', 'approval', 'revision', 'new_episode'));

-- ------------------------------------------------------------------------
-- 9. Row Level Security Policies
-- ------------------------------------------------------------------------

alter table public.release_events enable row level security;
alter table public.user_libraries enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.reading_progress enable row level security;

-- Release Events: Viewable by authorized series team members; manageable by editors/owners
drop policy if exists "Authorized series collaborators can view release events" on public.release_events;
create policy "Authorized series collaborators can view release events"
  on public.release_events for select
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

drop policy if exists "Authorized series editors can insert release events" on public.release_events;
create policy "Authorized series editors can insert release events"
  on public.release_events for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- User Libraries: Strictly scoped to the authenticated reader
drop policy if exists "Users can manage their own library" on public.user_libraries;
create policy "Users can manage their own library"
  on public.user_libraries for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Notification Preferences: Strictly scoped to the authenticated user
drop policy if exists "Users can manage their own notification preferences" on public.notification_preferences;
create policy "Users can manage their own notification preferences"
  on public.notification_preferences for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Reading Progress: Strictly scoped to the authenticated reader
drop policy if exists "Users can manage their own reading progress" on public.reading_progress;
create policy "Users can manage their own reading progress"
  on public.reading_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
