import type CommonResponse from "./CommonResponse";

export default interface CommonPaginationResponse extends CommonResponse {
  totalCount: number;
}
