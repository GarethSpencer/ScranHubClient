import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./common/TableStatus";
import TablePagination from "./common/TablePagination";
import useActingState from "../hooks/useActingState";
import { useState } from "react";
import { FriendshipStatus } from "../enums/FriendshipStatus";

const UserFriendTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetFriends({
    pageNumber: page,
    pageSize: pageSize,
    status: FriendshipStatus.Accepted,
  });
  const { mutate, isPending } = useDeleteFriend();

  const { isActing, mutationCallbacks } = useActingState();

  const friends = data?.friends ?? [];
  const totalCount = data?.totalCount ?? 0;

  const onDeleteFriend = (userFriendId: string) => {
    mutate(
      userFriendId,
      mutationCallbacks(userFriendId, "delete", {
        onSuccess: () => {
          if (page > 1 && totalCount <= (page - 1) * pageSize + 1) {
            setPage(page - 1);
          }
        },
      }),
    );
  };

  return (
    <>
      <h2 className="mb-1 lead">My Friends</h2>
      <p className="text-muted small mb-3">
        Everyone you're currently friends with. Delete a friend to remove them
        from your list.
      </p>
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={friends.length === 0}
        loadingText="Loading your friends…"
        errorText="Couldn't load your friends. Please try again."
      >
        <Table
          striped="columns"
          className="align-middle text-center border-top"
        >
          <tbody>
            {friends.map((x: FriendResult) => (
              <tr key={x.userFriendId}>
                <td className="w-50 text-start text-break">{x.displayName}</td>
                <td className="w-50">
                  <Button
                    variant="danger"
                    onClick={() => onDeleteFriend(x.userFriendId)}
                    disabled={isPending}
                  >
                    {isActing(x.userFriendId, "delete") ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination
          page={page}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </TableStatus>
    </>
  );
};

export default UserFriendTable;
