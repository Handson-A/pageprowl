-- ========================================================================
-- PageProwl Migration: 20261102010000_fix_studio_rls_recursion.sql
-- Description: Critical Supabase RLS recursion repair and security hardening.
--
-- Root Cause:
-- 1. Helper functions written in LANGUAGE sql were subject to PostgreSQL query
--    inlining. When inlined into table RLS policies on studio_members, PostgreSQL
--    detected cyclic subqueries (42P17: infinite recursion detected in policy
--    for relation "studio_members").
-- 2. By rewriting all permission helpers in LANGUAGE plpgsql with SECURITY DEFINER
--    and explicit search_path = public, pg_temp, PostgreSQL prevents query inlining
--    and executes the permission checks in their own execution context as superuser,
--    completely breaking the RLS recursion cycle.
-- 3. Removes all blanket "FOR ALL" policies on studio_members and separates them into
--    explicit SELECT, INSERT, UPDATE, and DELETE policies.
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Helper Functions with PL/pgSQL & SECURITY DEFINER
-- ------------------------------------------------------------------------

-- Drop any previous function signatures to avoid parameter naming collision errors
drop function if exists public.is_moderator(uuid) cascade;
drop function if exists public.is_studio_member(uuid, uuid) cascade;
drop function if exists public.has_studio_role(uuid, uuid, text[]) cascade;
drop function if exists public.is_series_authorized(uuid, uuid, text[]) cascade;

