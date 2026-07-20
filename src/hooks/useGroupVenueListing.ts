import { useMemo, useState } from "react";
import {
  useGetVenuesForGroup,
  useSearchGroupVenues,
} from "../api/controllerHooks/useGroupVenueController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import useDebounce from "./useDebounce";
import { GroupVenueSortParameters } from "../enums/GroupVenueSortParameters";
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  SEARCH_MIN_LENGTH,
} from "../constants/pagination";

export interface VenueListingColumn {
  label: string;
  sortBy?: GroupVenueSortParameters;
}

const DISTANCE_COLUMN: VenueListingColumn = {
  label: "Distance",
  sortBy: GroupVenueSortParameters.Distance,
};

const useGroupVenueListing = (
  groupId: string,
  baseColumns: VenueListingColumn[],
) => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<GroupVenueSortParameters>(
    GroupVenueSortParameters.VenueName,
  );
  const [sortDescending, setSortDescending] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const searchPageSize = SEARCH_PAGE_SIZE;

  const { data: currentUserData } = useGetCurrentUser();
  const currentUser = currentUserData?.user;
  const hasUserLocation =
    currentUser?.latitude != null && currentUser?.longitude != null;

  const columns = useMemo<VenueListingColumn[]>(() => {
    if (!hasUserLocation) return baseColumns;
    const [nameColumn, ...rest] = baseColumns;
    return [nameColumn, DISTANCE_COLUMN, ...rest];
  }, [hasUserLocation, baseColumns]);

  const debouncedSearchText = useDebounce(searchText);
  const isSearching = debouncedSearchText.length >= SEARCH_MIN_LENGTH;

  const onSearchTextChange = (newSearchText: string) => {
    setSearchText(newSearchText);
    setSearchPage(1);
  };

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const onSort = (column: GroupVenueSortParameters) => {
    if (sortBy === column) {
      setSortDescending((prev) => !prev);
    } else {
      setSortBy(column);
      setSortDescending(false);
    }
    setPage(1);
  };

  const onSortByChange = (value: GroupVenueSortParameters) => {
    setSortBy(value);
    setSortDescending(false);
    setPage(1);
  };

  const onToggleDirection = () => {
    setSortDescending((prev) => !prev);
    setPage(1);
  };

  const {
    data: venuesData,
    isLoading: isVenuesLoading,
    isPlaceholderData: isVenuesPlaceholder,
    isFetching: isVenuesFetching,
    isError: isVenuesError,
  } = useGetVenuesForGroup(groupId, {
    pageNumber: page,
    pageSize,
    sortBy,
    sortDescending,
  });

  const isVenuesPending =
    isVenuesLoading || isVenuesPlaceholder || isVenuesFetching;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchGroupVenues(groupId, {
    searchText: debouncedSearchText,
    pageNumber: searchPage,
    pageSize: searchPageSize,
  });

  const venues = venuesData?.groupVenues ?? [];
  const totalCount = venuesData?.totalCount ?? 0;

  const searchResults = searchData?.groupVenues ?? [];
  const searchTotalCount = searchData?.totalCount ?? 0;

  const showSearch = totalCount > 0 || isVenuesPending || isSearching;

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return {
    columns,
    hasUserLocation,

    searchText,
    onSearchTextChange,
    isSearching,
    searchResults,
    searchTotalCount,
    isSearchLoading,
    isSearchError,
    searchPage,
    setSearchPage,

    venues,
    totalCount,
    isVenuesLoading,
    isVenuesPending,
    isVenuesError,

    page,
    setPage,
    pageSize,
    onPageSizeChange,

    sortBy,
    sortDescending,
    onSort,
    onSortByChange,
    onToggleDirection,

    showSearch,
    skeletonRowCount,
  };
};

export default useGroupVenueListing;
