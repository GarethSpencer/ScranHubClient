import type UserResult from "../../results/UserResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetUsersResponse extends CommonPaginationResponse {
  users?: UserResult[];
}
