export type JourneyEventName =
  | "game_selected"
  | "scope_selected"
  | "province_selected"
  | "district_selected"
  | "course_completed"
  | "course_shared";

export function trackJourneyEvent(name: JourneyEventName, data: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("wheretogo:analytics", { detail: { name, data } }));
}
