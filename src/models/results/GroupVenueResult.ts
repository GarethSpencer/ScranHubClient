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
  averageVibeRating?: number;
  myCostRating?: number;
  myQualityRating?: number;
  myVibeRating?: number;
  costRatingVotes?: number;
  qualityRatingVotes?: number;
  vibeRatingVotes?: number;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
