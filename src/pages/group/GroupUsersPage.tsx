import { useParams } from "react-router-dom";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Placeholder from "react-bootstrap/Placeholder";
import {
  useGetGroup,
  useGetGroupMembers,
} from "../../api/controllerHooks/useGroupController";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import TablePagination from "../../components/common/TablePagination";
import TablePageSizeSelect from "../../components/common/TablePageSizeSelect";
import { DEFAULT_PAGE_SIZE } from "../../constants/pagination";
import type UserResult from "../../models/results/UserResult";

const GroupUsersPage = () => {
  const { id = "" } = useParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const onPageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const { data, isLoading, isPlaceholderData, isError } = useGetGroupMembers(
    id,
    { pageNumber: page, pageSize: pageSize },
  );

  const { data: groupData } = useGetGroup(id);
  const { data: currentUserData } = useGetCurrentUser();

  const creatorId = groupData?.group?.createdBy;
  const currentUserId = currentUserData?.user?.userId;

  const isPending = isLoading || isPlaceholderData;

  const members = data?.users ?? [];
  const totalCount = data?.totalCount ?? 0;

  const skeletonRowCount =
    totalCount > 0
      ? Math.min(pageSize, Math.max(1, totalCount - (page - 1) * pageSize))
      : pageSize;

  return (
    <>
      <h2 className="mb-1 lead">Users</h2>
      <p className="text-muted small mb-3">All members of this group.</p>

      {isError ? (
        <p className="text-muted text-center mb-0">
          Couldn't load members. Please try again.
        </p>
      ) : !isPending && members.length === 0 ? (
        <p className="text-center mb-0">No members yet</p>
      ) : (
        <>
          <Table
            responsive
            striped="columns"
            className="align-middle text-center border-top"
          >
            <thead>
              <tr>
                <th className="text-start">Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: skeletonRowCount }, (_, index) => (
                    <tr key={index} aria-hidden="true">
                      <Placeholder
                        as="td"
                        animation="glow"
                        className="text-start"
                      >
                        <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder as="td" animation="glow">
                        <Placeholder xs={4} />
                      </Placeholder>
                    </tr>
                  ))
                : members.map((member: UserResult) => (
                    <tr key={member.userId}>
                      <td className="text-start">
                        {member.displayName}
                        {member.userId === currentUserId && (
                          <Badge bg="primary" className="ms-2">
                            Me
                          </Badge>
                        )}
                        {member.userId === creatorId && (
                          <Badge bg="secondary" className="ms-2">
                            Creator
                          </Badge>
                        )}
                      </td>
                      <td>
                        {member.active ? (
                          <Badge bg="success">Active</Badge>
                        ) : (
                          <Badge bg="warning">Inactive</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
          <div className="pagination-row">
            <TablePagination
              page={page}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
            />
            <TablePageSizeSelect
              id="groupUsersPageSize"
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default GroupUsersPage;
