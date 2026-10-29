export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PlatformRole = "user" | "moderator" | "admin";
export type StudioRole = "owner" | "admin" | "editor" | "member";
export type SeriesRole = "owner" | "editor" | "contributor" | "viewer";
export type ComicFormat = "page" | "scroll";
export type SeriesVisibility = "private" | "public" | "unlisted" | "restricted";
export type ContributorRoleCategory =
  | "writer"
  | "artist"
  | "letterer"
  | "colorist"
  | "editor"
  | "other";
export type RevisionStatus =
  | "draft"
  | "in_review"
  | "ready_to_publish"
  | "published"
  | "unpublished"
  | "archived";
export type ScheduledPublicationStatus =
  | "scheduled"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";
export type ReviewCommentStatus = "open" | "resolved";
export type ReportStatus = "pending" | "grouped" | "actioned" | "dismissed";
export type ModerationCaseStatus =
  | "open"
  | "investigating"
  | "action_taken"
  | "closed";
export type ModerationActionType =
  | "warning"
  | "content_removed"
  | "restricted"
  | "dismissed"
  | "other";
export type NotificationType =
  | "invitation"
  | "review"
  | "publishing"
  | "moderation"
  | "system";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          role: PlatformRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: PlatformRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          role?: PlatformRole;
          updated_at?: string;
        };
      };
      creator_profiles: {
        Row: {
          id: string;
          pen_name: string;
          website_url: string | null;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          pen_name: string;
          website_url?: string | null;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          pen_name?: string;
          website_url?: string | null;
          social_links?: Json;
          updated_at?: string;
        };
      };
      studios: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          updated_at?: string;
        };
      };
      studio_members: {
        Row: {
          studio_id: string;
          user_id: string;
          role: StudioRole;
          created_at: string;
        };
        Insert: {
          studio_id: string;
          user_id: string;
          role: StudioRole;
          created_at?: string;
        };
        Update: {
          role?: StudioRole;
        };
      };
      series: {
        Row: {
          id: string;
          slug: string;
          title: string;
          synopsis: string;
          format: ComicFormat;
          genre: string;
          cover_url: string | null;
          owner_user_id: string | null;
          owner_studio_id: string | null;
          visibility: SeriesVisibility;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          synopsis: string;
          format: ComicFormat;
          genre: string;
          cover_url?: string | null;
          owner_user_id?: string | null;
          owner_studio_id?: string | null;
          visibility?: SeriesVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          synopsis?: string;
          format?: ComicFormat;
          genre?: string;
          cover_url?: string | null;
          owner_user_id?: string | null;
          owner_studio_id?: string | null;
          visibility?: SeriesVisibility;
          updated_at?: string;
        };
      };
      series_members: {
        Row: {
          series_id: string;
          user_id: string;
          role: SeriesRole;
          created_at: string;
        };
        Insert: {
          series_id: string;
          user_id: string;
          role: SeriesRole;
          created_at?: string;
        };
        Update: {
          role?: SeriesRole;
        };
      };
      contributor_credits: {
        Row: {
          id: string;
          series_id: string;
          user_id: string | null;
          custom_name: string | null;
          role_category: ContributorRoleCategory;
          created_at: string;
        };
        Insert: {
          id?: string;
          series_id: string;
          user_id?: string | null;
          custom_name?: string | null;
          role_category: ContributorRoleCategory;
          created_at?: string;
        };
        Update: {
          custom_name?: string | null;
          role_category?: ContributorRoleCategory;
        };
      };
      media_assets: {
        Row: {
          id: string;
          uploader_id: string;
          cloudinary_public_id: string;
          resource_type: string;
          format: string;
          width: number | null;
          height: number | null;
          byte_size: number | null;
          secure_url: string;
          is_restricted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          uploader_id: string;
          cloudinary_public_id: string;
          resource_type?: string;
          format: string;
          width?: number | null;
          height?: number | null;
          byte_size?: number | null;
          secure_url: string;
          is_restricted?: boolean;
          created_at?: string;
        };
        Update: {
          is_restricted?: boolean;
        };
      };
      episodes: {
        Row: {
          id: string;
          series_id: string;
          episode_number: number;
          title: string;
          slug: string;
          published_revision_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          series_id: string;
          episode_number: number;
          title: string;
          slug: string;
          published_revision_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          episode_number?: number;
          title?: string;
          slug?: string;
          published_revision_id?: string | null;
          updated_at?: string;
        };
      };
      episode_revisions: {
        Row: {
          id: string;
          episode_id: string;
          revision_number: number;
          status: RevisionStatus;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          revision_number: number;
          status?: RevisionStatus;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: RevisionStatus;
          notes?: string | null;
          updated_at?: string;
        };
      };
      revision_pages: {
        Row: {
          id: string;
          revision_id: string;
          media_asset_id: string;
          page_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          revision_id: string;
          media_asset_id: string;
          page_number: number;
          created_at?: string;
        };
        Update: {
          media_asset_id?: string;
          page_number?: number;
        };
      };
      scheduled_publications: {
        Row: {
          id: string;
          episode_id: string;
          revision_id: string;
          scheduled_for: string;
          status: ScheduledPublicationStatus;
          created_by: string;
          error_message: string | null;
          executed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          revision_id: string;
          scheduled_for: string;
          status?: ScheduledPublicationStatus;
          created_by: string;
          error_message?: string | null;
          executed_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: ScheduledPublicationStatus;
          error_message?: string | null;
          executed_at?: string | null;
        };
      };
      review_comments: {
        Row: {
          id: string;
          revision_id: string;
          user_id: string;
          content: string;
          status: ReviewCommentStatus;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          revision_id: string;
          user_id: string;
          content: string;
          status?: ReviewCommentStatus;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          status?: ReviewCommentStatus;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
      };
      series_follows: {
        Row: {
          user_id: string;
          series_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          series_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          series_id?: string;
        };
      };
      bookmarks: {
        Row: {
          user_id: string;
          episode_id: string;
          page_number: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          episode_id: string;
          page_number?: number;
          updated_at?: string;
        };
        Update: {
          page_number?: number;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          target_type: "series" | "episode" | "profile" | "comment";
          target_id: string;
          reason: string;
          details: string | null;
          status: ReportStatus;
          case_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          target_type: "series" | "episode" | "profile" | "comment";
          target_id: string;
          reason: string;
          details?: string | null;
          status?: ReportStatus;
          case_id?: string | null;
          created_at?: string;
        };
        Update: {
          status?: ReportStatus;
          case_id?: string | null;
        };
      };
      moderation_cases: {
        Row: {
          id: string;
          assigned_moderator_id: string | null;
          target_type: "series" | "episode" | "profile" | "comment";
          target_id: string;
          status: ModerationCaseStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assigned_moderator_id?: string | null;
          target_type: "series" | "episode" | "profile" | "comment";
          target_id: string;
          status?: ModerationCaseStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          assigned_moderator_id?: string | null;
          status?: ModerationCaseStatus;
          notes?: string | null;
          updated_at?: string;
        };
      };
      moderation_actions: {
        Row: {
          id: string;
          case_id: string | null;
          moderator_id: string;
          action_type: ModerationActionType;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id?: string | null;
          moderator_id: string;
          action_type: ModerationActionType;
          reason: string;
          created_at?: string;
        };
        Update: {
          action_type?: ModerationActionType;
          reason?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          metadata?: Json;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: NotificationType;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_moderator: {
        Args: { user_uuid: string };
        Returns: boolean;
      };
      is_series_authorized: {
        Args: {
          series_uuid: string;
          user_uuid: string;
          required_roles: string[];
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
