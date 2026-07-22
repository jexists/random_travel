import { z } from "zod";

import type { CoursePlace, PlaceCategory } from "./types";

const AREA_CODE: Record<string, string> = {
  "11": "1", "21": "6", "22": "4", "23": "2", "24": "5", "25": "3", "26": "7", "29": "8",
  "31": "31", "32": "32", "33": "33", "34": "34", "35": "37", "36": "38", "37": "35", "38": "36", "39": "39",
};

const itemSchema = z.object({
  contentid: z.coerce.string(),
  title: z.string(),
  mapy: z.coerce.number(),
  mapx: z.coerce.number(),
  addr1: z.string().optional().default(""),
  firstimage: z.string().optional().default(""),
});

const responseSchema = z.object({
  response: z.object({ body: z.object({ items: z.union([
    z.object({ item: z.union([z.array(itemSchema), itemSchema]) }),
    z.string(),
  ]) }) }),
});

const contentTypes: Array<{ id: string; category: PlaceCategory }> = [
  { id: "12", category: "attraction" },
  { id: "39", category: "food" },
  { id: "32", category: "stay" },
];

interface FetchTourPlacesOptions {
  apiKey: string;
  provinceCode: string;
  districtCode: string;
  districtName?: string;
}

async function fetchContent(options: FetchTourPlacesOptions, contentTypeId: string, category: PlaceCategory) {
  const params = new URLSearchParams({
    serviceKey: options.apiKey,
    MobileOS: "ETC",
    MobileApp: "WhereToGo",
    _type: "json",
    numOfRows: "80",
    pageNo: "1",
    arrange: "Q",
    areaCode: AREA_CODE[options.provinceCode] ?? options.provinceCode,
    contentTypeId,
  });
  const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/areaBasedList2?${params}`, {
    next: { revalidate: 60 * 60 * 12 },
  });
  if (!response.ok) throw new Error(`TourAPI 요청 실패 (${response.status})`);
  const parsed = responseSchema.parse(await response.json());
  if (typeof parsed.response.body.items === "string") return [];
  const raw = parsed.response.body.items.item;
  const items = Array.isArray(raw) ? raw : [raw];
  return items
    .filter((item) => !options.districtName || item.addr1.includes(options.districtName))
    .map<CoursePlace>((item) => ({
      id: `tour-${item.contentid}`,
      name: item.title,
      category,
      latitude: item.mapy,
      longitude: item.mapx,
      address: item.addr1,
      imageUrl: item.firstimage || undefined,
    }));
}

export async function fetchTourPlaces(options: FetchTourPlacesOptions): Promise<CoursePlace[]> {
  const groups = await Promise.all(contentTypes.map(({ id, category }) => fetchContent(options, id, category)));
  return groups.flat();
}
