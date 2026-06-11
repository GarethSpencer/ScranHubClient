import type RatingResult from "../../results/generic/RatingResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetRatingResponse extends CommonResponse {
  rating?: RatingResult;
}
