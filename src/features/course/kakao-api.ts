import { z } from "zod";

import type { CoursePlace } from "./types";

const responseSchema = z.object({
  documents: z.array(z.object({
    id: z.coerce.string(),
    place_name: z.string(),
    x: z.coerce.number(),
    y: z.coerce.number(),
    road_address_name: z.string().optional().default(""),
    address_name: z.string().optional().default(""),
  })),
});

export async function fetchKakaoCafes({ apiKey, districtName }: { apiKey: string; districtName: string }): Promise<CoursePlace[]> {
  const params = new URLSearchParams({ query: `${districtName} 카페`, size: "15", sort: "accuracy" });
  const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    next: { revalidate: 60 * 60 * 12 },
  });
  if (!response.ok) throw new Error(`카카오 장소 검색 실패 (${response.status})`);
  return responseSchema.parse(await response.json()).documents.map((item) => ({
    id: `kakao-${item.id}`,
    name: item.place_name,
    category: "cafe",
    latitude: item.y,
    longitude: item.x,
    address: item.road_address_name || item.address_name,
  }));
}
