export default interface CreateGroupVenueRequest {
  venueName: string;
  groupId: string;
  foodTypeOptionId?: string;
  venueTypeOptionId?: string;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
