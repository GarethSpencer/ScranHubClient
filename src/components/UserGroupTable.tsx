import Table from "react-bootstrap/Table";
import {
  useGetUserGroups,
  useLeaveGroup,
} from "../api/controllerHooks/useGroupController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./TableStatus";
import useActingState from "../hooks/useActingState";
import type GroupResult from "../models/results/GroupResult";

const UserGroupTable = () => {
  const { data, isLoading, isError } = useGetUserGroups();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate, isPending } = useLeaveGroup();

  const { isActing, mutationCallbacks } = useActingState();

  const groups = data?.userGroups ?? [];
  const currentUserId = currentUser?.user?.userId;

  const onLeaveGroup = (groupId: string) => {
    mutate(groupId, mutationCallbacks(groupId, "delete"));
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">My Joined Groups</h2>
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={groups.length === 0}
        loadingText="Loading your groups..."
        errorText="Couldn't load your groups. Please try again."
      >
        <Table
          striped="columns"
          className="align-middle text-center border-top"
        >
          <thead>
            <tr>
              <th className="w-50">Group Name</th>
              <th className="w-25">Created By</th>
              <th className="w-25">Action</th>
            </tr>
          </thead>
          <tbody>
            {groups
              .filter((x) => x.active)
              .map((x: GroupResult) => (
                <tr key={x.groupId}>
                  <td className="w-50 text-start text-break">{x.groupName}</td>
                  <td className="w-25 text-start text-break">
                    {currentUserId && x.createdBy === currentUserId
                      ? "Me"
                      : x.displayName}
                  </td>
                  <td className="w-25">
                    {currentUserId && x.createdBy !== currentUserId && (
                      <Button
                        variant="danger"
                        onClick={() => onLeaveGroup(x.groupId)}
                        disabled={isPending}
                      >
                        {isActing(x.groupId, "delete") ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Leave Group"
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableStatus>
    </>
  );
};

export default UserGroupTable;
