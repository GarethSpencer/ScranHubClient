export const GroupVenueSortParameters = {
  VenueName: "VenueName",
  Visited: "Visited",
  FoodType: "FoodType",
  VenueType: "VenueType",
} as const;

export type GroupVenueSortParameters =
  (typeof GroupVenueSortParameters)[keyof typeof GroupVenueSortParameters];
