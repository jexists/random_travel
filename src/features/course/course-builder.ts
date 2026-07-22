import type { RandomSource } from "@/features/games/random-engine";
import { chooseRandom } from "@/features/games/random-engine";
import type { TravelDuration } from "@/features/journey/journey-reducer";

import type { CourseDay, CoursePlace, PlaceCategory, TravelCourse } from "./types";

function pickMany(
  places: readonly CoursePlace[],
  category: PlaceCategory,
  count: number,
  random: RandomSource,
): CoursePlace[] {
  const pool = places.filter((place) => place.category === category);
  if (pool.length < count) {
    throw new Error(`${category} 후보가 부족합니다`);
  }

  const selected: CoursePlace[] = [];
  const remaining = [...pool];
  while (selected.length < count) {
    const place = chooseRandom(remaining, random);
    selected.push(place);
    remaining.splice(remaining.indexOf(place), 1);
  }
  return selected;
}

function routeUrl(places: readonly CoursePlace[]): string {
  const path = places
    .map((place) => `${encodeURIComponent(place.name)},${place.latitude},${place.longitude}`)
    .join("/");
  return `https://map.kakao.com/link/by/car/${path}`;
}

function toDay(day: number, places: CoursePlace[]): CourseDay {
  return { day, places, kakaoRouteUrl: routeUrl(places) };
}

export function buildCourse(
  places: readonly CoursePlace[],
  duration: TravelDuration,
  random: RandomSource,
): TravelCourse {
  if (duration === "dayTrip") {
    const selected = [
      ...pickMany(places, "attraction", 2, random),
      ...pickMany(places, "food", 1, random),
      ...pickMany(places, places.some((place) => place.category === "cafe") ? "cafe" : "attraction", 1, random),
    ];
    return { duration, days: [toDay(1, selected)] };
  }

  const selected = [
    ...pickMany(places, "attraction", 4, random),
    ...pickMany(places, "food", 2, random),
    ...pickMany(places, "stay", 1, random),
  ];
  return {
    duration,
    days: [toDay(1, selected.slice(0, 4)), toDay(2, selected.slice(4))],
  };
}
