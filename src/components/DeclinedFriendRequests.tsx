import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
  useUpdateFriend,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
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

  if (isLoading) return <h3>Please wait</h3>;
  if (isError) return null;
  if (!data?.friends) return <h3>Nothing to show here</h3>;

  const isPending = isDeletePending || isUpdatePending;

  const onDeleteFriend = (userFriendId: string) => {
    deleteMutate(userFriendId, {
      onSuccess: () => {
        if (page > 1 && data.totalCount <= (page - 1) * pageSize + 1) {
          setPage(page - 1);
        }
      },
    });
  };

  const onAcceptFriend = (friendId: string) => {
    const request = {
      friendId: friendId,
      requestData: {
        status: FriendshipStatus.Accepted,
      },
    };

    updateMutate(request, {
      onSuccess: () => {
        if (page > 1 && data.totalCount <= (page - 1) * pageSize + 1) {
          setPage(page - 1);
        }
      },
    });
  };

  return (
    <>
      <Table striped="columns">
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.friends.map((x: FriendResult) => (
            <tr key={x.userFriendId}>
              <td>{x.displayName}</td>
              <td>
                <>
                  <Button
                    onClick={() => onAcceptFriend(x.friendId)}
                    disabled={isPending}
                  >
                    {isPending ? "Please Wait" : "Approve"}
                  </Button>
                  <Button
                    onClick={() => onDeleteFriend(x.userFriendId)}
                    disabled={isPending}
                  >
                    {isPending ? "Please Wait" : "Delete"}
                  </Button>
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from(
          { length: Math.ceil(data.totalCount / pageSize) },
          (_, index) => index + 1,
        ).map((pageNumber) => (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === page}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ))}
      </Pagination>
    </>
  );
};

export default DeclinedFriendRequests;
