import type PaginationBaseRequest from "../generic/PaginationBaseRequest";

export default interface SearchUserRequest extends PaginationBaseRequest {
  searchText: string;
}
