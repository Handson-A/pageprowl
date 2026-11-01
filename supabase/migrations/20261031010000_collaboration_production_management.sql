-- ========================================================================
-- PageProwl Phase 5 Migration: Collaboration and Production Management
-- Implements Tasks, Production Workflows, Review Requests, Mentions, Activity & Notifications
-- ========================================================================

-- ------------------------------------------------------------------------
-- 1. Helper Function: Studio Membership Verification
-- ------------------------------------------------------------------------

create or replace function public.is_studio_member(studio_uuid uuid, user_uuid uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.studio_members
    where studio_id = studio_uuid and user_id = user_uuid
  ) or exists (
    select 1 from public.studios
    where id = studio_uuid and created_by = user_uuid
  );
$$;

-- ------------------------------------------------------------------------
-- 2. Tasks Table & 1-Level Subtask Nesting Restriction
-- ------------------------------------------------------------------------

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  series_id uuid references public.series(id) on delete cascade,
  episode_id uuid references public.episodes(id) on delete cascade,
  parent_task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'todo', 'in_progress', 'in_review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references public.profiles(id) on delete set null,
  due_date timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Database trigger to strictly enforce max 1 level of subtask nesting
create or replace function public.check_task_nesting_depth()
returns trigger
language plpgsql
as $$
begin
  if new.parent_task_id is not null then
    if exists (
      select 1 from public.tasks
      where id = new.parent_task_id and parent_task_id is not null
    ) then
      raise exception 'Subtasks cannot have nested subtasks (maximum 1 level of nesting allowed)';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_check_task_nesting on public.tasks;
create trigger trg_check_task_nesting
  before insert or update on public.tasks
  for each row
  execute function public.check_task_nesting_depth();

-- Task Collaborators Table (optional additional participants beyond primary assignee)
create table if not exists public.task_collaborators (
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, user_id)
);

-- ------------------------------------------------------------------------
-- 3. Episode Production Workflow Enhancement
-- ------------------------------------------------------------------------

-- Add production status column to episodes table (Draft -> In Production -> In Review -> Revisions Required -> Approved -> Published)
alter table public.episodes
  add column if not exists status text not null default 'draft'
  check (status in ('draft', 'in_production', 'in_review', 'revisions_required', 'approved', 'published'));

-- Expand episode_revisions status to include Phase 5 workflow states
alter table public.episode_revisions drop constraint if exists episode_revisions_status_check;
alter table public.episode_revisions
  add constraint episode_revisions_status_check
  check (status in ('draft', 'in_production', 'in_review', 'revisions_required', 'approved', 'ready_to_publish', 'published', 'unpublished', 'archived'));

-- ------------------------------------------------------------------------
-- 4. Review Requests Table (Independent persistent entity for multiple rounds)
-- ------------------------------------------------------------------------

create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references public.studios(id) on delete cascade,
  series_id uuid not null references public.series(id) on delete cascade,
  episode_id uuid not null references public.episodes(id) on delete cascade,
  revision_id uuid references public.episode_revisions(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  round integer not null default 1,
  status text not null default 'pending' check (status in ('pending', 'in_review', 'revisions_requested', 'approved', 'closed')),
  feedback text,
  outcome text check (outcome in ('approved', 'revisions_requested', 'dismissed', null)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ------------------------------------------------------------------------
-- 5. Comments, Replies & Mentions Enhancement
-- ------------------------------------------------------------------------

-- Make revision_id nullable in review_comments to allow tasks/episodes/review requests comments
alter table public.review_comments alter column revision_id drop not null;

-- Add polymorphic resource links and reply threading
alter table public.review_comments
  add column if not exists studio_id uuid references public.studios(id) on delete cascade,
  add column if not exists episode_id uuid references public.episodes(id) on delete cascade,
  add column if not exists task_id uuid references public.tasks(id) on delete cascade,
  add column if not exists review_request_id uuid references public.review_requests(id) on delete cascade,
  add column if not exists parent_comment_id uuid references public.review_comments(id) on delete cascade,
  add column if not exists updated_at timestamptz not null default now();

-- Comment Mentions table
create table if not exists public.comment_mentions (
  comment_id uuid not null references public.review_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- ------------------------------------------------------------------------
-- 6. Activity & Notifications Enhancement
-- ------------------------------------------------------------------------

-- Add studio_id to audit_logs for workspace-level activity feeds
alter table public.audit_logs
  add column if not exists studio_id uuid references public.studios(id) on delete cascade;

-- Add studio_id and expanded types to notifications
alter table public.notifications
  add column if not exists studio_id uuid references public.studios(id) on delete cascade;

alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications
  add constraint notifications_type_check
  check (type in ('invitation', 'review', 'publishing', 'moderation', 'system', 'task', 'mention', 'approval', 'revision'));

-- ------------------------------------------------------------------------
-- 7. Query Performance Indexes
-- ------------------------------------------------------------------------

create index if not exists idx_tasks_studio on public.tasks(studio_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_parent on public.tasks(parent_task_id);
create index if not exists idx_tasks_series on public.tasks(series_id);
create index if not exists idx_tasks_episode on public.tasks(episode_id);
create index if not exists idx_tasks_due_date on public.tasks(due_date);

create index if not exists idx_review_requests_studio on public.review_requests(studio_id);
create index if not exists idx_review_requests_episode on public.review_requests(episode_id);
create index if not exists idx_review_requests_reviewer on public.review_requests(reviewer_id);
create index if not exists idx_review_requests_status on public.review_requests(status);

create index if not exists idx_review_comments_task on public.review_comments(task_id);
create index if not exists idx_review_comments_episode on public.review_comments(episode_id);
create index if not exists idx_review_comments_request on public.review_comments(review_request_id);
create index if not exists idx_review_comments_parent on public.review_comments(parent_comment_id);

create index if not exists idx_audit_logs_studio on public.audit_logs(studio_id, created_at desc);

-- ------------------------------------------------------------------------
-- 8. Row Level Security Policies
-- ------------------------------------------------------------------------

alter table public.tasks enable row level security;
alter table public.task_collaborators enable row level security;
alter table public.review_requests enable row level security;
alter table public.comment_mentions enable row level security;

-- Tasks: Workspace members can view tasks for their studio
create policy "Studio members can view studio tasks"
  on public.tasks for select
  using (
    public.is_studio_member(studio_id, auth.uid())
  );

create policy "Studio members can insert studio tasks"
  on public.tasks for insert
  with check (
    public.is_studio_member(studio_id, auth.uid()) and
    auth.uid() = created_by
  );

create policy "Studio members can update studio tasks"
  on public.tasks for update
  using (
    public.is_studio_member(studio_id, auth.uid())
  );

create policy "Studio owners, admins, or task creators can delete tasks"
  on public.tasks for delete
  using (
    auth.uid() = created_by or
    exists (
      select 1 from public.studio_members sm
      where sm.studio_id = tasks.studio_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    )
  );

-- Task Collaborators: Studio members can view and manage
create policy "Studio members can view task collaborators"
  on public.task_collaborators for select
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_collaborators.task_id
        and public.is_studio_member(t.studio_id, auth.uid())
    )
  );

create policy "Studio members can manage task collaborators"
  on public.task_collaborators for all
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_collaborators.task_id
        and public.is_studio_member(t.studio_id, auth.uid())
    )
  );

