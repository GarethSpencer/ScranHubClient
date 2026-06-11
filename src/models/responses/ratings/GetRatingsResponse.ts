import type RatingResult from "../../results/generic/RatingResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetRatingsResponse extends CommonResponse {
  ratings?: RatingResult[];
}
