import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import {
  useAddFriend,
  useSearchUsers,
} from "../api/controllerHooks/useUserController";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import type UserResult from "../models/results/UserResult";

function AddFriendByDisplayNameForm() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isError } = useSearchUsers({
    searchText,
    pageNumber: page,
    pageSize,
  });
  const { mutate, isPending } = useAddFriend();

  const onAddFriend = (userId: string) => {
    mutate(userId);
    setSearchText("");
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">By Display Name</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Label className="mb-3">
            Start typing the display name of another ScranHub user to show a
            list of matching users, then send them a friend request.
          </Form.Label>
          <Form.Control
            type="text"
            name="displayName"
            placeholder="Enter display name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Form.Group>
        {isError && (
          <Alert variant="danger">
            Failed to complete the request. Please try again.
          </Alert>
        )}
      </Form>
      {data?.users && (
        <>
          <Table striped="columns" className="align-middle text-center">
            <thead>
              <tr>
                <th colSpan={2}>Display Name</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((x: UserResult) => (
                <tr key={x.userId}>
                  <td className="w-50 text-start">{x.displayName}</td>
                  <td className="w-50">
                    <Button
                      onClick={() => onAddFriend(x.userId)}
                      disabled={isPending}
                    >
                      {isPending ? "Please Wait" : "Send Friend Request"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {Math.ceil((data.totalCount ?? 0) / pageSize) > 1 && (
            <Pagination>
              {Array.from(
                { length: Math.ceil((data.totalCount ?? 0) / pageSize) },
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
        </>
      )}
    </>
  );
}

export default AddFriendByDisplayNameForm;
