export default interface UpdateGroupVenueRequest {
  venueName: string;
  visited: boolean;
  foodTypeOptionId?: string;
  venueTypeOptionId?: string;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
