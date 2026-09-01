export default interface CreateGroupVenueRequest {
  venueName: string;
  groupId: string;
  visited: boolean;
  visitedOn?: string;
  foodTypeOptionId?: string;
  venueTypeOptionId?: string;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
