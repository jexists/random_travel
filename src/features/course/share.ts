import { z } from "zod";

import type { TravelCourse } from "./types";

export interface SharedTrip {
  version: 1;
  gameId: string;
  provinceCode: string;
  districtCode?: string;
  duration: "dayTrip" | "oneNightTwoDays";
  course: TravelCourse;
}

const placeSchema = z.object({
  id: z.string(), name: z.string(), category: z.enum(["attraction", "food", "cafe", "stay"]),
  latitude: z.number(), longitude: z.number(), address: z.string().optional(), imageUrl: z.string().optional(),
});

const sharedTripSchema = z.object({
  version: z.literal(1),
  gameId: z.string(),
  provinceCode: z.string(),
  districtCode: z.string().optional(),
  duration: z.enum(["dayTrip", "oneNightTwoDays"]),
  course: z.object({
    duration: z.enum(["dayTrip", "oneNightTwoDays"]),
    days: z.array(z.object({ day: z.number(), places: z.array(placeSchema), kakaoRouteUrl: z.string() })),
  }),
});

export function encodeSharedTrip(trip: SharedTrip): string {
  const bytes = new TextEncoder().encode(JSON.stringify(trip));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeSharedTrip(payload: string): SharedTrip | undefined {
  try {
    const base64 = payload.replaceAll("-", "+").replaceAll("_", "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return sharedTripSchema.parse(JSON.parse(new TextDecoder().decode(bytes))) as SharedTrip;
  } catch {
    return undefined;
  }
}
