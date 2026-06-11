import type CommonResponse from "../generic/CommonResponse";
import type UserResult from "../../results/UserResult";

export default interface GetUserResponse extends CommonResponse {
  user?: UserResult;
}
