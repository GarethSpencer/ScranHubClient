import { useEffect, useMemo, useRef, useState } from "react";
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
  const [sortBy, setSortBy] = useState<GroupVenueSortParameters>(
    GroupVenueSortParameters.VisitedOn,
  );
  const [sortDescending, setSortDescending] = useState(true);
  const searchPageSize = SEARCH_PAGE_SIZE;
  const venueSentinelRef = useRef<HTMLDivElement>(null);
  const searchSentinelRef = useRef<HTMLDivElement>(null);

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
  };

  const onSort = (column: GroupVenueSortParameters) => {
    if (sortBy === column) {
      setSortDescending((prev) => !prev);
    } else {
      setSortBy(column);
      setSortDescending(false);
    }
  };

  const onSortByChange = (value: GroupVenueSortParameters) => {
    setSortBy(value);
    setSortDescending(false);
  };

  const onToggleDirection = () => {
    setSortDescending((prev) => !prev);
  };

  const {
    data: venuesData,
    isLoading: isVenuesLoading,
    isError: isVenuesError,
    fetchNextPage: fetchNextVenuesPage,
    hasNextPage: hasNextVenuesPage,
    isFetchingNextPage: isFetchingNextVenuesPage,
    isFetchNextPageError: isFetchNextVenuesPageError,
  } = useGetVenuesForGroup(groupId, {
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy,
    sortDescending,
  });

  const isVenuesPending = isVenuesLoading;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
    isFetchNextPageError: isFetchNextSearchPageError,
  } = useSearchGroupVenues(groupId, {
    searchText: debouncedSearchText,
    pageSize: searchPageSize,
  });

  useEffect(() => {
    const sentinel = venueSentinelRef.current;
    if (!sentinel || !hasNextVenuesPage || isFetchNextVenuesPageError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextVenuesPage) {
          fetchNextVenuesPage();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    fetchNextVenuesPage,
    hasNextVenuesPage,
    isFetchNextVenuesPageError,
    isFetchingNextVenuesPage,
  ]);

  useEffect(() => {
    const sentinel = searchSentinelRef.current;
    if (!sentinel || !hasNextSearchPage || isFetchNextSearchPageError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextSearchPage) {
          fetchNextSearchPage();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    fetchNextSearchPage,
    hasNextSearchPage,
    isFetchNextSearchPageError,
    isFetchingNextSearchPage,
  ]);

  const venues = venuesData?.pages.flatMap((page) => page.groupVenues ?? []) ?? [];

  const searchResults =
    searchData?.pages.flatMap((page) => page.groupVenues ?? []) ?? [];

  const totalCount = venuesData?.pages.at(-1)?.totalCount ?? 0;
  const showSearch = totalCount > 0 || isVenuesPending || isSearching;

  const skeletonRowCount = DEFAULT_PAGE_SIZE;

  return {
    columns,
    hasUserLocation,

    searchText,
    onSearchTextChange,
    isSearching,
    searchResults,
    isSearchLoading,
    isSearchError: isSearchError && !searchData,
    isFetchingNextSearchPage,
    isFetchNextSearchPageError,
    fetchNextSearchPage,
    hasNextSearchPage,
    searchSentinelRef,
    venues,
    totalCount,
    isVenuesLoading,
    isVenuesPending,
    isVenuesError: isVenuesError && !venuesData,
    isFetchingNextVenuesPage,
    isFetchNextVenuesPageError,
    fetchNextVenuesPage,
    hasNextVenuesPage,
    venueSentinelRef,

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
