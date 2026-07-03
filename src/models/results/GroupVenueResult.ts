export default interface GroupVenueResult {
  groupVenueId: string;
  groupId: string;
  venueName: string;
  venueType?: string;
  foodType?: string;
  visited: boolean;
  visitedOn?: string;
  averageCostRating?: number;
  averageQualityRating?: number;
  myCostRating?: number;
  myQualityRating?: number;
  costRatingVotes?: number;
  qualityRatingVotes?: number;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
