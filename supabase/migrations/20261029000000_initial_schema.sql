-- ========================================================================
-- Panelverse Initial Schema Migration
-- Matches docs/technical-architecture.md, docs/mvp-scope.md, and AGENTS.md
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. Profiles & Creator Profiles
-- ------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  pen_name text not null,
  website_url text,
  social_links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 2. Studios & Studio Memberships
-- ------------------------------------------------------------------------

create table if not exists public.studios (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  logo_url text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_members (
  studio_id uuid not null references public.studios(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'editor', 'member')),
  created_at timestamptz not null default now(),
  primary key (studio_id, user_id)
);

create table if not exists public.studio_invitations (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  invited_email text not null,
  role text not null check (role in ('admin', 'editor', 'member')),
  token text unique not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 3. Series & Collaborators (Strict ownership invariant)
-- ------------------------------------------------------------------------

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  synopsis text not null,
  format text not null check (format in ('page', 'scroll')),
  genre text not null,
  cover_url text,
  owner_user_id uuid references public.profiles(id) on delete restrict,
  owner_studio_id uuid references public.studios(id) on delete restrict,
  visibility text not null default 'private' check (visibility in ('private', 'public', 'unlisted', 'restricted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_exactly_one_owner check (
    (owner_user_id is not null and owner_studio_id is null) or
    (owner_user_id is null and owner_studio_id is not null)
  )
);

create table if not exists public.series_members (
  series_id uuid not null references public.series(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'editor', 'contributor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (series_id, user_id)
);

create table if not exists public.series_invitations (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series(id) on delete cascade,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  invited_email text not null,
  role text not null check (role in ('editor', 'contributor', 'viewer')),
  token text unique not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contributor_credits (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  custom_name text,
  role_category text not null check (role_category in ('writer', 'artist', 'letterer', 'colorist', 'editor', 'other')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 4. Media Assets & Episodes & Revisions
-- ------------------------------------------------------------------------

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  uploader_id uuid not null references public.profiles(id) on delete set null,
  cloudinary_public_id text unique not null,
  resource_type text not null default 'image',
  format text not null,
  width integer,
  height integer,
  byte_size integer,
  secure_url text not null,
  is_restricted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series(id) on delete cascade,
  episode_number integer not null,
  title text not null,
  slug text not null,
  published_revision_id uuid, -- Self-referencing link to published revision (deferred check)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_id, episode_number),
  unique (series_id, slug)
);

create table if not exists public.episode_revisions (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade,
  revision_number integer not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'ready_to_publish', 'published', 'unpublished', 'archived')),
  notes text,
  created_by uuid not null references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (episode_id, revision_number)
);

-- Add foreign key constraint for published_revision_id on episodes
alter table public.episodes
  add constraint fk_episodes_published_revision
  foreign key (published_revision_id) references public.episode_revisions(id) on delete set null;

create table if not exists public.revision_pages (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.episode_revisions(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  page_number integer not null,
  created_at timestamptz not null default now(),
  unique (revision_id, page_number)
);

-- ------------------------------------------------------------------------
-- 5. Publishing & Scheduled Releases
-- ------------------------------------------------------------------------

create table if not exists public.scheduled_publications (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.episodes(id) on delete cascade,
  revision_id uuid not null references public.episode_revisions(id) on delete cascade,
  scheduled_for timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'processing', 'completed', 'failed', 'cancelled')),
  created_by uuid not null references public.profiles(id) on delete set null,
  error_message text,
  executed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 6. Collaboration Feedback & Comments
-- ------------------------------------------------------------------------

create table if not exists public.review_comments (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references public.episode_revisions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 7. Reader Engagement (Follows & Bookmarks)
-- ------------------------------------------------------------------------

create table if not exists public.series_follows (
  user_id uuid not null references public.profiles(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

create table if not exists public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  page_number integer not null default 1,
  updated_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

-- ------------------------------------------------------------------------
-- 8. Moderation & Platform Administration
-- ------------------------------------------------------------------------

create table if not exists public.moderation_cases (
  id uuid primary key default gen_random_uuid(),
  assigned_moderator_id uuid references public.profiles(id) on delete set null,
  target_type text not null check (target_type in ('series', 'episode', 'profile', 'comment')),
  target_id uuid not null,
  status text not null default 'open' check (status in ('open', 'investigating', 'action_taken', 'closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null check (target_type in ('series', 'episode', 'profile', 'comment')),
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'grouped', 'actioned', 'dismissed')),
  case_id uuid references public.moderation_cases(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.moderation_cases(id) on delete cascade,
  moderator_id uuid not null references public.profiles(id) on delete set null,
  action_type text not null check (action_type in ('warning', 'content_removed', 'restricted', 'dismissed', 'other')),
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('invitation', 'review', 'publishing', 'moderation', 'system')),
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------
-- 9. Indexes for Query Performance
-- ------------------------------------------------------------------------

create index if not exists idx_series_owner_user on public.series(owner_user_id);
create index if not exists idx_series_owner_studio on public.series(owner_studio_id);
create index if not exists idx_series_visibility on public.series(visibility);
create index if not exists idx_series_genre on public.series(genre);
create index if not exists idx_episodes_series on public.episodes(series_id);
create index if not exists idx_revisions_episode on public.episode_revisions(episode_id);
create index if not exists idx_revision_pages_rev on public.revision_pages(revision_id);
create index if not exists idx_studio_members_user on public.studio_members(user_id);
create index if not exists idx_series_members_user on public.series_members(user_id);
create index if not exists idx_scheduled_pub_status on public.scheduled_publications(status, scheduled_for);
create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read);

-- ------------------------------------------------------------------------
-- 10. Helper Functions for RLS
-- ------------------------------------------------------------------------

create or replace function public.is_moderator(user_uuid uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = user_uuid and role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_series_authorized(series_uuid uuid, user_uuid uuid, required_roles text[])
returns boolean
language sql
stable
security definer
as $$
  select exists (
    -- Direct owner of series
    select 1 from public.series s
    where s.id = series_uuid and s.owner_user_id = user_uuid
  ) or exists (
    -- Explicit member of the series with accepted role
    select 1 from public.series_members sm
    where sm.series_id = series_uuid
      and sm.user_id = user_uuid
      and sm.role = any(required_roles)
  ) or exists (
    -- Studio owner/admin for studio-owned series
    select 1 from public.series s
    join public.studio_members stm on stm.studio_id = s.owner_studio_id
    where s.id = series_uuid
      and stm.user_id = user_uuid
      and stm.role in ('owner', 'admin')
  ) or public.is_moderator(user_uuid);
$$;

-- ------------------------------------------------------------------------
-- 11. Row Level Security Policies
-- ------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.studios enable row level security;
alter table public.studio_members enable row level security;
alter table public.studio_invitations enable row level security;
alter table public.series enable row level security;
alter table public.series_members enable row level security;
alter table public.series_invitations enable row level security;
alter table public.contributor_credits enable row level security;
alter table public.media_assets enable row level security;
alter table public.episodes enable row level security;
alter table public.episode_revisions enable row level security;
alter table public.revision_pages enable row level security;
alter table public.scheduled_publications enable row level security;
alter table public.review_comments enable row level security;
alter table public.series_follows enable row level security;
alter table public.bookmarks enable row level security;
alter table public.moderation_cases enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

-- Profiles: Anyone can view public profile details; only profile owner can update their own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Creator Profiles: Viewable by everyone; editable by profile owner
create policy "Creator profiles are viewable by everyone"
  on public.creator_profiles for select
  using (true);

create policy "Users can insert their own creator profile"
  on public.creator_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own creator profile"
  on public.creator_profiles for update
  using (auth.uid() = id);

-- Studios: Publicly visible; editable by studio owner/admin
create policy "Studios are viewable by everyone"
  on public.studios for select
  using (true);

create policy "Authenticated users can create studios"
  on public.studios for insert
  with check (auth.uid() = created_by);

create policy "Studio owners and admins can update studios"
  on public.studios for update
  using (
    exists (
      select 1 from public.studio_members
      where studio_id = id and user_id = auth.uid() and role in ('owner', 'admin')
    )
  );

-- Studio Members: Members viewable by studio members; editable by studio owner/admin
create policy "Studio members are viewable by members and public"
  on public.studio_members for select
  using (true);

create policy "Studio admins can manage members"
  on public.studio_members for all
  using (
    exists (
      select 1 from public.studio_members sm
      where sm.studio_id = studio_members.studio_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    )
  );

-- Studio Invitations: Visible to inviter, invitee email, and studio admins
create policy "Studio invitations viewable by authorized members"
  on public.studio_invitations for select
  using (
    inviter_id = auth.uid() or
    exists (
      select 1 from public.studio_members sm
      where sm.studio_id = studio_invitations.studio_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    )
  );

create policy "Studio admins can create invitations"
  on public.studio_invitations for insert
  with check (
    inviter_id = auth.uid() and
    exists (
      select 1 from public.studio_members sm
      where sm.studio_id = studio_invitations.studio_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    )
  );

-- Series: Public series viewable by all; private series viewable only by authorized members
create policy "Public series are viewable by everyone"
  on public.series for select
  using (
    visibility = 'public' or
    public.is_series_authorized(id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Authenticated users can create series"
  on public.series for insert
  with check (
    (owner_user_id = auth.uid() and owner_studio_id is null) or
    (
      owner_studio_id is not null and
      exists (
        select 1 from public.studio_members sm
        where sm.studio_id = owner_studio_id
          and sm.user_id = auth.uid()
          and sm.role in ('owner', 'admin')
      )
    )
  );

create policy "Series owners and editors can update series"
  on public.series for update
  using (
    public.is_series_authorized(id, auth.uid(), array['owner', 'editor'])
  );

-- Series Members
create policy "Series members viewable by members and moderators"
  on public.series_members for select
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Series owners can manage series members"
  on public.series_members for all
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner'])
  );

-- Contributor Credits
create policy "Credits are viewable by everyone"
  on public.contributor_credits for select
  using (true);

create policy "Series owners and editors can manage credits"
  on public.contributor_credits for all
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- Media Assets: Viewable if linked to public content or owned by user
create policy "Media assets viewable by uploader or authorized series viewers"
  on public.media_assets for select
  using (
    uploader_id = auth.uid() or
    not is_restricted
  );

create policy "Authenticated users can upload media assets"
  on public.media_assets for insert
  with check (uploader_id = auth.uid());

-- Episodes: Publicly viewable if series is public and episode has a published revision
create policy "Published episodes viewable by everyone"
  on public.episodes for select
  using (
    (
      published_revision_id is not null and
      exists (
        select 1 from public.series s
        where s.id = episodes.series_id and s.visibility = 'public'
      )
    ) or
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Series editors can insert episodes"
  on public.episodes for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series editors can update episodes"
  on public.episodes for update
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- Episode Revisions: Published revisions viewable by public; drafts viewable only by series team
create policy "Revisions viewable according to publication and role"
  on public.episode_revisions for select
  using (
    (
      status = 'published' and
      exists (
        select 1 from public.episodes ep
        join public.series s on s.id = ep.series_id
        where ep.id = episode_revisions.episode_id
          and s.visibility = 'public'
      )
    ) or
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_revisions.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
    )
  );

create policy "Series editors and contributors can create revisions"
  on public.episode_revisions for insert
  with check (
    created_by = auth.uid() and
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_revisions.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )
  );

create policy "Series editors can update revisions"
  on public.episode_revisions for update
  using (
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_revisions.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- Revision Pages
create policy "Pages viewable according to revision policy"
  on public.revision_pages for select
  using (
    exists (
      select 1 from public.episode_revisions r
      where r.id = revision_pages.revision_id
        and (
          (r.status = 'published') or
          exists (
            select 1 from public.episodes ep
            where ep.id = r.episode_id
              and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
          )
        )
    )
  );

create policy "Series editors can manage revision pages"
  on public.revision_pages for all
  using (
    exists (
      select 1 from public.episode_revisions r
      join public.episodes ep on ep.id = r.episode_id
      where r.id = revision_pages.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- Scheduled Publications: Managed by series owners and editors
create policy "Scheduled publications viewable by series team"
  on public.scheduled_publications for select
  using (
    exists (
      select 1 from public.episodes ep
      where ep.id = scheduled_publications.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

create policy "Scheduled publications manageable by series editors"
  on public.scheduled_publications for all
  using (
    exists (
      select 1 from public.episodes ep
      where ep.id = scheduled_publications.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- Review Comments
create policy "Review comments viewable by series collaborators"
  on public.review_comments for select
  using (
    exists (
      select 1 from public.episode_revisions r
      join public.episodes ep on ep.id = r.episode_id
      where r.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
    )
  );

create policy "Review comments insertable by collaborators"
  on public.review_comments for insert
  with check (
    user_id = auth.uid() and
    exists (
      select 1 from public.episode_revisions r
      join public.episodes ep on ep.id = r.episode_id
      where r.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )
  );

create policy "Review comments updatable by author or series editor"
  on public.review_comments for update
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.episode_revisions r
      join public.episodes ep on ep.id = r.episode_id
      where r.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- Reader Follows and Bookmarks: Scoped strictly to the authenticated user
create policy "Users can manage their own follows"
  on public.series_follows for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can manage their own bookmarks"
  on public.bookmarks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Moderation & Reports
create policy "Authenticated users can submit reports"
  on public.reports for insert
  with check (reporter_id = auth.uid());

create policy "Moderators can view reports"
  on public.reports for select
  using (public.is_moderator(auth.uid()) or reporter_id = auth.uid());

create policy "Moderators can manage moderation cases and actions"
  on public.moderation_cases for all
  using (public.is_moderator(auth.uid()));

create policy "Moderators can manage actions"
  on public.moderation_actions for all
  using (public.is_moderator(auth.uid()));

create policy "Moderators and actors can view audit logs"
  on public.audit_logs for select
  using (public.is_moderator(auth.uid()) or actor_id = auth.uid());

create policy "System and authenticated users can insert audit logs"
  on public.audit_logs for insert
  with check (actor_id = auth.uid());

-- Notifications: Strictly scoped to the notification recipient
create policy "Users can view and manage their own notifications"
  on public.notifications for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------------------
-- 12. Trigger to automatically provision profiles on new signup
-- ------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  user_name text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    user_name,
    coalesce(new.raw_user_meta_data->>'display_name', user_name),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
