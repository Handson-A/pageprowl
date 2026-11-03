-- ========================================================================
-- Migration: Restore Episode and Publishing RLS Policies
-- Date: 2026-11-02
-- Purpose:
--   Migration 20261102010000 dropped public.is_series_authorized with CASCADE,
--   which inadvertently dropped all dependent RLS policies on:
--     - public.episodes
--     - public.episode_revisions
--     - public.revision_pages
--     - public.scheduled_publications
--     - public.release_events
--   This migration restores all those policies using the hardened,
--   non-recursive public.is_series_authorized helper.
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Table: public.episodes
-- ------------------------------------------------------------------------
alter table public.episodes enable row level security;

drop policy if exists "Published episodes viewable by everyone" on public.episodes;
drop policy if exists "Series editors can insert episodes" on public.episodes;
drop policy if exists "Series editors can update episodes" on public.episodes;
drop policy if exists "Series editors can delete episodes" on public.episodes;

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
  )
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series editors can delete episodes"
  on public.episodes for delete
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- ------------------------------------------------------------------------
-- 2. Table: public.episode_revisions
-- ------------------------------------------------------------------------
alter table public.episode_revisions enable row level security;

drop policy if exists "Revisions viewable according to publication and role" on public.episode_revisions;
drop policy if exists "Team can create draft revisions" on public.episode_revisions;
drop policy if exists "Team can update draft revisions" on public.episode_revisions;
drop policy if exists "Series editors can delete draft revisions" on public.episode_revisions;

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

create policy "Team can create draft revisions"
  on public.episode_revisions for insert
  with check (
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )
  );

create policy "Team can update draft revisions"
  on public.episode_revisions for update
  using (
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

create policy "Series editors can delete draft revisions"
  on public.episode_revisions for delete
  using (
    status = 'draft' and
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_revisions.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- ------------------------------------------------------------------------
-- 3. Table: public.revision_pages
-- ------------------------------------------------------------------------
alter table public.revision_pages enable row level security;

drop policy if exists "Pages viewable according to revision visibility" on public.revision_pages;
drop policy if exists "Editors can insert revision pages" on public.revision_pages;
drop policy if exists "Editors can update revision pages" on public.revision_pages;
drop policy if exists "Editors can delete revision pages" on public.revision_pages;

create policy "Pages viewable according to revision visibility"
  on public.revision_pages for select
  using (
    exists (
      select 1 from public.episode_revisions er
      where er.id = revision_pages.revision_id
        and (
          er.status = 'published' or
          exists (
            select 1 from public.episodes ep
            where ep.id = er.episode_id
              and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
          )
        )
    )
  );

create policy "Editors can insert revision pages"
  on public.revision_pages for insert
  with check (
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = revision_id
        and er.status in ('draft', 'in_production', 'revisions_required')
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

create policy "Editors can update revision pages"
  on public.revision_pages for update
  using (
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = revision_id
        and er.status in ('draft', 'in_production', 'revisions_required')
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

create policy "Editors can delete revision pages"
  on public.revision_pages for delete
  using (
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = revision_pages.revision_id
        and er.status in ('draft', 'in_production', 'revisions_required')
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- ------------------------------------------------------------------------
-- 4. Table: public.scheduled_publications
-- ------------------------------------------------------------------------
alter table public.scheduled_publications enable row level security;

drop policy if exists "Authorized series members can view scheduled releases" on public.scheduled_publications;
drop policy if exists "Series editors can schedule publications" on public.scheduled_publications;
drop policy if exists "Series editors can update scheduled publications" on public.scheduled_publications;
drop policy if exists "Series editors can delete scheduled publications" on public.scheduled_publications;

create policy "Authorized series members can view scheduled releases"
  on public.scheduled_publications for select
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Series editors can schedule publications"
  on public.scheduled_publications for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series editors can update scheduled publications"
  on public.scheduled_publications for update
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series editors can delete scheduled publications"
  on public.scheduled_publications for delete
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- ------------------------------------------------------------------------
-- 5. Table: public.release_events
-- ------------------------------------------------------------------------
alter table public.release_events enable row level security;

drop policy if exists "Authorized series collaborators can view release events" on public.release_events;
drop policy if exists "Authorized series editors can insert release events" on public.release_events;

create policy "Authorized series collaborators can view release events"
  on public.release_events for select
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Authorized series editors can insert release events"
  on public.release_events for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );
