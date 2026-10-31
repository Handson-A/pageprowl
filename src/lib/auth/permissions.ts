import type { StudioRole, SeriesRole, UserRole } from "../../types/database.ts";

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message = "Authentication required to access this resource.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message = "The requested resource could not be found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export const STUDIO_ROLE_RANK: Record<StudioRole, number> = {
  member: 1,
  editor: 2,
  admin: 3,
  owner: 4,
};

export const SERIES_ROLE_RANK: Record<SeriesRole, number> = {
  viewer: 1,
  contributor: 2,
  editor: 3,
  owner: 4,
};

/**
 * Pure helper to verify if a given studio role satisfies the required minimum role.
 */
export function hasStudioPermission(
  userRole: StudioRole | null | undefined,
  requiredRole: StudioRole
): boolean {
  if (!userRole) return false;
  return (STUDIO_ROLE_RANK[userRole] ?? 0) >= (STUDIO_ROLE_RANK[requiredRole] ?? 0);
}

/**
 * Pure helper to verify if a series role satisfies the required minimum role.
 */
export function hasSeriesPermission(
  userRole: SeriesRole | null | undefined,
  requiredRole: SeriesRole
): boolean {
  if (!userRole) return false;
  return (SERIES_ROLE_RANK[userRole] ?? 0) >= (SERIES_ROLE_RANK[requiredRole] ?? 0);
}
