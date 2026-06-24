export default interface GroupVenueResult {
  groupVenueId: string;
  groupId: string;
  venueName: string;
  venueType?: string;
  foodType?: string;
  visited: boolean;
  averageCostRating?: number;
  averageQualityRating?: number;
  myCostRating?: number;
  myQualityRating?: number;
  costRatingVotes?: number;
  qualityRatingVotes?: number;
}
