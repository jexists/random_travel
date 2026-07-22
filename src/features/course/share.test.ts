import { describe, expect, it } from "vitest";

import { decodeSharedTrip, encodeSharedTrip } from "./share";
import type { SharedTrip } from "./share";

const trip: SharedTrip = {
  version: 1,
  gameId: "dart",
  provinceCode: "41",
  districtCode: "41130",
  duration: "dayTrip",
  course: { duration: "dayTrip", days: [] },
};

describe("shared trip payload", () => {
  it("round-trips a versioned course", () => {
    expect(decodeSharedTrip(encodeSharedTrip(trip))).toEqual(trip);
  });

  it("rejects malformed payloads", () => {
    expect(decodeSharedTrip("not-a-trip")).toBeUndefined();
  });
});
