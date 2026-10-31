import type { Database, ReviewCommentStatus } from "../../types/database.ts";

export type ReviewCommentRow = Database["public"]["Tables"]["review_comments"]["Row"];

export interface CommentWithAuthor extends ReviewCommentRow {
  author?: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  } | null;
  mentions?: {
    user_id: string;
    username: string;
    display_name: string;
  }[];
  replies?: CommentWithAuthor[];
}

/**
 * Pure helper to extract valid @mentions from text.
 * Matches patterns like @alex or @creator_99.
 */
export function extractMentionUsernames(text: string): string[] {
  if (!text) return [];
  const regex = /@([a-zA-Z0-9_-]+)/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      matches.add(match[1].toLowerCase());
    }
  }

  return Array.from(matches);
}
