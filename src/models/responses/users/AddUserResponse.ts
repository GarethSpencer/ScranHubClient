import type CommonResponse from "../generic/CommonResponse";

export default interface AddUserResponse extends CommonResponse {
  userId?: string;
}
