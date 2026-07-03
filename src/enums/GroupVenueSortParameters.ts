export const GroupVenueSortParameters = {
  VenueName: "VenueName",
  VisitedOn: "VisitedOn",
  FoodType: "FoodType",
  VenueType: "VenueType",
  AvgCostRating: "AvgCostRating",
  AvgQualityRating: "AvgQualityRating",
  MyCostRating: "MyCostRating",
  MyQualityRating: "MyQualityRating",
  CostRatingVotes: "CostRatingVotes",
  QualityRatingVotes: "QualityRatingVotes",
} as const;

export type GroupVenueSortParameters =
  (typeof GroupVenueSortParameters)[keyof typeof GroupVenueSortParameters];
