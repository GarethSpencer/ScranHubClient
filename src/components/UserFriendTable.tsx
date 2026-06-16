import Table from "react-bootstrap/Table";
import {
  useDeleteFriend,
  useGetFriends,
} from "../api/controllerHooks/useUserController";
import type FriendResult from "../models/results/FriendResult";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
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

  if (isLoading) return <h3>Please wait</h3>;
  if (isError) return null;
  if (!data?.friends) return <h3>Nothing to show here</h3>;

  const onDeleteFriend = (userFriendId: string) => {
    mutate(userFriendId, {
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

export default UserFriendTable;
