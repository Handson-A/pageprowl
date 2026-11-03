-- ========================================================================
-- Migration: Fix Series Table SELECT RLS Non-Recursive Evaluation
-- Date: 2026-11-03
-- Purpose:
--   During an INSERT ... RETURNING query on a private studio-owned series,
--   evaluating public.is_series_authorized(id, ...) executed a subquery
--   against public.series for the uncommitted candidate row, causing
--   PostgreSQL to reject the insert with:
--     "new row violates row-level security policy for table 'series'".
--   This migration replaces that recursive subquery with direct row-level
--   checks against owner_user_id and owner_studio_id.
-- ========================================================================

alter table public.series enable row level security;

drop policy if exists "Public series are viewable by everyone" on public.series;
drop policy if exists "Series viewable according to publication and role" on public.series;

create policy "Series viewable according to publication and role"
  on public.series for select
  using (
    visibility = 'public' or
    owner_user_id = auth.uid() or
    (
      owner_studio_id is not null and
      public.has_studio_role(owner_studio_id, auth.uid(), array['owner', 'admin', 'editor', 'member'])
    ) or
    exists (
      select 1 from public.series_members sm
      where sm.series_id = series.id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'editor', 'contributor', 'viewer')
    ) or
    public.is_moderator(auth.uid())
  );

drop policy if exists "Authenticated users can create series" on public.series;
create policy "Authenticated users can create series"
  on public.series for insert
  with check (
    (owner_user_id = auth.uid() and owner_studio_id is null) or
    (
      owner_studio_id is not null and
      public.has_studio_role(owner_studio_id, auth.uid(), array['owner', 'admin'])
    )
  );
