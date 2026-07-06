import { useState } from "react";
import { MAX_NAME_LENGTH } from "../../constants/validation";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import {
  useGetAllGroups,
  useSearchAllGroups,
} from "../../api/controllerHooks/useAdminController";
import TableStatus from "../../components/common/TableStatus";
import TableScrollContainer from "../../components/common/TableScrollContainer";
import TablePagination from "../../components/common/TablePagination";
import AdminGroupRow from "../../components/AdminGroupRow";
import AdminGroupSkeletonRow from "../../components/AdminGroupSkeletonRow";
import TablePageSizeSelect from "../../components/common/TablePageSizeSelect";
import {
  DEFAULT_PAGE_SIZE,
  SEARCH_PAGE_SIZE,
  SEARCH_MIN_LENGTH,
} from "../../constants/pagination";
import useDebounce from "../../hooks/useDebounce";
import type GroupDetailedResult from "../../models/results/GroupDetailedResult";

const COLUMNS = [
  "Group Name",
  "Active",
  "Users",
  "Venues",
  "Created By",
  "Created On",
  "Last Updated",
  "Actions",
];

interface GroupsTableProps {
  groups: GroupDetailedResult[];
  isPending: boolean;
  skeletonRowCount: number;
}

const GroupsTable = ({
  groups,
  isPending,
  skeletonRowCount,
}: GroupsTableProps) => (
  <TableScrollContainer>
    <Table striped="columns" className="align-middle text-center border-top">
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <th key={column} className="text-nowrap">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isPending
          ? Array.from({ length: skeletonRowCount }, (_, index) => (
              <AdminGroupSkeletonRow key={index} />
            ))
          : groups.map((x) => <AdminGroupRow key={x.groupId} group={x} />)}
      </tbody>
    </Table>
  </TableScrollContainer>
);

const AdminGroupsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const [searchText, setSearchText] = useState("");
  const [searchPage, setSearchPage] = useState(1);

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

  const {
    data: groupsData,
    isLoading: isGroupsLoading,
    isPlaceholderData: isGroupsPlaceholder,
    isFetching: isGroupsFetching,
    isError: isGroupsError,
  } = useGetAllGroups({ pageNumber: page, pageSize: pageSize });

  const isGroupsPending =
    isGroupsLoading || isGroupsPlaceholder || isGroupsFetching;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchAllGroups({
    searchText: debouncedSearchText,
    pageNumber: searchPage,
    pageSize: SEARCH_PAGE_SIZE,
  });

  const groups = groupsData?.groups ?? [];
  const totalCount = groupsData?.totalCount ?? 0;

  const searchResults = searchData?.groups ?? [];
  const searchTotalCount = searchData?.totalCount ?? 0;

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 lead">Groups</h2>
      <p className="text-muted small mb-3">
        All groups created on ScranHub, ordered by group name.
      </p>

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="groupsSearch">
          <Form.Control
            type="text"
            placeholder="Search groups by name"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
          />
        </Form.Group>
      </Form>

      {isSearching ? (
        <TableStatus
          isLoading={isSearchLoading}
          isError={isSearchError}
          isEmpty={searchResults.length === 0}
          loadingText="Searching groups..."
          errorText="Couldn't search groups. Please try again."
          emptyText="No groups match your search"
        >
          <GroupsTable
            groups={searchResults}
            isPending={false}
            skeletonRowCount={0}
          />
          <div className="d-flex justify-content-center">
            <TablePagination
              page={searchPage}
              totalCount={searchTotalCount}
              pageSize={SEARCH_PAGE_SIZE}
              onPageChange={setSearchPage}
            />
          </div>
        </TableStatus>
      ) : isGroupsError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load groups. Please try again.
        </p>
      ) : !isGroupsPending && groups.length === 0 ? (
        <p className="text-center mb-0">No groups yet</p>
      ) : (
        <>
          <GroupsTable
            groups={groups}
            isPending={isGroupsPending}
            skeletonRowCount={skeletonRowCount}
          />
          <div className="pagination-row">
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <TablePageSizeSelect
              id="groupsPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AdminGroupsPage;
