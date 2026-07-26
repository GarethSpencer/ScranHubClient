import Alert from "react-bootstrap/Alert";
import { MAX_EMAIL_LENGTH } from "../constants/validation";
import Form from "react-bootstrap/Form";
import { useAddFriendByEmail } from "../api/controllerHooks/useUserController";
import { useState } from "react";
import SaveButton from "./common/SaveButton";
import useSaveFeedback from "../hooks/useSaveFeedback";

function AddFriendByEmailForm() {
  const { mutateAsync, isError } = useAddFriendByEmail();
  const saveFeedback = useSaveFeedback();
  const [email, setEmail] = useState("");

  const canSubmit = email.trim() !== "" && !saveFeedback.isBusy;

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    saveFeedback.save(
      () => mutateAsync({ email: email.trim() }),
      () => {
        setEmail("");
        saveFeedback.reset();
      },
    );
  };

  return (
    <>
      <h2 className="mb-1 lead">By Email</h2>
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
            disabled={saveFeedback.isBusy}
            maxLength={MAX_EMAIL_LENGTH}
          />
        </Form.Group>
        {isError && (
          <Alert variant="danger">
            Failed to complete the request. Please try again.
          </Alert>
        )}
        <div className="d-grid">
          <SaveButton
            type="submit"
            status={saveFeedback.status}
            label="Send Request"
            savingLabel="Sending..."
            savedLabel="Request Sent!"
            disabled={email.trim() === ""}
          />
        </div>
      </Form>
    </>
  );
}

export default AddFriendByEmailForm;
