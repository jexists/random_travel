import { describe, expect, it } from "vitest";

import { initialJourneyState, journeyReducer } from "./journey-reducer";

describe("journeyReducer", () => {
  it("moves from game selection to province draw for nationwide mode", () => {
    let state = journeyReducer(initialJourneyState, { type: "selectGame", gameId: "dart" });
    state = journeyReducer(state, { type: "selectScope", scope: "nationwide" });

    expect(state.stage).toBe("province");
  });

  it("moves to manual province selection for selectedProvince mode", () => {
    const withGame = journeyReducer(initialJourneyState, { type: "selectGame", gameId: "slot" });
    const state = journeyReducer(withGame, { type: "selectScope", scope: "selectedProvince" });

    expect(state.stage).toBe("provinceSelect");
  });

  it("clears downstream selections when restarting the province", () => {
    const completed = {
      ...initialJourneyState,
      gameId: "card",
      scope: "nationwide" as const,
      provinceCode: "41",
      districtCode: "41130",
      duration: "dayTrip" as const,
      stage: "result" as const,
    };

    const state = journeyReducer(completed, { type: "restartProvince" });

    expect(state).toMatchObject({
      stage: "province",
      gameId: "card",
      provinceCode: undefined,
      districtCode: undefined,
      duration: undefined,
    });
  });
});
