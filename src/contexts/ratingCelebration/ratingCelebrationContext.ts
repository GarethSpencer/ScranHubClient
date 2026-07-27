import React from "react";

interface RatingCelebrationContextType {
  notifyRatingsSaved: () => void;

  consumeRecentSave: () => boolean;
}

const RatingCelebrationContext =
  React.createContext<RatingCelebrationContextType>({
    notifyRatingsSaved: () => {},
    consumeRecentSave: () => false,
  });

export default RatingCelebrationContext;
