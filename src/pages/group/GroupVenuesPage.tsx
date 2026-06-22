import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import {
  useGetVenuesForGroup,
  useSearchGroupVenues,
} from "../../api/controllerHooks/useGroupVenueController";
import TableStatus from "../../components/TableStatus";
import TablePagination from "../../components/TablePagination";
import GroupVenueRow from "../../components/GroupVenueRow";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SEARCH_MIN_LENGTH = 3;

type SortableColumn = {
  label: string;
  sortBy: GroupVenueSortParameters;
};

const COLUMNS: SortableColumn[] = [
  { label: "Venue Name", sortBy: GroupVenueSortParameters.VenueName },
  { label: "Visited", sortBy: GroupVenueSortParameters.Visited },
  { label: "Venue Type", sortBy: GroupVenueSortParameters.VenueType },
  { label: "Food Type", sortBy: GroupVenueSortParameters.FoodType },
];

const GroupVenuesPage = () => {
  const { id = "" } = useParams();

  const [searchText, setSearchText] = useState("");

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
    isError: isVenuesError,
  } = useGetVenuesForGroup(id, {
    pageNumber: page,
    pageSize: pageSize,
    sortBy: sortBy,
    sortDescending: sortDescending,
  });

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

  return (
    <>
      <h2 className="mb-1 fw-bold lead">Venues</h2>
      <p className="text-muted small mb-3">The venues added to this group.</p>

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="venuesSearch">
          <Form.Control
            type="text"
            placeholder="Search venues by name or type"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
          />
        </Form.Group>
      </Form>

      {isSearching ? (
        <TableStatus
          isLoading={isSearchLoading}
          isError={isSearchError}
          isEmpty={searchResults.length === 0}
          loadingText="Searching venues..."
          errorText="Couldn't search venues. Please try again."
          emptyText="No venues match your search"
        >
          <TablePagination
            page={searchPage}
            totalCount={searchTotalCount}
            pageSize={searchPageSize}
            onPageChange={setSearchPage}
          />
          <Table
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
                <GroupVenueRow key={x.groupVenueId} venue={x} />
              ))}
            </tbody>
          </Table>
        </TableStatus>
      ) : (
        <>
          <div className="d-flex align-items-center gap-2 mb-3">
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
          <TableStatus
            isLoading={isVenuesLoading}
            isError={isVenuesError}
            isEmpty={venues.length === 0}
            loadingText="Loading venues..."
            errorText="Couldn't load venues. Please try again."
            emptyText="No venues yet"
          >
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <Table
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
                {venues.map((x: GroupVenueResult) => (
                  <GroupVenueRow key={x.groupVenueId} venue={x} />
                ))}
              </tbody>
            </Table>
          </TableStatus>
        </>
      )}
    </>
  );
};

export default GroupVenuesPage;
