import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { useGetVenuesForGroup } from "../../api/controllerHooks/useGroupVenueController";
import TableStatus from "../../components/TableStatus";
import TablePagination from "../../components/TablePagination";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import { GroupVenueSortParameters } from "../../enums/GroupVenueSortParameters";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<GroupVenueSortParameters>(
    GroupVenueSortParameters.VenueName,
  );
  const [sortDescending, setSortDescending] = useState(false);

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

  const { data, isLoading, isError } = useGetVenuesForGroup(id, {
    pageNumber: page,
    pageSize: pageSize,
    sortBy: sortBy,
    sortDescending: sortDescending,
  });

  const venues = data?.groupVenues ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <>
      <h2 className="mb-1 fw-bold lead">Venues</h2>
      <p className="text-muted small mb-3">
        Venues belonging to this group.
      </p>
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
        isLoading={isLoading}
        isError={isError}
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
              <tr key={x.groupVenueId}>
                <td>{x.venueName}</td>
                <td>{x.visited ? "Yes" : "No"}</td>
                <td>{x.venueType}</td>
                <td>{x.foodType}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableStatus>
    </>
  );
};

export default GroupVenuesPage;
