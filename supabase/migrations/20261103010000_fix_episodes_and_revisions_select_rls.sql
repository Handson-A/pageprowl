-- ========================================================================
-- Migration: Fix Episodes and Revisions SELECT RLS Non-Recursive Policies
-- Date: 2026-11-03
-- Purpose:
--   Prevent recursive subquery failures and ensure creators always see
--   their draft episodes and revisions across series workspaces.
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Public Helper: is_series_authorized (Direct evaluation)
-- ------------------------------------------------------------------------
create or replace function public.is_series_authorized(p_series_id uuid, p_user_id uuid, p_required_roles text[])
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_authorized boolean;
begin
  if p_series_id is null or p_user_id is null or p_required_roles is null then
    return false;
  end if;

  -- 1. Direct individual owner of series
  select exists (
    select 1 from public.series s
    where s.id = p_series_id and s.owner_user_id = p_user_id
  ) into v_authorized;
  if v_authorized then return true; end if;

  -- 2. Explicit member of the series with required role
  select exists (
    select 1 from public.series_members sm
    where sm.series_id = p_series_id
      and sm.user_id = p_user_id
      and sm.role = any(p_required_roles)
  ) into v_authorized;
  if v_authorized then return true; end if;

  -- 3. Studio owner or admin for studio-owned series
  select exists (
    select 1 from public.series s
    where s.id = p_series_id
      and s.owner_studio_id is not null
      and public.has_studio_role(s.owner_studio_id, p_user_id, array['owner', 'admin'])
  ) into v_authorized;
  if v_authorized then return true; end if;

  -- 4. Platform moderator or admin
  return public.is_moderator(p_user_id);
end;
$$;

-- ------------------------------------------------------------------------
-- 2. Episodes Table SELECT Policy
-- ------------------------------------------------------------------------
alter table public.episodes enable row level security;

drop policy if exists "Published episodes viewable by everyone" on public.episodes;
drop policy if exists "Episodes viewable by everyone or collaborators" on public.episodes;

create policy "Episodes viewable by everyone or collaborators"
  on public.episodes for select
  using (
    -- 1. Published episode on a public series
    (
      published_revision_id is not null and
      exists (
        select 1 from public.series s
        where s.id = episodes.series_id and s.visibility = 'public'
      )
    ) or
    -- 2. Direct creator or studio member of the series
    exists (
      select 1 from public.series s
      where s.id = episodes.series_id and (
        s.owner_user_id = auth.uid() or
        (
          s.owner_studio_id is not null and
          public.has_studio_role(s.owner_studio_id, auth.uid(), array['owner', 'admin', 'editor', 'member'])
        )
      )
    ) or
    -- 3. Explicit series collaborator
    exists (
      select 1 from public.series_members sm
      where sm.series_id = episodes.series_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'editor', 'contributor', 'viewer')
    ) or
    -- 4. Moderator / Admin
    public.is_moderator(auth.uid())
  );

-- ------------------------------------------------------------------------
-- 3. Episode Revisions Table SELECT Policy
-- ------------------------------------------------------------------------
alter table public.episode_revisions enable row level security;

drop policy if exists "Revisions viewable according to publication and role" on public.episode_revisions;
drop policy if exists "Revisions viewable by collaborators or public" on public.episode_revisions;

create policy "Revisions viewable by collaborators or public"
  on public.episode_revisions for select
  using (
    -- 1. Published revision on public series
    (
      status = 'published' and
      exists (
        select 1 from public.episodes ep
        join public.series s on s.id = ep.series_id
        where ep.id = episode_revisions.episode_id
          and s.visibility = 'public'
      )
    ) or
    -- 2. Series owner or studio member
    exists (
      select 1 from public.episodes ep
      join public.series s on s.id = ep.series_id
      where ep.id = episode_revisions.episode_id
        and (
          s.owner_user_id = auth.uid() or
          (
            s.owner_studio_id is not null and
            public.has_studio_role(s.owner_studio_id, auth.uid(), array['owner', 'admin', 'editor', 'member'])
          )
        )
    ) or
    -- 3. Explicit series collaborator
    exists (
      select 1 from public.episodes ep
      join public.series_members sm on sm.series_id = ep.series_id
      where ep.id = episode_revisions.episode_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'editor', 'contributor', 'viewer')
    ) or
    -- 4. Author who created the revision
    created_by = auth.uid() or
    -- 5. Moderator
    public.is_moderator(auth.uid())
  );
