import type RatingOptionResult from "../../results/generic/RatingOptionResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetRatingOptionResponse extends CommonResponse {
  option?: RatingOptionResult;
}
