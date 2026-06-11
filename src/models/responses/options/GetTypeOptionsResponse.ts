import type TypeOptionResult from "../../results/generic/TypeOptionResult";
import type CommonResponse from "../generic/CommonResponse";

export default interface GetTypeOptionsResponse extends CommonResponse {
  options?: TypeOptionResult[];
}
