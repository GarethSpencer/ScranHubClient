import { useContext } from "react";
import RatingCelebrationContext from "./ratingCelebrationContext";

const useRatingCelebration = () => useContext(RatingCelebrationContext);

export default useRatingCelebration;
