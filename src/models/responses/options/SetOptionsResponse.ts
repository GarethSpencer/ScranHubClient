import type CommonResponse from "../generic/CommonResponse";

export default interface SetOptionsResponse extends CommonResponse {
  optionsIds?: string[];
}
