import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import { useCreateGroup } from "../api/controllerHooks/useGroupController";

const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const { mutate, isPending } = useCreateGroup();

  const onCreateGroup = () => {
    mutate(
      { groupName: groupName.trim() },
      {
        onSuccess: () => setGroupName(""),
      },
    );
  };

  const canSubmit = groupName.trim() !== "" && !isPending;

  return (
    <>
      <h2 className="mb-1 fw-bold lead">Create a Group</h2>
      <p className="text-muted small mb-3">
        Enter a name for your new group, then create it to allow your friends to
        join.
      </p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) onCreateGroup();
        }}
      >
        <Form.Group className="mb-3" controlId="formCreateGroupName">
          <div className="d-flex flex-column flex-md-row gap-2">
            <Form.Control
              type="text"
              name="groupName"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isPending}
            />
            <Button
              type="submit"
              disabled={!canSubmit}
              className="text-nowrap flex-md-shrink-0"
            >
              {isPending ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </Form.Group>
      </Form>
    </>
  );
};

export default CreateGroupForm;
