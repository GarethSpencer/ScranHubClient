import type PaginationBaseRequest from "../generic/PaginationBaseRequest";

export default interface SortablePaginationRequest extends PaginationBaseRequest {
  sortBy: string;
  sortDescending: boolean;
}
