import type PaginationBaseRequest from "../generic/PaginationBaseRequest";

export default interface SearchGroupRequest extends PaginationBaseRequest {
  searchText: string;
}
