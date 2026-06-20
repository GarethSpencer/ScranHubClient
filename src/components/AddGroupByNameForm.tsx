import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import {
  useJoinGroup,
  useSearchGroups,
} from "../api/controllerHooks/useGroupController";
import useActingState from "../hooks/useActingState";
import type GroupResult from "../models/results/GroupResult";

function AddGroupByNameForm() {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isError } = useSearchGroups({
    searchText,
    pageNumber: page,
    pageSize,
  });
  const { mutate, isPending } = useJoinGroup();

  const { isActing, mutationCallbacks } = useActingState();

  const onJoinGroup = (groupId: string) => {
    mutate(
      groupId,
      mutationCallbacks(groupId, "join", {
        onSuccess: () => setSearchText(""),
      }),
    );
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">By Group Name</h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Label className="mb-3">
            Start typing the name of a group list of matching groups created by
            your friends, then join them.
          </Form.Label>
          <Form.Control
            type="text"
            name="groupName"
            placeholder="Enter group name"
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
      {data?.groups && (
        <>
          <Table striped="columns" className="align-middle text-center">
            <thead>
              <tr>
                <th colSpan={2}>Group Name</th>
              </tr>
            </thead>
            <tbody>
              {data.groups.map((x: GroupResult) => (
                <tr key={x.groupId}>
                  <td className="w-50 text-start text-break">{x.groupName}</td>
                  <td className="w-50">
                    <Button
                      onClick={() => onJoinGroup(x.groupId)}
                      disabled={isPending}
                    >
                      {isActing(x.groupId, "join") ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Join Group"
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

export default AddGroupByNameForm;
