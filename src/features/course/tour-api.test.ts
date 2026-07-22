import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchTourPlaces } from "./tour-api";

afterEach(() => vi.unstubAllGlobals());

describe("fetchTourPlaces", () => {
  it("normalizes TourAPI content into course places", async () => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({
      response: { body: { items: { item: [{
        contentid: "100", title: "바다 전망대", mapy: "37.1", mapx: "127.1", addr1: "강원 어딘가", firstimage: "https://example.com/a.jpg",
      }] } } },
    }), { status: 200 }))));

    const places = await fetchTourPlaces({ apiKey: "key", provinceCode: "32", districtCode: "32010" });

    expect(places).toContainEqual(expect.objectContaining({ id: "tour-100", name: "바다 전망대", category: "attraction" }));
  });
});
