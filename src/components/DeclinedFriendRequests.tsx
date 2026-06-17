import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
  useUpdateFriend,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import TableStatus from "./TableStatus";
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

  const friends = data?.friends ?? [];
  const totalCount = data?.totalCount ?? 0;
  const isPending = isDeletePending || isUpdatePending;

  const onDeleteFriend = (userFriendId: string) => {
    deleteMutate(userFriendId, {
      onSuccess: () => {
        if (page > 1 && totalCount <= (page - 1) * pageSize + 1) {
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
        if (page > 1 && totalCount <= (page - 1) * pageSize + 1) {
          setPage(page - 1);
        }
      },
    });
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">Declined Requests</h2>
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
                <td className="w-50 text-start text-break">
                  {x.displayName}
                </td>
                <td className="w-50">
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {Math.ceil(totalCount / pageSize) > 1 && (
          <Pagination>
            {Array.from(
              { length: Math.ceil(totalCount / pageSize) },
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
        )}
      </TableStatus>
    </>
  );
};

export default DeclinedFriendRequests;
