import type { TravelDuration } from "@/features/journey/journey-reducer";

export type PlaceCategory = "attraction" | "food" | "cafe" | "stay";

export interface CoursePlace {
  id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
}

export interface CourseDay {
  day: number;
  places: CoursePlace[];
  kakaoRouteUrl: string;
}

export interface TravelCourse {
  duration: TravelDuration;
  days: CourseDay[];
}
