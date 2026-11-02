-- ========================================================================
-- PageProwl Migration: 20261101020000_episode_text_content.sql
-- Description: Adds text_content column to episode_revisions for text-based episodes (web novels, written fiction).
-- Preserves complete backward compatibility with image-based comic episodes.
-- ========================================================================

alter table public.episode_revisions
  add column if not exists text_content text;

comment on column public.episode_revisions.text_content is
  'Narrative written story content for text-based episodes. When populated, the episode is rendered by the text reader. Null for image-based comics.';
