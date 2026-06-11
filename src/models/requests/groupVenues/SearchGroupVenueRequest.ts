import type PaginationBaseRequest from "../generic/PaginationBaseRequest";

export default interface SearchGroupVenueRequest extends PaginationBaseRequest {
  searchText?: string;
}
