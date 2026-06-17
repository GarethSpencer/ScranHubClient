import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import TableStatus from "./TableStatus";
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

  const friends = data?.friends ?? [];
  const totalCount = data?.totalCount ?? 0;

  const onDeleteFriend = (userFriendId: string) => {
    mutate(userFriendId, {
      onSuccess: () => {
        if (page > 1 && totalCount <= (page - 1) * pageSize + 1) {
          setPage(page - 1);
        }
      },
    });
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">My Friends</h2>
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
                    onClick={() => onDeleteFriend(x.userFriendId)}
                    disabled={isPending}
                  >
                    {isPending ? "Please Wait" : "Delete"}
                  </Button>
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

export default UserFriendTable;
