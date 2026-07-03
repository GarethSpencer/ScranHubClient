import type GroupVenueResult from "../../models/results/GroupVenueResult";

export const venueHasInfo = (venue: GroupVenueResult) =>
  venue.latitude != null && venue.longitude != null;
