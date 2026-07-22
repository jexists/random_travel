import { describe, expect, it } from "vitest";

import { createGameRegistry } from "./game-registry";

const games = [
  { id: "dart", name: "지도 다트", enabled: true, order: 2 },
  { id: "slot", name: "여행 슬롯", enabled: true, order: 1 },
  { id: "card", name: "행운의 카드", enabled: false, order: 3 },
];

describe("createGameRegistry", () => {
  it("returns only enabled games in display order", () => {
    const registry = createGameRegistry(games);

    expect(registry.list().map((game) => game.id)).toEqual(["slot", "dart"]);
  });

  it("uses all enabled games for automatic game selection", () => {
    const registry = createGameRegistry(games);

    expect(registry.random(() => 0).id).toBe("slot");
    expect(registry.random(() => 0.99).id).toBe("dart");
  });
});
