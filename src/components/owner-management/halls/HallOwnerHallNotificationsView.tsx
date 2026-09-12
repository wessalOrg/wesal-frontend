"use client";

import Link from "next/link";
import HallManagementSectionNav from "@/components/owner-management/halls/HallManagementSectionNav";
import OwnerBookingRequestList from "@/components/owner-management/halls/OwnerBookingRequestList";
import { useHallBookingRequests } from "@/hooks/useHallBookingRequests";
import { useSelectedOwnerHall } from "@/hooks/useSelectedOwnerHall";
import { HALL_OWNER_PROFILE_PATH } from "@/lib/account-profile-path";
import { useT } from "@/i18n";

type HallOwnerHallNotificationsViewProps = {
  hallId: string;
};

/**
 * Hall-scoped booking request Notifications (US-OWNER-09).
 * Data comes only from useHallBookingRequests(hallId).
 */
export default function HallOwnerHallNotificationsView({
  hallId,
}: HallOwnerHallNotificationsViewProps) {
  const t = useT();
  const { isListReady, isKnownOwnedHall, selectedHall, isListLoading } =
    useSelectedOwnerHall();

  const {
    requests,
    isLoading,
    isError,
    errorKey,
    isRefreshing,
    isEmpty,
    refetch,
  } = useHallBookingRequests(hallId);

  if (isListReady && !isKnownOwnedHall) {
    return (
      <section
        className="owner-hall-mgmt-panel min-w-0 rounded-2xl border border-[var(--wesal-border)] bg-white p-4 sm:p-6"
        data-testid="owner-hall-notifications-unknown"
      >
        <p className="break-words text-sm text-[var(--wesal-muted)]">
          {t("owner.management.hallEdit.errors.notFound")}
        </p>
        <Link
          href={HALL_OWNER_PROFILE_PATH}
          className="btn-outline mt-4 inline-flex min-h-11 items-center"
        >
          {t("owner.management.nav.profile")}
        </Link>
      </section>
    );
  }

  const hallName = selectedHall?.name ?? "—";

  return (
    <section
      className="owner-hall-mgmt-panel owner-hall-notifications min-w-0 space-y-5 sm:space-y-6"
      data-testid="owner-hall-notifications-view"
      data-hall-id={hallId}
    >
      <header className="min-w-0 rounded-2xl border border-[var(--wesal-border)] bg-white p-4 sm:p-6">
        <div className="min-w-0 space-y-4">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-extrabold text-[var(--wesal-maroon)] sm:text-2xl">
              {hallName}
            </h2>
            <p className="mt-1 break-words text-sm text-[var(--wesal-muted)]">
              {t("owner.management.notifications.subtitle")}
            </p>
          </div>
          <HallManagementSectionNav hallId={hallId} />
        </div>
      </header>

      <div className="min-w-0 rounded-2xl border border-[var(--wesal-border)] bg-white p-4 sm:p-6">
        <div className="mb-4 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
          <h3 className="break-words text-base font-extrabold text-[var(--wesal-maroon)]">
            {t("owner.management.notifications.title")}
          </h3>
          {isRefreshing ? (
            <span className="text-xs font-semibold text-[var(--wesal-muted)]" role="status">
              {t("owner.management.notifications.refreshing")}
            </span>
          ) : null}
        </div>

        {isLoading || (isListLoading && !isListReady) ? (
          <div
            className="owner-booking-request-skeleton space-y-3"
            aria-busy="true"
            data-testid="owner-hall-notifications-loading"
          >
            <div className="h-24 animate-pulse rounded-2xl bg-[var(--wesal-pink-soft)]" />
            <div className="h-24 animate-pulse rounded-2xl bg-[var(--wesal-pink-soft)]" />
            <p className="sr-only">{t("common.loading")}</p>
          </div>
        ) : null}

        {isError ? (
          <div
            className="min-w-0 rounded-2xl border border-[var(--wesal-border)] bg-[var(--wesal-pink-soft)] px-4 py-3"
            role="alert"
            data-testid="owner-hall-notifications-error"
          >
            <p className="break-words text-sm text-[var(--wesal-maroon)]">
              {t(errorKey ?? "owner.management.notifications.errors.loadFailed")}
            </p>
            <button
              type="button"
              className="btn-outline mt-3 min-h-11 w-full sm:w-auto"
              onClick={() => refetch()}
              data-testid="owner-hall-notifications-retry"
            >
              {t("common.retry")}
            </button>
          </div>
        ) : null}

        {!isLoading && !isError && isEmpty ? (
          <p
            className="break-words rounded-2xl border border-[var(--wesal-border)] bg-[var(--wesal-pink-soft)] px-4 py-5 text-sm leading-relaxed text-[var(--wesal-muted)]"
            data-testid="owner-hall-notifications-empty"
          >
            {t("owner.management.notifications.empty")}
          </p>
        ) : null}

        {!isLoading && !isError && requests.length > 0 ? (
          <div
            className={isRefreshing ? "pointer-events-none opacity-60" : undefined}
            aria-busy={isRefreshing || undefined}
          >
            <OwnerBookingRequestList requests={requests} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
