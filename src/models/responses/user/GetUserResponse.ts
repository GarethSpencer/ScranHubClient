import type UserResult from "../../results/UserResult";

export default interface GetUserResponse {
  user?: UserResult;
  statusCode: string;
  message?: string;
}
