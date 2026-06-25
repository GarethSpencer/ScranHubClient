import Form from "react-bootstrap/Form";
import { MAX_NAME_LENGTH } from "../constants/validation";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const canSubmit = groupName.trim() !== "";

  const onCreated = () => {
    setShowModal(false);
    setGroupName("");
  };

  return (
    <>
      <h2 className="mb-1 lead">Create a Group</h2>
      <p className="text-muted small mb-3">
        Enter a name for your new group, then create it to allow your friends to
        join.
      </p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) setShowModal(true);
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
              maxLength={MAX_NAME_LENGTH}
            />
            <Button
              type="submit"
              disabled={!canSubmit}
              className="text-nowrap flex-md-shrink-0"
            >
              Create Group
            </Button>
          </div>
        </Form.Group>
      </Form>
      <CreateGroupModal
        show={showModal}
        groupName={groupName}
        onClose={() => setShowModal(false)}
        onCreated={onCreated}
      />
    </>
  );
};

export default CreateGroupForm;