-- Platform moderator check
create or replace function public.is_moderator(p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_is_mod boolean;
begin
  if p_user_id is null then
    return false;
  end if;

  select exists (
    select 1 from public.profiles
    where id = p_user_id and role in ('moderator', 'admin')
  ) into v_is_mod;

  return coalesce(v_is_mod, false);
end;
$$;

-- Studio membership check (creator or member)
create or replace function public.is_studio_member(p_studio_id uuid, p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_is_member boolean;
begin
  if p_studio_id is null or p_user_id is null then
    return false;
  end if;

  select exists (
    select 1 from public.studio_members sm
    where sm.studio_id = p_studio_id and sm.user_id = p_user_id
  ) or exists (
    select 1 from public.studios s
    where s.id = p_studio_id and s.created_by = p_user_id
  ) into v_is_member;

  return coalesce(v_is_member, false);
end;
$$;

-- Studio specific role check
create or replace function public.has_studio_role(p_studio_id uuid, p_user_id uuid, p_required_roles text[])
returns boolean
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_has_role boolean;
begin
  if p_studio_id is null or p_user_id is null or p_required_roles is null then
    return false;
  end if;

  select exists (
    select 1 from public.studio_members sm
    where sm.studio_id = p_studio_id
      and sm.user_id = p_user_id
      and sm.role = any(p_required_roles)
  ) or (
    'owner' = any(p_required_roles) and exists (
      select 1 from public.studios s
      where s.id = p_studio_id and s.created_by = p_user_id
    )
  ) into v_has_role;

  return coalesce(v_has_role, false);
end;
$$;

-- Series authorization check (direct owner, series member, studio owner/admin, or platform moderator)
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

  -- 1. Direct owner of series
  select exists (
    select 1 from public.series s
    where s.id = p_series_id and s.owner_user_id = p_user_id
  ) into v_authorized;
  if v_authorized then return true; end if;

  -- 2. Explicit member of the series with accepted role
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

-- Grant execution permissions
revoke all on function public.is_moderator(uuid) from public;
grant execute on function public.is_moderator(uuid) to authenticated, anon;

revoke all on function public.is_studio_member(uuid, uuid) from public;
grant execute on function public.is_studio_member(uuid, uuid) to authenticated, anon;

revoke all on function public.has_studio_role(uuid, uuid, text[]) from public;
grant execute on function public.has_studio_role(uuid, uuid, text[]) to authenticated, anon;

revoke all on function public.is_series_authorized(uuid, uuid, text[]) from public;
grant execute on function public.is_series_authorized(uuid, uuid, text[]) to authenticated, anon;

-- ------------------------------------------------------------------------
-- 2. Non-Recursive RLS Policies on studio_members
-- ------------------------------------------------------------------------

alter table public.studio_members enable row level security;

drop policy if exists "Studio members are viewable by members and public" on public.studio_members;
drop policy if exists "Studio admins can manage members" on public.studio_members;
drop policy if exists "Studio members viewable by authorized users" on public.studio_members;
drop policy if exists "Studio admins can insert members" on public.studio_members;
drop policy if exists "Studio admins can update members" on public.studio_members;
drop policy if exists "Studio admins or members can delete memberships" on public.studio_members;

-- SELECT: Authenticated users can view their own membership rows or all members in studios they belong to.
create policy "Studio members viewable by authorized users"
  on public.studio_members for select
  using (
    auth.uid() is not null and (
      user_id = auth.uid() or
      public.is_studio_member(studio_id, auth.uid())
    )
  );

-- INSERT: Studio owners and admins can add new members.
create policy "Studio admins can insert members"
  on public.studio_members for insert
  with check (
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- UPDATE: Studio owners and admins can modify member roles.
create policy "Studio admins can update members"
  on public.studio_members for update
  using (
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  )
  with check (
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- DELETE: Studio owners and admins can remove members; members can leave.
create policy "Studio admins or members can delete memberships"
  on public.studio_members for delete
  using (
    user_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- ------------------------------------------------------------------------
-- 3. Hardened RLS Policies on studios
-- ------------------------------------------------------------------------

alter table public.studios enable row level security;

drop policy if exists "Public studios are viewable by everyone" on public.studios;
drop policy if exists "Authenticated users can create studios" on public.studios;
drop policy if exists "Studio owners and admins can update studios" on public.studios;
drop policy if exists "Studio owners can delete studios" on public.studios;

create policy "Public studios are viewable by everyone"
  on public.studios for select
  using (true);

create policy "Authenticated users can create studios"
  on public.studios for insert
  with check (auth.uid() = created_by);

create policy "Studio owners and admins can update studios"
  on public.studios for update
  using (
    public.has_studio_role(id, auth.uid(), array['owner', 'admin'])
  )
  with check (
    public.has_studio_role(id, auth.uid(), array['owner', 'admin'])
  );

create policy "Studio owners can delete studios"
  on public.studios for delete
  using (
    public.has_studio_role(id, auth.uid(), array['owner'])
  );

-- ------------------------------------------------------------------------
-- 4. Hardened RLS Policies on studio_invitations
-- ------------------------------------------------------------------------

alter table public.studio_invitations enable row level security;

drop policy if exists "Studio invitations viewable by authorized members" on public.studio_invitations;
drop policy if exists "Studio admins can create invitations" on public.studio_invitations;
drop policy if exists "Studio admins can update invitations" on public.studio_invitations;
drop policy if exists "Studio admins can delete invitations" on public.studio_invitations;

create policy "Studio invitations viewable by authorized members"
  on public.studio_invitations for select
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

create policy "Studio admins can create invitations"
  on public.studio_invitations for insert
  with check (
    inviter_id = auth.uid() and
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

create policy "Studio admins can update invitations"
  on public.studio_invitations for update
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

create policy "Studio admins can delete invitations"
  on public.studio_invitations for delete
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- ------------------------------------------------------------------------
-- 5. Hardened RLS Policies on series
-- ------------------------------------------------------------------------

alter table public.series enable row level security;

drop policy if exists "Public series are viewable by everyone" on public.series;
drop policy if exists "Authenticated users can create series" on public.series;
drop policy if exists "Series owners and editors can update series" on public.series;

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
      public.has_studio_role(owner_studio_id, auth.uid(), array['owner', 'admin'])
    )
  );

create policy "Series owners and editors can update series"
  on public.series for update
  using (
    public.is_series_authorized(id, auth.uid(), array['owner', 'editor'])
  );

-- ------------------------------------------------------------------------
-- 6. Hardened RLS Policies on series_members
-- ------------------------------------------------------------------------

alter table public.series_members enable row level security;

drop policy if exists "Series members viewable by members and moderators" on public.series_members;
drop policy if exists "Series owners can manage series members" on public.series_members;
drop policy if exists "Series members viewable by authorized users" on public.series_members;
drop policy if exists "Series owners can insert series members" on public.series_members;
drop policy if exists "Series owners can update series members" on public.series_members;
drop policy if exists "Series owners can delete series members" on public.series_members;

create policy "Series members viewable by authorized users"
  on public.series_members for select
  using (
    user_id = auth.uid() or
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
  );

create policy "Series owners can insert series members"
  on public.series_members for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner'])
  );

create policy "Series owners can update series members"
  on public.series_members for update
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner'])
  );

create policy "Series owners can delete series members"
  on public.series_members for delete
  using (
    user_id = auth.uid() or
    public.is_series_authorized(series_id, auth.uid(), array['owner'])
  );

-- ------------------------------------------------------------------------
-- 7. Hardened RLS Policies on contributor_credits
-- ------------------------------------------------------------------------

alter table public.contributor_credits enable row level security;

drop policy if exists "Credits are viewable by everyone" on public.contributor_credits;
drop policy if exists "Series owners and editors can manage credits" on public.contributor_credits;
drop policy if exists "Series owners and editors can insert credits" on public.contributor_credits;
drop policy if exists "Series owners and editors can update credits" on public.contributor_credits;
drop policy if exists "Series owners and editors can delete credits" on public.contributor_credits;

create policy "Credits are viewable by everyone"
  on public.contributor_credits for select
  using (true);

create policy "Series owners and editors can insert credits"
  on public.contributor_credits for insert
  with check (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series owners and editors can update credits"
  on public.contributor_credits for update
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

create policy "Series owners and editors can delete credits"
  on public.contributor_credits for delete
  using (
    public.is_series_authorized(series_id, auth.uid(), array['owner', 'editor'])
  );

-- ------------------------------------------------------------------------
-- 8. Hardened RLS Policies on Review Comments
-- ------------------------------------------------------------------------

alter table public.review_comments enable row level security;

drop policy if exists "Series members can view review comments" on public.review_comments;
drop policy if exists "Authorized members can view review comments" on public.review_comments;
drop policy if exists "Series collaborators can insert review comments" on public.review_comments;
drop policy if exists "Comment authors can update their comments" on public.review_comments;
drop policy if exists "Users can update their own comments" on public.review_comments;
drop policy if exists "Comment authors and series owners can delete comments" on public.review_comments;
drop policy if exists "Users or studio admins can delete comments" on public.review_comments;

create policy "Series members can view review comments"
  on public.review_comments for select
  using (
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor', 'viewer'])
    )
  );

create policy "Series collaborators can insert review comments"
  on public.review_comments for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )
  );

create policy "Comment authors can update their comments"
  on public.review_comments for update
  using (auth.uid() = user_id);

create policy "Comment authors and series owners can delete comments"
  on public.review_comments for delete
  using (
    auth.uid() = user_id or
    exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner'])
    )
  );

