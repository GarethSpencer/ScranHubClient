import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { useAddFriendByEmail } from "../api/controllerHooks/useUserController";
import { useRef } from "react";

function AddFriendByEmailForm() {
  const { mutate, isPending, isError } = useAddFriendByEmail();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const emailAddress = formData.get("email") as string;

    mutate(
      { email: emailAddress },
      {
        onSuccess: () => formRef.current?.reset(),
      },
    );
  };

  return (
    <>
      <h2 className="mb-3 fw-bold lead">By Email</h2>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label className="mb-3">
            Enter the full email address of another ScranHub user to send them a
            friend request.
          </Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" />
        </Form.Group>
        {isError && (
          <Alert variant="danger">
            Failed to complete the request. Please try again.
          </Alert>
        )}
        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={isPending}>
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
