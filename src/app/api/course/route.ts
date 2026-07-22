import { NextResponse } from "next/server";
import { z } from "zod";

import { buildCourse } from "@/features/course/course-builder";
import { fetchKakaoCafes } from "@/features/course/kakao-api";
import { fetchTourPlaces } from "@/features/course/tour-api";
import type { CoursePlace } from "@/features/course/types";

const requestSchema = z.object({
  provinceCode: z.string().min(2).max(2),
  districtCode: z.string().min(2).max(5),
  districtName: z.string().optional(),
  duration: z.enum(["dayTrip", "oneNightTwoDays"]),
});

function fixturePlaces(districtCode: string): CoursePlace[] {
  const seed = Number(districtCode.slice(-3)) / 100;
  const baseLat = 35.5 + (seed % 2);
  const baseLng = 126.5 + (seed % 2.5);
  const make = (id: string, name: string, category: CoursePlace["category"], offset: number): CoursePlace => ({
    id: `${districtCode}-${id}`,
    name,
    category,
    latitude: Number((baseLat + offset * 0.025).toFixed(5)),
    longitude: Number((baseLng + offset * 0.02).toFixed(5)),
  });
  return [
    make("a1", "바람이 머무는 전망대", "attraction", 1), make("a2", "동네 이야기 박물관", "attraction", 2),
    make("a3", "느린 산책 숲길", "attraction", 3), make("a4", "노을빛 전통시장", "attraction", 4),
    make("f1", "오늘의 지역 밥상", "food", 5), make("f2", "골목 안 작은 식당", "food", 6),
    make("c1", "창가가 예쁜 여행 카페", "cafe", 7), make("h1", "포근한 하루 스테이", "stay", 8),
  ];
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "여행 조건을 다시 확인해 주세요." }, { status: 400 });

  try {
    const fixtures = fixturePlaces(parsed.data.districtCode);
    let places = fixtures;
    if (process.env.TOUR_API_KEY) {
      try {
        const live = await fetchTourPlaces({
          apiKey: process.env.TOUR_API_KEY,
          provinceCode: parsed.data.provinceCode,
          districtCode: parsed.data.districtCode,
          districtName: parsed.data.districtName,
        });
        places = [...live, ...fixtures];
      } catch {
        // Keep the game playable when the public tourism API is temporarily unavailable.
      }
    }
    if (process.env.KAKAO_REST_API_KEY && parsed.data.districtName) {
      try {
        const cafes = await fetchKakaoCafes({ apiKey: process.env.KAKAO_REST_API_KEY, districtName: parsed.data.districtName });
        places = [...places.filter((place) => place.category !== "cafe"), ...cafes, ...fixtures.filter((place) => place.category === "cafe")];
      } catch {
        // The local fixture cafe remains available when Kakao search is unavailable.
      }
    }
    return NextResponse.json(buildCourse(places, parsed.data.duration, Math.random));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "코스를 만들지 못했어요." }, { status: 422 });
  }
}
