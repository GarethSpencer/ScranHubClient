import React, { useCallback, useMemo, useRef } from "react";
import RatingCelebrationContext from "./ratingCelebrationContext";

const RECENT_SAVE_WINDOW_MS = 10000;

interface Props {
  children: React.ReactNode;
}

const RatingCelebrationProvider = ({ children }: Props) => {
  const savedAtRef = useRef<number | null>(null);

  const notifyRatingsSaved = useCallback(() => {
    savedAtRef.current = Date.now();
  }, []);

  const consumeRecentSave = useCallback(() => {
    const savedAt = savedAtRef.current;
    if (savedAt === null) return false;

    savedAtRef.current = null;
    return Date.now() - savedAt <= RECENT_SAVE_WINDOW_MS;
  }, []);

  const value = useMemo(
    () => ({ notifyRatingsSaved, consumeRecentSave }),
    [notifyRatingsSaved, consumeRecentSave],
  );

  return (
    <RatingCelebrationContext.Provider value={value}>
      {children}
    </RatingCelebrationContext.Provider>
  );
};

export default RatingCelebrationProvider;
