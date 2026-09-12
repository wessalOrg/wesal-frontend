import { t } from "@/i18n";
import { isBookingRejectionContent } from "@/lib/booking-rejection-message";
import { localizeHallName } from "@/lib/localize-hall-display";
import type { UiLang } from "@/lib/language";
import type { ConversationSummary } from "@/types/messages";

type ConversationPreviewSource = Pick<
  ConversationSummary,
  "otherParticipantName" | "hallName" | "hallId"
>;

export function conversationHallLabel(
  item: Pick<ConversationSummary, "hallId" | "hallName">,
  lang: UiLang,
): string {
  return (
    localizeHallName(item.hallId, item.hallName, lang).trim() || t("common.hall")
  );
}

export function conversationPreviewTitle(
  item: ConversationPreviewSource,
  lang: UiLang = "ar",
): string {
  const owner = item.otherParticipantName.trim();
  if (owner) {
    if (lang !== "en") return owner;
    return owner
      .replace(/^صاحب قاعة\s*/u, "Owner of ")
      .replace(/^صاحب\s+/u, "Owner · ");
  }
  return conversationHallLabel(item, lang);
}

export function conversationPreviewSubtitle(
  item: ConversationPreviewSource,
  lang: UiLang = "ar",
): string | null {
  const title = conversationPreviewTitle(item, lang);
  const hall = conversationHallLabel(item, lang);
  if (!hall || hall === title) return null;
  return hall;
}

export function conversationListPreview(preview: string): string {
  const text = preview.trim();
  if (!text) return "";
  if (isBookingRejectionContent(text)) return t("messages.rejection.preview");
  return text;
}
