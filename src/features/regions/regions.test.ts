import { describe, expect, it } from "vitest";

import { getDistricts, provinces } from "./regions";

describe("region catalogue", () => {
  it("contains all 17 provinces", () => {
    expect(provinces).toHaveLength(17);
    expect(provinces.map((province) => province.name)).toContain("제주특별자치도");
    expect(provinces.map((province) => province.name)).toContain("세종특별자치시");
  });

  it("maps municipalities by the first two digits of their code", () => {
    expect(getDistricts("11").map((district) => district.name)).toContain("종로구");
    expect(getDistricts("39").map((district) => district.name)).toEqual(
      expect.arrayContaining(["제주시", "서귀포시"]),
    );
  });
});
