import { useState } from "react";
import { MAX_EMAIL_LENGTH } from "../constants/validation";
import { useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useCreateUser } from "../api/controllerHooks/useUserController";

interface Props {
  show: boolean;
  onClose: () => void;
}

const deriveDisplayName = (email: string) => {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  return atIndex > 0 ? trimmed.slice(0, atIndex) : trimmed;
};

const CreateUserModal = ({ show, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState(false);
  const { mutate: createUser, isPending } = useCreateUser();

  const trimmedEmail = email.trim();
  const canSubmit = trimmedEmail.includes("@") && !isPending;

  const handleClose = () => {
    if (isPending) return;
    setEmail("");
    setAdmin(false);
    onClose();
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    createUser(
      {
        email: trimmedEmail,
        displayName: deriveDisplayName(trimmedEmail),
        admin,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
          handleClose();
        },
      },
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton={!isPending}>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small mb-3">
            Create a user from an email address. They'll retain their admin
            status when they log in for the first time.
          </p>
          <Form.Group className="mb-3" controlId="createUserEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              maxLength={MAX_EMAIL_LENGTH}
              autoFocus
            />
          </Form.Group>
          <Form.Check
            type="switch"
            id="createUserAdmin"
            label="Make this user an admin"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            disabled={isPending}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!canSubmit}>
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
              "Create User"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
