import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
  useUpdateFriend,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./common/TableStatus";
import TablePagination from "./common/TablePagination";
import useActingState from "../hooks/useActingState";
import { useState } from "react";
import { FriendshipStatus } from "../enums/FriendshipStatus";

const DeclinedFriendRequests = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetFriends({
    pageNumber: page,
    pageSize: pageSize,
    status: FriendshipStatus.Declined,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteFriend();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateFriend();

  const { isActing, mutationCallbacks } = useActingState();

  const friends = data?.friends ?? [];
  const totalCount = data?.totalCount ?? 0;
  const isPending = isDeletePending || isUpdatePending;

  const decrementPageIfNeeded = () => {
    if (page > 1 && totalCount <= (page - 1) * pageSize + 1) {
      setPage(page - 1);
    }
  };

  const onDeleteFriend = (userFriendId: string) => {
    deleteMutate(
      userFriendId,
      mutationCallbacks(userFriendId, "delete", {
        onSuccess: decrementPageIfNeeded,
      }),
    );
  };

  const onAcceptFriend = (friendId: string) => {
    const request = {
      friendId: friendId,
      requestData: {
        status: FriendshipStatus.Accepted,
      },
    };

    updateMutate(
      request,
      mutationCallbacks(friendId, "approve", {
        onSuccess: decrementPageIfNeeded,
      }),
    );
  };

  return (
    <>
      <h2 className="mb-1 lead">Declined Requests</h2>
      <p className="text-muted small mb-3">
        Requests you've previously declined. You can approve them here, or
        delete the request (this will allow them to send another).
      </p>
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={friends.length === 0}
        loadingText="Loading declined requests…"
        errorText="Couldn't load declined requests. Please try again."
      >
        <Table striped="columns" className="align-middle text-center">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((x: FriendResult) => (
              <tr key={x.userFriendId}>
                <td className="w-50 text-start text-break">{x.displayName}</td>
                <td className="w-50">
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <Button
                      variant="success"
                      onClick={() => onAcceptFriend(x.friendId)}
                      disabled={isPending}
                    >
                      {isActing(x.friendId, "approve") ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
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
                  </div>
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

export default DeclinedFriendRequests;
