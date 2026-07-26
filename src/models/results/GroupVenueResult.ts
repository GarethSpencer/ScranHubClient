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
  myCostRated: boolean;
  myQualityRated: boolean;
  myVibeRated: boolean;
  costRatingVotes?: number;
  qualityRatingVotes?: number;
  vibeRatingVotes?: number;
  googlePlaceId?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  distanceMiles?: number;
}
