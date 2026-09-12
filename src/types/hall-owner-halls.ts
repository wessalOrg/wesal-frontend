import type { HallApprovalStatus } from "@/constants/hallApprovalStatus";

export type HallOwnerHall = {
  id: string;
  name: string;
  status: HallApprovalStatus;
};

export type HallOwnerHallsLoadStatus = "idle" | "loading" | "ready" | "error";
