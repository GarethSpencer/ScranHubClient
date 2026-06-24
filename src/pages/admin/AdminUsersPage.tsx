import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
  useGetAllUsers,
  useSearchAllUsers,
} from "../../api/controllerHooks/useAdminController";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import TableStatus from "../../components/TableStatus";
import TablePagination from "../../components/TablePagination";
import AdminUserRow from "../../components/AdminUserRow";
import AdminUserSkeletonRow from "../../components/AdminUserSkeletonRow";
import CreateUserModal from "../../components/CreateUserModal";
import TablePageSizeSelect from "../../components/admin/TablePageSizeSelect";
import {
  SEARCH_PAGE_SIZE,
  SEARCH_MIN_LENGTH,
} from "../../components/admin/adminTableConstants";
import useDebounce from "../../hooks/useDebounce";
import type UserAdminResult from "../../models/results/UserAdminResult";

const COLUMNS = [
  "Display Name",
  "Authenticated",
  "Active",
  "Admin",
  "Created On",
  "Last Updated",
  "Actions",
];

interface UsersTableProps {
  users: UserAdminResult[];
  currentUserId?: string;
  isPending: boolean;
  skeletonRowCount: number;
}

const UsersTable = ({
  users,
  currentUserId,
  isPending,
  skeletonRowCount,
}: UsersTableProps) => (
  <Table
    responsive
    striped="columns"
    className="align-middle text-center border-top"
  >
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
            <AdminUserSkeletonRow key={index} />
          ))
        : users.map((x) => (
            <AdminUserRow
              key={x.userId}
              user={x}
              isCurrentUser={x.userId === currentUserId}
            />
          ))}
    </tbody>
  </Table>
);

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");
  const [searchPage, setSearchPage] = useState(1);

  const [showCreateModal, setShowCreateModal] = useState(false);

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
    data: usersData,
    isLoading: isUsersLoading,
    isPlaceholderData: isUsersPlaceholder,
    isError: isUsersError,
  } = useGetAllUsers({ pageNumber: page, pageSize: pageSize });

  const isUsersPending = isUsersLoading || isUsersPlaceholder;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchAllUsers({
    searchText: debouncedSearchText,
    pageNumber: searchPage,
    pageSize: SEARCH_PAGE_SIZE,
  });

  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const users = usersData?.users ?? [];
  const totalCount = usersData?.totalCount ?? 0;

  const searchResults = searchData?.users ?? [];
  const searchTotalCount = searchData?.totalCount ?? 0;

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 lead">Users</h2>
      <p className="text-muted small mb-3">
        All users registered on ScranHub, ordered by display name.
      </p>

      <div className="d-grid mx-auto mb-3">
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Create User
        </Button>
      </div>

      <CreateUserModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="usersSearch">
          <Form.Control
            type="text"
            placeholder="Search users by display name"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            maxLength={30}
          />
        </Form.Group>
      </Form>

      {isSearching ? (
        <TableStatus
          isLoading={isSearchLoading}
          isError={isSearchError}
          isEmpty={searchResults.length === 0}
          loadingText="Searching users..."
          errorText="Couldn't search users. Please try again."
          emptyText="No users match your search"
        >
          <UsersTable
            users={searchResults}
            currentUserId={currentUserId}
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
      ) : isUsersError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load users. Please try again.
        </p>
      ) : !isUsersPending && users.length === 0 ? (
        <p className="text-center mb-0">No users yet</p>
      ) : (
        <>
          <UsersTable
            users={users}
            currentUserId={currentUserId}
            isPending={isUsersPending}
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
              id="usersPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AdminUsersPage;
