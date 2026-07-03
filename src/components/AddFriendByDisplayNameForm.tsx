import Alert from "react-bootstrap/Alert";
import { MAX_NAME_LENGTH } from "../constants/validation";
import Form from "react-bootstrap/Form";
import {
  useAddFriend,
  useSearchUsers,
} from "../api/controllerHooks/useUserController";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import useActingState from "../hooks/useActingState";
import useDebounce from "../hooks/useDebounce";
import type UserResult from "../models/results/UserResult";

function AddFriendByDisplayNameForm() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const debouncedSearchText = useDebounce(searchText);
  const { data, isError, isFetching } = useSearchUsers({
    searchText: debouncedSearchText,
    pageNumber: page,
    pageSize,
  });
  const { mutate, isPending } = useAddFriend();

  const { isActing, mutationCallbacks } = useActingState();

  const isSearching =
    searchText.length >= 3 &&
    (isFetching || debouncedSearchText !== searchText);

  const onAddFriend = (userId: string) => {
    mutate(
      userId,
      mutationCallbacks(userId, "add", {
        onSuccess: () => setSearchText(""),
      }),
    );
  };

  return (
    <>
      <h2 className="mb-1 mt-3 mt-md-0 lead">By Display Name</h2>
      <p className="text-muted small mb-3">
        Start typing the display name of another ScranHub user to show a list of
        matching users, then send them a friend request.
      </p>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Control
            type="text"
            name="displayName"
            placeholder="Enter display name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
          />
        </Form.Group>
        {isError && (
          <Alert variant="danger">
            Failed to complete the request. Please try again.
          </Alert>
        )}
      </Form>
      {isSearching && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Searching…</span>
          </Spinner>
        </div>
      )}
      {!isSearching && data?.users && (
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
                  <td className="w-50 text-start text-break">
                    {x.displayName}
                  </td>
                  <td className="w-50">
                    <Button
                      onClick={() => onAddFriend(x.userId)}
                      disabled={isPending}
                    >
                      {isActing(x.userId, "add") ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Send Friend Request"
                      )}
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
