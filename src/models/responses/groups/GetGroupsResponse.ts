import type GroupResult from "../../results/GroupResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetGroupsResponse extends CommonPaginationResponse {
  groups?: GroupResult[];
}
