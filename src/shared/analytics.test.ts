import { describe, expect, it, vi } from "vitest";

import { trackJourneyEvent } from "./analytics";

describe("trackJourneyEvent", () => {
  it("emits an anonymous local event for analytics adapters", () => {
    const listener = vi.fn();
    window.addEventListener("wheretogo:analytics", listener);

    trackJourneyEvent("game_selected", { gameId: "dart" });

    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ name: "game_selected", data: { gameId: "dart" } });
    window.removeEventListener("wheretogo:analytics", listener);
  });
});
