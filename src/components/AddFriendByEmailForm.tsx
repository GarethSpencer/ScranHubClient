import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { useAddFriendByEmail } from "../api/controllerHooks/useUserController";
import { useState } from "react";

function AddFriendByEmailForm() {
  const { mutate, isPending, isError } = useAddFriendByEmail();
  const [email, setEmail] = useState("");

  const canSubmit = email.trim() !== "" && !isPending;

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    mutate(
      { email: email.trim() },
      {
        onSuccess: () => setEmail(""),
      },
    );
  };

  return (
    <>
      <h2 className="mb-1 fw-bold lead">By Email</h2>
      <p className="text-muted small mb-3">
        Enter the full email address of another ScranHub user to send them a
        friend request.
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </Form.Group>
        {isError && (
          <Alert variant="danger">
            Failed to complete the request. Please try again.
          </Alert>
        )}
        <div className="d-grid">
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
                Processing...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
      </Form>
    </>
  );
}

export default AddFriendByEmailForm;
