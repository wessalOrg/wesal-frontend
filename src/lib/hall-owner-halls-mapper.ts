import type { HallApprovalStatus } from "@/constants/hallApprovalStatus";
import type { HallOwnerHall } from "@/types/hall-owner-halls";

/**
 * Assumed owner halls list contract (US-OWNER-05) until OpenAPI lands.
 *
 * GET /api/v1/owner/halls
 * Auth: Bearer (Hall Owner)
 *
 * Success 200:
 *   HallOwnerHallDto[] | { halls?: HallOwnerHallDto[], items?: HallOwnerHallDto[] }
 *
 * HallOwnerHallDto fields (aliases supported):
 *   id | hallId
 *   name | hallName
 *   status | approvalStatus | hallStatus
 *
 * Backend HallStatus enum (JsonStringEnumConverter):
 *   PendingReview | Approved | Rejected
 * UI maps PendingReview → Pending.
 */
export type HallOwnerHallDto = {
  id?: string | null;
  hallId?: string | null;
  name?: string | null;
  hallName?: string | null;
  status?: string | null;
  approvalStatus?: string | null;
  hallStatus?: string | null;
};

function readId(dto: HallOwnerHallDto): string | null {
  const value = String(dto.id ?? dto.hallId ?? "").trim();
  return value || null;
}

function readName(dto: HallOwnerHallDto): string {
  return String(dto.name ?? dto.hallName ?? "").trim() || "—";
}

function readRawStatus(dto: HallOwnerHallDto): string {
  return String(dto.status ?? dto.approvalStatus ?? dto.hallStatus ?? "").trim();
}

/** Maps backend status strings onto UI Pending | Approved | Rejected. */
export function mapBackendHallStatus(raw: string): HallApprovalStatus | null {
  const normalized = raw.replace(/[\s_-]/g, "").toLowerCase();
  if (
    normalized === "pending" ||
    normalized === "pendingreview" ||
    normalized === "0"
  ) {
    return "Pending";
  }
  if (normalized === "approved" || normalized === "1") {
    return "Approved";
  }
  if (normalized === "rejected" || normalized === "2") {
    return "Rejected";
  }
  return null;
}

export function mapHallOwnerHallDto(dto: HallOwnerHallDto): HallOwnerHall | null {
  const id = readId(dto);
  if (!id) return null;
  const status = mapBackendHallStatus(readRawStatus(dto));
  if (!status) return null;
  return {
    id,
    name: readName(dto),
    status,
  };
}

export function mapHallOwnerHallsResponse(data: unknown): HallOwnerHall[] {
  const list: HallOwnerHallDto[] = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? Array.isArray((data as { halls?: unknown }).halls)
        ? ((data as { halls: HallOwnerHallDto[] }).halls)
        : Array.isArray((data as { items?: unknown }).items)
          ? ((data as { items: HallOwnerHallDto[] }).items)
          : []
      : [];

  const halls: HallOwnerHall[] = [];
  for (const item of list) {
    const mapped = mapHallOwnerHallDto(item);
    if (mapped) halls.push(mapped);
  }
  return halls;
}
