import type { SubmitEvent } from "react";
import { MAX_NAME_LENGTH } from "../../constants/validation";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import type { UseMutationResult } from "@tanstack/react-query";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import type CommonResponse from "../../models/responses/generic/CommonResponse";
import type UpdateUserRequest from "../../models/requests/users/UpdateUserRequest";

interface Props {
  setShowUserDetailsModal: (input: boolean) => void;
  updateUserMutation: UseMutationResult<
    CommonResponse,
    Error,
    UpdateUserRequest
  >;
}

const UserDetailsForm = ({
  setShowUserDetailsModal,
  updateUserMutation,
}: Props) => {
  const { data, isLoading, isError } = useGetCurrentUser();

  const user = data?.user;

  if (isLoading) return null;

  if (isError) return null;

  if (!user) return null;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get("displayName") as string;

    if (displayName === user.displayName) {
      setShowUserDetailsModal(false);
      return;
    }

    updateUserMutation.mutate(
      {
        displayName,
        admin: user.admin,
        active: user.active,
      },
      { onSuccess: () => setShowUserDetailsModal(false) },
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formUserName">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="displayName"
          defaultValue={user.displayName}
          maxLength={MAX_NAME_LENGTH}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder={user.email} disabled />
        <Form.Text className="text-muted">
          Your email is never shared with anyone else.
        </Form.Text>
      </Form.Group>
      {updateUserMutation.isError && (
        <Alert variant="danger">
          Failed to update username. Please try again.
        </Alert>
      )}
      <div className="d-grid">
        <Button
          variant="primary"
          type="submit"
          disabled={updateUserMutation.isPending}
        >
          {updateUserMutation.isPending ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Updating...
            </>
          ) : (
            "Update Username"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default UserDetailsForm;
