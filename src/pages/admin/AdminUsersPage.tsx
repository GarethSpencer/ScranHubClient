import { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { useGetAllUsers } from "../../api/controllerHooks/useAdminController";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import TablePagination from "../../components/TablePagination";
import AdminUserRow from "../../components/AdminUserRow";
import AdminUserSkeletonRow from "../../components/AdminUserSkeletonRow";
import type UserAdminResult from "../../models/results/UserAdminResult";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const COLUMNS = [
  "Display Name",
  "Authenticated",
  "Active",
  "Admin",
  "Created On",
  "Last Updated",
  "Actions",
];

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const users = usersData?.users ?? [];
  const totalCount = usersData?.totalCount ?? 0;

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 fw-bold lead">Users</h2>
      <p className="text-muted small mb-3">
        All users registered on ScranHub, ordered by display name.
      </p>

      {isUsersError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load users. Please try again.
        </p>
      ) : !isUsersPending && users.length === 0 ? (
        <p className="text-center mb-0">No users yet</p>
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
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isUsersPending
                ? Array.from({ length: skeletonRowCount }, (_, index) => (
                    <AdminUserSkeletonRow key={index} />
                  ))
                : users.map((x: UserAdminResult) => (
                    <AdminUserRow
                      key={x.userId}
                      user={x}
                      isCurrentUser={x.userId === currentUserId}
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
              <Form.Label htmlFor="usersPageSize" className="mb-0 text-nowrap">
                Show
              </Form.Label>
              <Form.Select
                id="usersPageSize"
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

export default AdminUsersPage;
