import { useQuery } from "@tanstack/react-query";
import { loadGoogleMaps } from "../lib/googleMaps";

export interface PlaceOpeningHours {
  weekdayDescriptions: string[];
}

export interface GooglePlaceDetails {
  websiteUri?: string;
  openingHours?: PlaceOpeningHours;
}

const PLACE_FIELDS = ["websiteURI", "regularOpeningHours"];

const fetchPlaceDetails = async (
  placeId: string,
): Promise<GooglePlaceDetails> => {
  const maps = await loadGoogleMaps();
  const { Place } = (await maps.importLibrary(
    "places",
  )) as google.maps.PlacesLibrary;

  const place = new Place({ id: placeId });
  await place.fetchFields({ fields: PLACE_FIELDS });

  return {
    websiteUri: place.websiteURI ?? undefined,
    openingHours: place.regularOpeningHours
      ? {
          weekdayDescriptions: place.regularOpeningHours.weekdayDescriptions,
        }
      : undefined,
  };
};

export interface OpeningHoursDay {
  description: string;
  isToday: boolean;
}

export interface OpeningHoursSummary {
  collapsed?: string;
  days: OpeningHoursDay[];
}

const todayGoogleIndex = (): number => (new Date().getDay() + 6) % 7;

export const summariseOpeningHours = (
  hours: PlaceOpeningHours,
): OpeningHoursSummary => {
  const todayIndex = todayGoogleIndex();
  const days = hours.weekdayDescriptions.map((description, index) => ({
    description,
    isToday: index === todayIndex,
  }));

  const hoursPart = (description: string) =>
    description.slice(description.indexOf(":") + 1).trim();
  const allSame =
    days.length > 0 &&
    days.every(
      (day) => hoursPart(day.description) === hoursPart(days[0].description),
    );

  return allSame
    ? { collapsed: hoursPart(days[0].description), days }
    : { days };
};

const useGooglePlaceDetails = (placeId: string | undefined) =>
  useQuery<GooglePlaceDetails, Error>({
    queryKey: ["googlePlaceDetails", placeId],
    queryFn: () => fetchPlaceDetails(placeId as string),
    enabled: Boolean(placeId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: false,
  });

export default useGooglePlaceDetails;
