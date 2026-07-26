import type GroupVenueResult from "../models/results/GroupVenueResult";

export const venueHasInfo = (venue: GroupVenueResult) =>
  venue.latitude != null && venue.longitude != null;

export const venueHasMyRatings = (venue: GroupVenueResult) =>
  venue.myQualityRated || venue.myCostRated || venue.myVibeRated;

export const venueNeedsMyRatings = (venue: GroupVenueResult) =>
  venue.visited && !venueHasMyRatings(venue);

export const formatDistanceMiles = (miles: number) =>
  miles < 0.01 ? "<0.01 mi" : `${miles.toFixed(2)} mi`;
