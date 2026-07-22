import { decodeSharedTrip } from "@/features/course/share";
import { TravelApp } from "@/features/journey/travel-app";

export default async function Home({ searchParams }: { searchParams: Promise<{ trip?: string }> }) {
  const { trip } = await searchParams;
  return <TravelApp initialTrip={trip ? decodeSharedTrip(trip) : undefined} />;
}
