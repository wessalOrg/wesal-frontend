import { isHallOwnerRole } from "@/lib/account-role";
import type { WesalRole } from "@/types/session";

/** Regular User profile portal. */
export const REGULAR_PROFILE_PATH = "/profile";

/** Hall Owner dashboard workspace (home + management). */
export const HALL_OWNER_MANAGEMENT_PATH = "/owner";

/** Hall Owner account / profile section. */
export const HALL_OWNER_PROFILE_PATH = "/owner/profile";

/** Hall Owner halls list. */
export const HALL_OWNER_HALLS_PATH = "/owner/halls";

/**
 * Add Hall form route (US-OWNER-04 destination).
 * US-OWNER-03 only navigates here after successful initiation.
 */
export const HALL_OWNER_ADD_HALL_PATH = "/owner/halls/add";

/**
 * Role-aware destination for the Profile icon / account Profile link.
 * Hall Owners enter the management workspace; everyone else keeps `/profile`.
 */
export function getAccountProfilePath(
  role: WesalRole | null | undefined,
): string {
  return isHallOwnerRole(role)
    ? HALL_OWNER_MANAGEMENT_PATH
    : REGULAR_PROFILE_PATH;
}

export function isHallOwnerManagementPath(pathname: string): boolean {
  return (
    pathname === HALL_OWNER_MANAGEMENT_PATH ||
    pathname.startsWith(`${HALL_OWNER_MANAGEMENT_PATH}/`)
  );
}

export function isAccountProfileActive(
  pathname: string,
  role: WesalRole | null | undefined,
): boolean {
  if (isHallOwnerRole(role)) {
    return isHallOwnerManagementPath(pathname);
  }
  return pathname === REGULAR_PROFILE_PATH || pathname.startsWith(`${REGULAR_PROFILE_PATH}/`);
}
