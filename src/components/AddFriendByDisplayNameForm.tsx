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
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Label>
            Enter the full or partial display name of another ScranHub user to
            show a list of matching users. Then you can send them a friend
            request
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
      <Table striped="columns">
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.map((x: UserResult) => (
            <tr key={x.userId}>
              <td>{x.displayName}</td>
              <td>
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
      <Pagination>
        {Array.from(
          { length: Math.ceil((data?.totalCount ?? 0) / pageSize) },
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
}

export default AddFriendByDisplayNameForm;