-- Review Requests: Studio members can view, request, and review
create policy "Studio members can view review requests"
  on public.review_requests for select
  using (
    public.is_studio_member(studio_id, auth.uid())
  );

create policy "Studio members can create review requests"
  on public.review_requests for insert
  with check (
    public.is_studio_member(studio_id, auth.uid()) and
    auth.uid() = requester_id
  );

create policy "Reviewers and authorized members can update review requests"
  on public.review_requests for update
  using (
    public.is_studio_member(studio_id, auth.uid()) and
    (
      auth.uid() = reviewer_id or
      auth.uid() = requester_id or
      exists (
        select 1 from public.studio_members sm
        where sm.studio_id = review_requests.studio_id
          and sm.user_id = auth.uid()
          and sm.role in ('owner', 'admin', 'editor')
      )
    )
  );

-- Review Comments: Polymorphic comments visible to studio members or series authorized
drop policy if exists "Series members can view review comments" on public.review_comments;
create policy "Authorized members can view review comments"
  on public.review_comments for select
  using (
    (studio_id is not null and public.is_studio_member(studio_id, auth.uid())) or
    (revision_id is not null and exists (
      select 1 from public.episode_revisions er
      join public.episodes ep on ep.id = er.episode_id
      where er.id = review_comments.revision_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )) or
    (episode_id is not null and exists (
      select 1 from public.episodes ep
      where ep.id = review_comments.episode_id
        and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
    )) or
    (task_id is not null and exists (
      select 1 from public.tasks t
      where t.id = review_comments.task_id
        and public.is_studio_member(t.studio_id, auth.uid())
    ))
  );

drop policy if exists "Series contributors can create review comments" on public.review_comments;
create policy "Authorized members can create review comments"
  on public.review_comments for insert
  with check (
    auth.uid() = user_id and (
      (studio_id is not null and public.is_studio_member(studio_id, auth.uid())) or
      (revision_id is not null and exists (
        select 1 from public.episode_revisions er
        join public.episodes ep on ep.id = er.episode_id
        where er.id = review_comments.revision_id
          and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
      )) or
      (episode_id is not null and exists (
        select 1 from public.episodes ep
        where ep.id = review_comments.episode_id
          and public.is_series_authorized(ep.series_id, auth.uid(), array['owner', 'editor', 'contributor'])
      )) or
      (task_id is not null and exists (
        select 1 from public.tasks t
        where t.id = review_comments.task_id
          and public.is_studio_member(t.studio_id, auth.uid())
      ))
    )
  );

create policy "Users can update their own comments"
  on public.review_comments for update
  using (auth.uid() = user_id);

create policy "Users or studio admins can delete comments"
  on public.review_comments for delete
  using (
    auth.uid() = user_id or
    (studio_id is not null and exists (
      select 1 from public.studio_members sm
      where sm.studio_id = review_comments.studio_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    ))
  );

-- Comment Mentions: Viewable by studio members
create policy "Studio members can view comment mentions"
  on public.comment_mentions for select
  using (
    exists (
      select 1 from public.review_comments rc
      where rc.id = comment_mentions.comment_id
        and (
          (rc.studio_id is not null and public.is_studio_member(rc.studio_id, auth.uid())) or
          auth.uid() = comment_mentions.user_id
        )
    )
  );

create policy "Comment authors can insert mentions"
  on public.comment_mentions for insert
  with check (
    exists (
      select 1 from public.review_comments rc
      where rc.id = comment_mentions.comment_id
        and rc.user_id = auth.uid()
    )
  );

-- Audit logs: Viewable by studio members or actors
create policy "Studio members can view studio audit logs"
  on public.audit_logs for select
  using (
    (studio_id is not null and public.is_studio_member(studio_id, auth.uid())) or
    actor_id = auth.uid()
  );
