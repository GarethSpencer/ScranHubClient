import type GroupVenueRatingResult from "../../results/generic/GroupVenueRatingResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetGroupRatingsResponse extends CommonResponse {
  groupVenueRatingsResults?: GroupVenueRatingResult[];
}
