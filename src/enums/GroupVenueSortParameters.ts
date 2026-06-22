export const GroupVenueSortParameters = {
  VenueName: "VenueName",
  Visited: "Visited",
  FoodType: "FoodType",
  VenueType: "VenueType",
  AvgCostRating: "AvgCostRating",
  AvgQualityRating: "AvgQualityRating",
} as const;

export type GroupVenueSortParameters =
  (typeof GroupVenueSortParameters)[keyof typeof GroupVenueSortParameters];
