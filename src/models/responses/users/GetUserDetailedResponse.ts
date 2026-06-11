import type CommonResponse from "../generic/CommonResponse";
import type UserDetailedResult from "../../results/UserDetailedResult";

export default interface GetUserDetailedResponse extends CommonResponse {
  user?: UserDetailedResult;
}
