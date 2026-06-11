import type GroupResult from "../../results/GroupResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetGroupResponse extends CommonResponse {
  group?: GroupResult;
}
