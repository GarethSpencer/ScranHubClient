import type RatingOptionResult from "../../results/generic/RatingOptionResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetRatingOptionsResponse extends CommonResponse {
  options?: RatingOptionResult[];
}
