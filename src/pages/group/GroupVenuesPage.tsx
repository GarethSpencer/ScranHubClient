import { useParams } from "react-router-dom";
import { MAX_VENUE_NAME_LENGTH } from "../../constants/validation";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import {
  useGetVenuesForGroup,
  useSearchGroupVenues,
} from "../../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../../api/controllerHooks/useOptionController";
import TableStatus from "../../components/common/TableStatus";
import TablePagination from "../../components/common/TablePagination";
import GroupVenueRow from "../../components/GroupVenueRow";
import GroupVenueSkeletonRow from "../../components/GroupVenueSkeletonRow";
import CreateGroupVenueModal from "../../components/CreateGroupVenueModal";
import GroupVenueModal from "../../components/GroupVenueModal";
import VenueCard from "../../components/venue/VenueCard";
import VenueDetailsModal from "../../components/venue/VenueDetailsModal";
import VenueRatingsModal from "../../components/venue/VenueRatingsModal";
import MobileSortControl from "../../components/venue/MobileSortControl";
import TablePageSizeSelect from "../../components/common/TablePageSizeSelect";
import useDebounce from "../../hooks/useDebounce";
import useIsMobile from "../../hooks/useIsMobile";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  SEARCH_MIN_LENGTH,
} from "../../constants/pagination";

type SortableColumn = {
  label: string;
  sortBy: GroupVenueSortParameters;
};

const COLUMNS: SortableColumn[] = [
  { label: "Name", sortBy: GroupVenueSortParameters.VenueName },
  { label: "Visited", sortBy: GroupVenueSortParameters.Visited },
  { label: "Venue Type", sortBy: GroupVenueSortParameters.VenueType },
  { label: "Food Type", sortBy: GroupVenueSortParameters.FoodType },
  {
    label: "My Quality Rating",
    sortBy: GroupVenueSortParameters.MyQualityRating,
  },
  { label: "My Cost Rating", sortBy: GroupVenueSortParameters.MyCostRating },
];

const GroupVenuesPage = () => {
  const { id = "" } = useParams();

  const isMobile = useIsMobile();

  const [searchText, setSearchText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailsVenue, setDetailsVenue] = useState<GroupVenueResult | null>(
    null,
  );
  const [ratingsVenue, setRatingsVenue] = useState<GroupVenueResult | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<GroupVenueSortParameters>(
    GroupVenueSortParameters.VenueName,
  );
  const [sortDescending, setSortDescending] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const searchPageSize = SEARCH_PAGE_SIZE;

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
    isFetching: isVenuesFetching,
    isError: isVenuesError,
  } = useGetVenuesForGroup(id, {
    pageNumber: page,
    pageSize: pageSize,
    sortBy: sortBy,
    sortDescending: sortDescending,
  });

  const isVenuesPending =
    isVenuesLoading || isVenuesPlaceholder || isVenuesFetching;

  const { data: qualityOptionData } = useGetOptionsForGroup(
    "QualityOption",
    id,
  );
  const { data: costOptionData } = useGetOptionsForGroup("CostOption", id);
  const qualityOptions = qualityOptionData?.options ?? [];
  const costOptions = costOptionData?.options ?? [];

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

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 lead">Venue Management</h2>
      <p className="text-muted small mb-3">
        Add, view, edit and rate the venues for the group. Select a venue to
        amend details and enter your own ratings.
      </p>

      <div className="d-grid mx-auto mb-3">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Add Venue
        </Button>
      </div>

      <CreateGroupVenueModal
        show={showCreateModal}
        groupId={id}
        onClose={() => setShowCreateModal(false)}
      />

      {!isMobile && (
        <GroupVenueModal
          groupId={id}
          venue={detailsVenue}
          onClose={() => setDetailsVenue(null)}
        />
      )}
      {isMobile && (
        <>
          <VenueDetailsModal
            groupId={id}
            venue={detailsVenue}
            onClose={() => setDetailsVenue(null)}
          />
          <VenueRatingsModal
            groupId={id}
            venue={ratingsVenue}
            onClose={() => setRatingsVenue(null)}
          />
        </>
      )}

      {showSearch && (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="venuesSearch">
            <Form.Control
              type="text"
              placeholder="Search venues by name or type"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              disabled={isVenuesLoading}
              maxLength={MAX_VENUE_NAME_LENGTH}
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
            className="d-none d-md-table align-middle text-center border-top group-venue-table"
          >
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.sortBy}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((x: GroupVenueResult) => (
                <GroupVenueRow
                  key={x.groupVenueId}
                  venue={x}
                  qualityOptions={qualityOptions}
                  costOptions={costOptions}
                  onSelect={setDetailsVenue}
                />
              ))}
            </tbody>
          </Table>

          <div className="d-md-none venue-card-list border-top">
            {searchResults.map((x: GroupVenueResult) => (
              <VenueCard
                key={x.groupVenueId}
                venue={x}
                qualityOptions={qualityOptions}
                costOptions={costOptions}
                onEditDetails={setDetailsVenue}
                onEditRatings={setRatingsVenue}
              />
            ))}
          </div>

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
            className="d-none d-md-table align-middle text-center border-top group-venue-table"
          >
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.sortBy}
                    role="button"
                    aria-sort={
                      sortBy === column.sortBy
                        ? sortDescending
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                    onClick={() => onSort(column.sortBy)}
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
                ))}
              </tr>
            </thead>
            <tbody>
              {isVenuesPending
                ? Array.from({ length: skeletonRowCount }, (_, index) => (
                    <GroupVenueSkeletonRow key={index} />
                  ))
                : venues.map((x: GroupVenueResult) => (
                    <GroupVenueRow
                      key={x.groupVenueId}
                      venue={x}
                      qualityOptions={qualityOptions}
                      costOptions={costOptions}
                      onSelect={setDetailsVenue}
                    />
                  ))}
            </tbody>
          </Table>

          {!isVenuesPending && (
            <div className="d-md-none">
              <MobileSortControl
                id="venuesMobileSort"
                options={COLUMNS.map((c) => ({
                  label: c.label,
                  value: c.sortBy,
                }))}
                sortBy={sortBy}
                sortDescending={sortDescending}
                onSortByChange={(value) => {
                  setSortBy(value);
                  setSortDescending(false);
                  setPage(1);
                }}
                onToggleDirection={() => {
                  setSortDescending((prev) => !prev);
                  setPage(1);
                }}
              />
            </div>
          )}

          <div className="d-md-none venue-card-list border-top">
            {isVenuesPending
              ? Array.from({ length: skeletonRowCount }, (_, index) => (
                  <div key={index} className="venue-card venue-card-skeleton" />
                ))
              : venues.map((x: GroupVenueResult) => (
                  <VenueCard
                    key={x.groupVenueId}
                    venue={x}
                    qualityOptions={qualityOptions}
                    costOptions={costOptions}
                    onEditDetails={setDetailsVenue}
                    onEditRatings={setRatingsVenue}
                  />
                ))}
          </div>

          <div className="pagination-row">
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <TablePageSizeSelect
              id="venuesPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GroupVenuesPage;
