import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchKakaoCafes } from "./kakao-api";

afterEach(() => vi.unstubAllGlobals());

describe("fetchKakaoCafes", () => {
  it("normalizes Kakao local search documents", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ documents: [{
      id: "42", place_name: "여행 카페", x: "127.1", y: "37.1", road_address_name: "서울 어딘가",
    }] }), { status: 200 })));

    const places = await fetchKakaoCafes({ apiKey: "key", districtName: "종로구" });

    expect(places).toEqual([expect.objectContaining({ id: "kakao-42", name: "여행 카페", category: "cafe" })]);
  });
});
