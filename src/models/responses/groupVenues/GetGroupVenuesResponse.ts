import type GroupVenueResult from "../../results/GroupVenueResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetGroupVenuesResponse extends CommonPaginationResponse {
  groupVenues?: GroupVenueResult[];
}
