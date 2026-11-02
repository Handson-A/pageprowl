import type {
  ComicFormat,
  ContributorRoleCategory,
  StudioRole,
} from "../../src/types/database";
import type { SupportedGenre } from "../../src/lib/constants/genres";

export interface CreatorManifest {
  id: string; // e.g. "creator-01"
  username: string; // e.g. "elena_vance"
  displayName: string;
  penName: string;
  bio: string;
  websiteUrl: string | null;
  socialLinks: Record<string, string>;
  avatarPrompt: string;
  avatarFile?: string; // relative to assets directory
}

export interface StudioMemberAssignment {
  creatorUsername: string;
  role: StudioRole;
}

export interface StudioManifest {
  id: string; // e.g. "studio-01"
  slug: string; // e.g. "iron-quill-studios"
  name: string;
  description: string;
  createdByUsername: string;
  members: StudioMemberAssignment[];
  logoPrompt: string;
  logoFile?: string;
}

export interface CharacterDesign {
  name: string;
  role: string;
  visualDescription: string;
  palette: string[];
}

export interface PageManifest {
  pageNumber: number;
  sceneDescription: string;
  imagePrompt: string;
  imageFile?: string;
}

export interface EpisodeManifest {
  episodeNumber: number;
  title: string;
  slug: string;
  synopsis: string;
  pages?: PageManifest[]; // For image-based comics
  textContent?: string; // For text-based written stories
}

export interface ContributorCreditManifest {
  roleCategory: ContributorRoleCategory;
  creatorUsername?: string;
  customName?: string;
}

export interface SeriesManifest {
  id: string; // e.g. "series-01"
  batchNumber: number; // 1 to 5 (10 series per batch)
  slug: string;
  title: string;
  synopsis: string;
  genre: SupportedGenre;
  format: ComicFormat;
  ownerType: "individual" | "studio";
  ownerRef: string; // creator username OR studio slug
  credits: ContributorCreditManifest[];
  artStyle: string;
  characters: CharacterDesign[];
  coverPrompt: string;
  coverFile?: string;
  episodes: EpisodeManifest[]; // Minimum 3 episodes
}

export interface SeedStateLedger {
  version: string;
  createdAt: string;
  updatedAt: string;
  creators: Record<
    string,
    {
      authUserId: string;
      profileId: string;
      referencedBySeries?: string[];
    }
  >;
  studios: Record<
    string,
    {
      studioId: string;
      referencedBySeries?: string[];
    }
  >;
  series: Record<
    string,
    {
      seriesId: string;
      batchNumber: number;
      ownerType?: "individual" | "studio";
      ownerRef?: string;
      contributorUsernames?: string[];
    }
  >;
  episodes: Record<
    string,
    {
      episodeId: string;
      revisionId: string;
      seriesSlug?: string;
    }
  >;
  mediaAssets: Record<
    string,
    {
      assetId: string;
      cloudinaryPublicId: string;
      secureUrl: string;
      width: number | null;
      height: number | null;
      format: string;
      seriesSlug?: string;
    }
  >;
}
