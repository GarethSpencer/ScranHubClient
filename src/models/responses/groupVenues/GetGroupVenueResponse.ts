import type GroupVenueResult from "../../results/GroupVenueResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetGroupVenueResponse extends CommonResponse {
  groupVenue?: GroupVenueResult;
}
