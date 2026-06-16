import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriendsInfinite,
  useUpdateFriend,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useRef, useState } from "react";
import { FriendshipStatus } from "../enums/FriendshipStatus";

type ActingAction = "approve" | "decline" | "delete";
type Acting = { id: string; action: ActingAction };

interface Props {
  showSentRequests: boolean;
}

const PendingFriendRequests = ({ showSentRequests }: Props) => {
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

  const [acting, setActing] = useState<Acting | null>(null);

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

  if (isLoading) return <h3>Please wait</h3>;
  if (isError) return null;

  const friends = (
    data?.pages.flatMap((page) => page.friends ?? []) ?? []
  ).filter((x) => showSentRequests || !x.initiator);
  if (friends.length === 0) return <h3>Nothing to show here</h3>;

  const isPending = isDeletePending || isUpdatePending;

  const onDeleteFriend = (userFriendId: string) => {
    setActing({ id: userFriendId, action: "delete" });
    deleteMutate(userFriendId, {
      onSettled: () => setActing(null),
    });
  };

  const onAcceptFriend = (friendId: string) => {
    setActing({ id: friendId, action: "approve" });
    updateMutate(
      {
        friendId: friendId,
        requestData: {
          status: FriendshipStatus.Accepted,
        },
      },
      {
        onSettled: () => setActing(null),
      },
    );
  };

  const onDeclineFriend = (friendId: string) => {
    setActing({ id: friendId, action: "decline" });
    updateMutate(
      {
        friendId: friendId,
        requestData: {
          status: FriendshipStatus.Declined,
        },
      },
      {
        onSettled: () => setActing(null),
      },
    );
  };

  const isActing = (id: string, action: ActingAction) =>
    acting?.id === id && acting.action === action;

  return (
    <Table striped="columns">
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
            <td>{x.displayName}</td>
            {showSentRequests && <td>{x.initiator ? "Sent" : "Recieved"}</td>}
            <td>
              {x.initiator ? (
                <Button
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
                <>
                  <Button
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
                </>
              )}
            </td>
          </tr>
        ))}
        {hasNextPage && (
          <tr ref={sentinelRef}>
            <td colSpan={3} className="text-center">
              {isFetchingNextPage && <Spinner animation="border" size="sm" />}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default PendingFriendRequests;
