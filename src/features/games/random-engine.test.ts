import { describe, expect, it } from "vitest";

import { chooseRandom } from "./random-engine";

describe("chooseRandom", () => {
  it("maps a deterministic random value to the expected candidate", () => {
    expect(chooseRandom(["서울", "경기", "강원"], () => 0)).toBe("서울");
    expect(chooseRandom(["서울", "경기", "강원"], () => 0.34)).toBe("경기");
    expect(chooseRandom(["서울", "경기", "강원"], () => 0.99)).toBe("강원");
  });

  it("rejects an empty candidate list", () => {
    expect(() => chooseRandom([], () => 0)).toThrow("후보가 없습니다");
  });
});
