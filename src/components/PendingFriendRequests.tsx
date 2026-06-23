import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriendsInfinite,
  useUpdateFriend,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./TableStatus";
import useActingState from "../hooks/useActingState";
import { useEffect, useRef } from "react";
import { FriendshipStatus } from "../enums/FriendshipStatus";

interface Props {
  showSentRequests: boolean;
  showHeader: boolean;
}

const PendingFriendRequests = ({ showSentRequests, showHeader }: Props) => {
  const pageSize = 10;
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFriendsInfinite({
    pageSize: pageSize,
    status: FriendshipStatus.Pending,
  });

  const { mutate: deleteMutate, isPending: isDeletePending } =
    useDeleteFriend();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateFriend();

  const { isActing, mutationCallbacks } = useActingState();

  const sentinelRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "50px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const friends = (
    data?.pages.flatMap((page) => page.friends ?? []) ?? []
  ).filter((x) => showSentRequests || !x.initiator);

  const isPending = isDeletePending || isUpdatePending;

  const onDeleteFriend = (userFriendId: string) => {
    deleteMutate(userFriendId, mutationCallbacks(userFriendId, "delete"));
  };

  const onAcceptFriend = (friendId: string) => {
    updateMutate(
      {
        friendId: friendId,
        requestData: {
          status: FriendshipStatus.Accepted,
        },
      },
      mutationCallbacks(friendId, "approve"),
    );
  };

  const onDeclineFriend = (friendId: string) => {
    updateMutate(
      {
        friendId: friendId,
        requestData: {
          status: FriendshipStatus.Declined,
        },
      },
      mutationCallbacks(friendId, "decline"),
    );
  };

  return (
    <>
      {showHeader && (
        <>
          <h2 className="mb-1 lead">Pending Requests</h2>
          <p className="text-muted small mb-3">
            Friend requests you've sent and received. Approve or decline
            requests sent to you, or cancel requests you've sent.
          </p>
        </>
      )}
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={friends.length === 0}
        loadingText="Loading pending requests…"
        errorText="Couldn't load pending requests. Please try again."
      >
        <Table striped="columns" className="align-middle text-center">
          <thead>
            <tr>
              <th>Display Name</th>
              {showSentRequests && <th>Sent / Received</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((x: FriendResult) => (
              <tr key={x.userFriendId}>
                <td className="text-start text-break">{x.displayName}</td>
                {showSentRequests && (
                  <td>{x.initiator ? "Sent" : "Recieved"}</td>
                )}
                <td>
                  {x.initiator ? (
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
                  ) : (
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
                        onClick={() => onDeclineFriend(x.friendId)}
                        disabled={isPending}
                      >
                        {isActing(x.friendId, "decline") ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Decline"
                        )}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {hasNextPage && (
              <tr ref={sentinelRef}>
                <td colSpan={3} className="text-center">
                  {isFetchingNextPage && (
                    <Spinner animation="border" size="sm" />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableStatus>
    </>
  );
};

export default PendingFriendRequests;
