export const GroupVenueSortParameters = {
  VenueName: "VenueName",
  VisitedOn: "VisitedOn",
  FoodType: "FoodType",
  VenueType: "VenueType",
  AvgCostRating: "AvgCostRating",
  AvgQualityRating: "AvgQualityRating",
  AvgVibeRating: "AvgVibeRating",
  MyCostRating: "MyCostRating",
  MyQualityRating: "MyQualityRating",
  MyVibeRating: "MyVibeRating",
  CostRatingVotes: "CostRatingVotes",
  QualityRatingVotes: "QualityRatingVotes",
  VibeRatingVotes: "VibeRatingVotes",
} as const;

export type GroupVenueSortParameters =
  (typeof GroupVenueSortParameters)[keyof typeof GroupVenueSortParameters];
