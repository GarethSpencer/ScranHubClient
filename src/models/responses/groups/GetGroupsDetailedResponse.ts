import type GroupDetailedResult from "../../results/GroupDetailedResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetGroupsDetailedResponse extends CommonPaginationResponse {
  groups?: GroupDetailedResult[];
}
