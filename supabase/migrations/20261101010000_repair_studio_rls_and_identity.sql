-- ========================================================================
-- PageProwl Migration: 20261101010000_repair_studio_rls_and_identity.sql
-- Description: Critical Supabase RLS recursion repair and security hardening.
--
-- Replaces:
-- 1. "Studio admins can manage members" on public.studio_members (faulty FOR ALL policy causing 42P17 recursion)
-- 2. "Studio members are viewable by members and public" on public.studio_members (overly permissive USING (true))
-- 3. Inline recursive subqueries across public.studios, public.studio_invitations, public.series,
--    public.tasks, public.review_requests, and public.review_comments.
-- 4. Hardens public.is_studio_member, public.is_series_authorized, and public.is_moderator with safe search_path.
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Helper Functions with Explicit search_path and Security Definer
-- ------------------------------------------------------------------------

-- Verify whether a user holds an authorized role in a given studio
create or replace function public.has_studio_role(studio_uuid uuid, user_uuid uuid, required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when studio_uuid is null or user_uuid is null or required_roles is null then false
    else (
      exists (
        select 1 from public.studio_members sm
        where sm.studio_id = studio_uuid
          and sm.user_id = user_uuid
          and sm.role = any(required_roles)
      ) or (
        'owner' = any(required_roles) and exists (
          select 1 from public.studios s
          where s.id = studio_uuid and s.created_by = user_uuid
        )
      )
    )
  end;
$$;

-- Verify whether a user is any member or creator of a given studio
create or replace function public.is_studio_member(studio_uuid uuid, user_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when studio_uuid is null or user_uuid is null then false
    else (
      exists (
        select 1 from public.studio_members sm
        where sm.studio_id = studio_uuid and sm.user_id = user_uuid
      ) or exists (
        select 1 from public.studios s
        where s.id = studio_uuid and s.created_by = user_uuid
      )
    )
  end;
$$;

-- Verify platform moderator or admin
create or replace function public.is_moderator(user_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when user_uuid is null then false
    else exists (
      select 1 from public.profiles
      where id = user_uuid and role in ('moderator', 'admin')
    )
  end;
$$;

-- Verify series authorization without inline recursion
create or replace function public.is_series_authorized(series_uuid uuid, user_uuid uuid, required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case
    when series_uuid is null or user_uuid is null or required_roles is null then false
    else (
      exists (
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
        where s.id = series_uuid
          and s.owner_studio_id is not null
          and public.has_studio_role(s.owner_studio_id, user_uuid, array['owner', 'admin'])
      ) or public.is_moderator(user_uuid)
    )
  end;
$$;

-- Restrict function execution privileges
revoke all on function public.has_studio_role(uuid, uuid, text[]) from public;
grant execute on function public.has_studio_role(uuid, uuid, text[]) to authenticated, anon;

revoke all on function public.is_studio_member(uuid, uuid) from public;
grant execute on function public.is_studio_member(uuid, uuid) to authenticated, anon;

revoke all on function public.is_moderator(uuid) from public;
grant execute on function public.is_moderator(uuid) to authenticated, anon;

revoke all on function public.is_series_authorized(uuid, uuid, text[]) from public;
grant execute on function public.is_series_authorized(uuid, uuid, text[]) to authenticated, anon;

-- ------------------------------------------------------------------------
-- 2. Non-Recursive RLS Policies on studio_members
-- ------------------------------------------------------------------------

-- Drop old faulty policies
drop policy if exists "Studio members are viewable by members and public" on public.studio_members;
drop policy if exists "Studio admins can manage members" on public.studio_members;
drop policy if exists "Studio members viewable by authorized users" on public.studio_members;
drop policy if exists "Studio admins can insert members" on public.studio_members;
drop policy if exists "Studio admins can update members" on public.studio_members;
drop policy if exists "Studio admins or members can delete memberships" on public.studio_members;

-- SELECT: Authenticated users can view their own membership rows or all members in studios they belong to.
-- Prevents unauthenticated scraping while eliminating recursion.
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

drop policy if exists "Studio owners and admins can update studios" on public.studios;
create policy "Studio owners and admins can update studios"
  on public.studios for update
  using (
    public.has_studio_role(id, auth.uid(), array['owner', 'admin'])
  )
  with check (
    public.has_studio_role(id, auth.uid(), array['owner', 'admin'])
  );

drop policy if exists "Studio owners can delete studios" on public.studios;
create policy "Studio owners can delete studios"
  on public.studios for delete
  using (
    public.has_studio_role(id, auth.uid(), array['owner'])
  );

-- ------------------------------------------------------------------------
-- 4. Hardened RLS Policies on studio_invitations
-- ------------------------------------------------------------------------

drop policy if exists "Studio invitations viewable by authorized members" on public.studio_invitations;
create policy "Studio invitations viewable by authorized members"
  on public.studio_invitations for select
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

drop policy if exists "Studio admins can create invitations" on public.studio_invitations;
create policy "Studio admins can create invitations"
  on public.studio_invitations for insert
  with check (
    inviter_id = auth.uid() and
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

drop policy if exists "Studio admins can update invitations" on public.studio_invitations;
create policy "Studio admins can update invitations"
  on public.studio_invitations for update
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

drop policy if exists "Studio admins can delete invitations" on public.studio_invitations;
create policy "Studio admins can delete invitations"
  on public.studio_invitations for delete
  using (
    inviter_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- ------------------------------------------------------------------------
-- 5. Hardened RLS Policy on series Insertion
-- ------------------------------------------------------------------------

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

-- ------------------------------------------------------------------------
-- 6. Hardened Collaboration Policies
-- ------------------------------------------------------------------------

-- Tasks Deletion
drop policy if exists "Studio owners, admins, or task creators can delete tasks" on public.tasks;
create policy "Studio owners, admins, or task creators can delete tasks"
  on public.tasks for delete
  using (
    creator_id = auth.uid() or
    public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin'])
  );

-- Review Requests Update
drop policy if exists "Reviewers and authorized members can update review requests" on public.review_requests;
create policy "Reviewers and authorized members can update review requests"
  on public.review_requests for update
  using (
    requester_id = auth.uid() or
    reviewer_id = auth.uid() or
    (studio_id is not null and public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin']))
  );

-- Review Comments Deletion
drop policy if exists "Users or studio admins can delete comments" on public.review_comments;
create policy "Users or studio admins can delete comments"
  on public.review_comments for delete
  using (
    user_id = auth.uid() or
    (studio_id is not null and public.has_studio_role(studio_id, auth.uid(), array['owner', 'admin']))
  );
