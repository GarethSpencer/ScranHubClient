import type UserDetailedResult from "../../results/UserDetailedResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetUsersDetailedResponse extends CommonPaginationResponse {
  users?: UserDetailedResult[];
}
