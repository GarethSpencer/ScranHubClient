import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import {
  useGetVenuesForGroup,
  useSearchGroupVenues,
} from "../../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../../api/controllerHooks/useOptionController";
import { useGetRatingsForGroup } from "../../api/controllerHooks/useRatingController";
import { useGetGroupMembers } from "../../api/controllerHooks/useGroupController";
import TableStatus from "../../components/TableStatus";
import TablePagination from "../../components/TablePagination";
import RatingDetailsRow from "../../components/RatingDetailsRow";
import RatingDetailsSkeletonRow from "../../components/RatingDetailsSkeletonRow";
import RatingDetailsModal from "../../components/RatingDetailsModal";
import TablePageSizeSelect from "../../components/admin/TablePageSizeSelect";
import useDebounce from "../../hooks/useDebounce";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingVenueResult from "../../models/results/generic/RatingVenueResult";
import type GroupVenueRatingResult from "../../models/results/generic/GroupVenueRatingResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";

const SEARCH_MIN_LENGTH = 3;

type Column = {
  label: string;
  sortBy?: GroupVenueSortParameters;
};

const COLUMNS: Column[] = [
  { label: "Name", sortBy: GroupVenueSortParameters.VenueName },
  { label: "Visited", sortBy: GroupVenueSortParameters.Visited },
  { label: "Venue Type", sortBy: GroupVenueSortParameters.VenueType },
  { label: "Food Type", sortBy: GroupVenueSortParameters.FoodType },
  {
    label: "Quality Votes",
    sortBy: GroupVenueSortParameters.QualityRatingVotes,
  },
  { label: "Cost Votes", sortBy: GroupVenueSortParameters.CostRatingVotes },
  { label: "Avg Quality", sortBy: GroupVenueSortParameters.AvgQualityRating },
  { label: "Avg Cost", sortBy: GroupVenueSortParameters.AvgCostRating },
];

const ratingsForVenue = (
  groupVenueRatings: GroupVenueRatingResult[] | undefined,
  groupVenueId: string,
): RatingVenueResult[] =>
  groupVenueRatings?.find((x) => x.groupVenueId === groupVenueId)?.ratings ??
  [];

