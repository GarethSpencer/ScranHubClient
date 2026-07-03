export default interface UpdateGroupVenueRequest {
  venueName: string;
  visited: boolean;
  visitedOn?: string;
  foodTypeOptionId?: string;
  venueTypeOptionId?: string;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
