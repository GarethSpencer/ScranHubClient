import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import {
  useGetVenuesForGroup,
  useSearchGroupVenues,
} from "../../api/controllerHooks/useGroupVenueController";
import TableStatus from "../../components/TableStatus";
import TablePagination from "../../components/TablePagination";
import GroupVenueRow from "../../components/GroupVenueRow";
import GroupVenueSkeletonRow from "../../components/GroupVenueSkeletonRow";
import CreateGroupVenueModal from "../../components/CreateGroupVenueModal";
import GroupVenueModal from "../../components/GroupVenueModal";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SEARCH_MIN_LENGTH = 3;

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
    label: "Average Quality",
    sortBy: GroupVenueSortParameters.AvgQualityRating,
  },
  { label: "Average Cost", sortBy: GroupVenueSortParameters.AvgCostRating },
];

const GroupVenuesPage = () => {
  const { id = "" } = useParams();

  const [searchText, setSearchText] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const isSearching = searchText.length >= SEARCH_MIN_LENGTH;

  const onSearchTextChange = (newSearchText: string) => {
    setSearchText(newSearchText);
    // Reset to the first page of results whenever the search term changes.
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

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchGroupVenues(id, {
    searchText,
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
      <h2 className="mb-1 fw-bold lead">Venues</h2>
      <p className="text-muted small mb-3">The venues added to this group.</p>

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

      <GroupVenueModal
        groupId={id}
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
      />

      {showSearch && (
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3" controlId="venuesSearch">
            <Form.Control
              type="text"
              placeholder="Search venues by name or type"
              value={searchText}
              onChange={(e) => onSearchTextChange(e.target.value)}
              disabled={isVenuesLoading}
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
            className="align-middle text-center border-top"
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
            className="align-middle text-center border-top"
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
            <div className="position-absolute end-0 d-flex align-items-center gap-2">
              <Form.Label htmlFor="venuesPageSize" className="mb-0 text-nowrap">
                Show
              </Form.Label>
              <Form.Select
                id="venuesPageSize"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                style={{ width: "auto" }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GroupVenuesPage;