const RatingDetailsPage = () => {
  const { id = "" } = useParams();

  const [searchText, setSearchText] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<GroupVenueResult | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<GroupVenueSortParameters>(
    GroupVenueSortParameters.VenueName,
  );
  const [sortDescending, setSortDescending] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const searchPageSize = 10;

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

  const {
    data: venuesData,
    isLoading: isVenuesLoading,
    isPlaceholderData: isVenuesPlaceholder,
    isError: isVenuesError,
  } = useGetVenuesForGroup(id, {
    pageNumber: page,
    pageSize: pageSize,
    sortBy: sortBy,
    sortDescending: sortDescending,
  });

  const isVenuesPending = isVenuesLoading || isVenuesPlaceholder;

  const { data: qualityOptionData } = useGetOptionsForGroup(
    "QualityOption",
    id,
  );
  const { data: costOptionData } = useGetOptionsForGroup("CostOption", id);
  const qualityOptions = qualityOptionData?.options ?? [];
  const costOptions = costOptionData?.options ?? [];

  const { data: qualityRatingsData, isLoading: isQualityRatingsLoading } =
    useGetRatingsForGroup("QualityRating", id);
  const { data: costRatingsData, isLoading: isCostRatingsLoading } =
    useGetRatingsForGroup("CostRating", id);

  const areRatingsLoading = isQualityRatingsLoading || isCostRatingsLoading;

  const { data: membersData } = useGetGroupMembers(id, {
    pageNumber: 1,
    pageSize: 1,
  });
  const memberCount = membersData?.totalCount ?? 0;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchGroupVenues(id, {
    searchText: debouncedSearchText,
    pageNumber: searchPage,
    pageSize: searchPageSize,
  });

  const venues = venuesData?.groupVenues ?? [];
  const totalCount = venuesData?.totalCount ?? 0;

  const searchResults = searchData?.groupVenues ?? [];
  const searchTotalCount = searchData?.totalCount ?? 0;

  const showSearch = totalCount > 0 || isVenuesPending || isSearching;

  const selectedVenueId = selectedVenue?.groupVenueId ?? "";

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 lead">Venue Summary</h2>
      <p className="text-muted small mb-3">
        A read-only summary of every venue in the group. Press a row to see how
        each member of your group rated it.
      </p>

      <RatingDetailsModal
        venue={selectedVenue}
        qualityRatings={ratingsForVenue(
          qualityRatingsData?.groupVenueRatingsResults,
          selectedVenueId,
        )}
        costRatings={ratingsForVenue(
          costRatingsData?.groupVenueRatingsResults,
          selectedVenueId,
        )}
        qualityOptions={qualityOptions}
        costOptions={costOptions}
        isLoading={areRatingsLoading}
        onClose={() => setSelectedVenue(null)}
      />

      {showSearch && (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="ratingDetailsSearch">
            <Form.Control
              type="text"
              placeholder="Search venues by name or type"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              disabled={isVenuesLoading}
              maxLength={50}
            />
          </Form.Group>
        </Form>
      )}

      {isSearching ? (
        <TableStatus
          isLoading={isSearchLoading}
          isError={isSearchError}
          isEmpty={searchResults.length === 0}
          loadingText="Searching venues..."
          errorText="Couldn't search venues. Please try again."
          emptyText="No venues match your search"
        >
          <Table
            responsive
            striped="columns"
            className="align-middle text-center border-top group-venue-table"
          >
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.label}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((x: GroupVenueResult) => (
                <RatingDetailsRow
                  key={x.groupVenueId}
                  venue={x}
                  qualityOptions={qualityOptions}
                  costOptions={costOptions}
                  memberCount={memberCount}
                  onSelect={setSelectedVenue}
                />
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center">
            <TablePagination
              page={searchPage}
              totalCount={searchTotalCount}
              pageSize={searchPageSize}
              onPageChange={setSearchPage}
            />
          </div>
        </TableStatus>
      ) : isVenuesError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load venues. Please try again.
        </p>
      ) : !isVenuesPending && venues.length === 0 ? (
        <p className="text-center mb-0">No venues yet</p>
      ) : (
        <>
          <Table
            responsive
            striped="columns"
            className="align-middle text-center border-top group-venue-table"
          >
            <thead>
              <tr>
                {COLUMNS.map((column) =>
                  column.sortBy === undefined ? (
                    <th key={column.label}>{column.label}</th>
                  ) : (
                    <th
                      key={column.label}
                      role="button"
                      aria-sort={
                        sortBy === column.sortBy
                          ? sortDescending
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                      onClick={() => onSort(column.sortBy!)}
                      className="user-select-none"
                    >
                      {column.label}{" "}
                      {sortBy === column.sortBy ? (
                        sortDescending ? (
                          <FaSortDown />
                        ) : (
                          <FaSortUp />
                        )
                      ) : (
                        <FaSort className="text-muted" />
                      )}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isVenuesPending
                ? Array.from({ length: skeletonRowCount }, (_, index) => (
                    <RatingDetailsSkeletonRow key={index} />
                  ))
                : venues.map((x: GroupVenueResult) => (
                    <RatingDetailsRow
                      key={x.groupVenueId}
                      venue={x}
                      qualityOptions={qualityOptions}
                      costOptions={costOptions}
                      memberCount={memberCount}
                      onSelect={setSelectedVenue}
                    />
                  ))}
            </tbody>
          </Table>
          <div
            className="position-relative d-flex justify-content-center align-items-center"
            style={{ minHeight: "38px" }}
          >
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <TablePageSizeSelect
              id="ratingDetailsPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default RatingDetailsPage;
