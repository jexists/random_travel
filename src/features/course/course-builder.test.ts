import { describe, expect, it } from "vitest";

import { buildCourse } from "./course-builder";
import type { CoursePlace } from "./types";

const places: CoursePlace[] = [
  { id: "a1", name: "숲길", category: "attraction", latitude: 37, longitude: 127 },
  { id: "a2", name: "미술관", category: "attraction", latitude: 37.1, longitude: 127.1 },
  { id: "a3", name: "해변", category: "attraction", latitude: 37.2, longitude: 127.2 },
  { id: "a4", name: "시장", category: "attraction", latitude: 37.3, longitude: 127.3 },
  { id: "f1", name: "식당 1", category: "food", latitude: 37.05, longitude: 127.05 },
  { id: "f2", name: "식당 2", category: "food", latitude: 37.25, longitude: 127.25 },
  { id: "c1", name: "카페", category: "cafe", latitude: 37.15, longitude: 127.15 },
  { id: "h1", name: "숙소", category: "stay", latitude: 37.2, longitude: 127.21 },
];

describe("buildCourse", () => {
  it("builds a four-stop day trip", () => {
    const course = buildCourse(places, "dayTrip", () => 0);

    expect(course.days).toHaveLength(1);
    expect(course.days[0].places).toHaveLength(4);
    expect(course.days[0].places.filter((place) => place.category === "attraction")).toHaveLength(2);
  });

  it("builds a seven-stop overnight trip across two days", () => {
    const course = buildCourse(places, "oneNightTwoDays", () => 0);

    expect(course.days).toHaveLength(2);
    expect(course.days.flatMap((day) => day.places)).toHaveLength(7);
    expect(course.days.flatMap((day) => day.places).filter((place) => place.category === "stay")).toHaveLength(1);
  });
});
