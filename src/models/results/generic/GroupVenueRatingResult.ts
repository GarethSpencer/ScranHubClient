import type RatingVenueResult from "./RatingVenueResult";

export default interface GroupVenueRatingResult {
  groupId: string;
  groupVenueId: string;
  venueName: string;
  ratingVenueResult: RatingVenueResult[];
}
