import type UserAdminResult from "../../results/UserAdminResult";
import type CommonPaginationResponse from "../generic/CommonPaginationResponse";

export default interface GetUsersDetailedResponse extends CommonPaginationResponse {
  users?: UserAdminResult[];
}
