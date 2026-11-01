"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toggleLibraryAction, toggleFollowAction } from "@/app/actions/reader";
import { LuBookmark, LuCheck, LuBell, LuBellOff } from "react-icons/lu";

interface SeriesEngagementButtonsProps {
  seriesId: string;
  seriesSlug: string;
  initialInLibrary: boolean;
  initialFollowing: boolean;
  initialNotify: boolean;
  isAuthenticated: boolean;
}

export function SeriesEngagementButtons({
  seriesId,
  seriesSlug,
  initialInLibrary,
  initialFollowing,
  initialNotify,
  isAuthenticated,
}: SeriesEngagementButtonsProps) {
  const router = useRouter();
  const [inLibrary, setInLibrary] = useState(initialInLibrary);
  const [following, setFollowing] = useState(initialFollowing);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);

  const handleLibraryToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/series/${seriesSlug}`)}`);
      return;
    }

    setIsLoadingLibrary(true);
    try {
      const res = await toggleLibraryAction(seriesId);
      setInLibrary(res.inLibrary);
    } catch {
      // Revert if error
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/series/${seriesSlug}`)}`);
      return;
    }

    setIsLoadingFollow(true);
    try {
      const res = await toggleFollowAction(seriesId);
      setFollowing(res.following);
    } catch {
      // Revert if error
    } finally {
      setIsLoadingFollow(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
      <Button
        variant={inLibrary ? "secondary" : "ghost"}
        size="sm"
        onClick={handleLibraryToggle}
        isLoading={isLoadingLibrary}
        aria-label={inLibrary ? "Remove from Library" : "Add to Library"}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {inLibrary ? <LuCheck size={16} /> : <LuBookmark size={16} />}
          <span>{inLibrary ? "In Library" : "Add to Library"}</span>
        </span>
      </Button>

      <Button
        variant={following ? "secondary" : "ghost"}
        size="sm"
        onClick={handleFollowToggle}
        isLoading={isLoadingFollow}
        aria-label={following ? "Unfollow series" : "Follow series for updates"}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <LuBell size={16} />
          <span>{following ? "Following" : "Follow"}</span>
        </span>
      </Button>
    </div>
  );
}
