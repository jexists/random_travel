import { describe, expect, it } from "vitest";

import { POST } from "./route";

describe("POST /api/course", () => {
  it("returns a playable day trip", async () => {
    const response = await POST(new Request("http://localhost/api/course", {
      method: "POST",
      body: JSON.stringify({ provinceCode: "41", districtCode: "41130", duration: "dayTrip" }),
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.days[0].places).toHaveLength(4);
  });

  it("rejects invalid input", async () => {
    const response = await POST(new Request("http://localhost/api/course", { method: "POST", body: "{}" }));

    expect(response.status).toBe(400);
  });
});
