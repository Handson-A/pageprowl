-- ========================================================================
-- Panelverse Phase 4 Migration: Core Comic Management
-- Enhances series, episodes, and media authorization policies and indexing
-- ========================================================================

-- 1. Add cover_asset_id to series table for structured media asset tracking
alter table public.series
  add column if not exists cover_asset_id uuid references public.media_assets(id) on delete set null;

create index if not exists idx_series_cover_asset on public.series(cover_asset_id);

-- 2. Add performance index on episodes and revision pages
create index if not exists idx_episodes_series_number on public.episodes(series_id, episode_number);
create index if not exists idx_revision_pages_order on public.revision_pages(revision_id, page_number);

-- 3. Row Level Security Policies for Core Comic Management

-- Series Deletion: Only series owners and moderators can delete series
drop policy if exists "Series owners can delete series" on public.series;
create policy "Series owners can delete series"
  on public.series for delete
  using (
    public.is_series_authorized(id, auth.uid(), array['owner'])
  );

-- Episode Deletion: Series owners and editors can delete episodes
drop policy if exists "Series editors can delete episodes" on public.episodes;
create policy "Series editors can delete episodes"
  on public.episodes for delete
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- Revision Deletion: Only unpublished draft revisions can be deleted by editors
drop policy if exists "Series editors can delete draft revisions" on public.episode_revisions;
create policy "Series editors can delete draft revisions"
  on public.episode_revisions for delete
  using (
    status <> 'published' and
    exists (
      select 1 from public.episodes ep
      where ep.id = episode_revisions.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor'])
    )
  );

-- Media Assets: Uploaders can update and remove their media assets
drop policy if exists "Uploaders can delete their own media assets" on public.media_assets;
create policy "Uploaders can delete their own media assets"
  on public.media_assets for delete
  using (uploader_id = auth.uid());

drop policy if exists "Uploaders can update their own media assets" on public.media_assets;
create policy "Uploaders can update their own media assets"
  on public.media_assets for update
  using (uploader_id = auth.uid());
