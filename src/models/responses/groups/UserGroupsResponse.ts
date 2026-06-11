import type GroupResult from "../../results/GroupResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface UserGroupsResponse extends CommonResponse {
  userId?: string;
  userGroups?: GroupResult[];
}
