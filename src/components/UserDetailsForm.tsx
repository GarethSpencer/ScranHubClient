import type { SubmitEvent } from "react";
import { useEffect } from "react";
import { useGetCurrentUser, useUpdateUser } from "../api/controllerHooks/useUserController";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

interface Props {
  setShowUserDetailsModal: (input: boolean) => void;
  onUpdateUserPendingChange: (isPending: boolean) => void;
}

const UserDetailsForm = ({
  setShowUserDetailsModal,
  onUpdateUserPendingChange,
}: Props) => {
  const { data, isLoading, isError } = useGetCurrentUser();

  const updateUserMutation = useUpdateUser(data?.user?.userId ?? "");

  useEffect(() => {
    onUpdateUserPendingChange(updateUserMutation.isPending);
  }, [updateUserMutation.isPending, onUpdateUserPendingChange]);

  if (isLoading) return null;

  if (isError) return null;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get("displayName") as string;

    if (displayName === data?.user?.displayName) {
      setShowUserDetailsModal(false);
      return;
    }

    updateUserMutation.mutate(
      {
        displayName,
        admin: data!.user!.admin,
        active: data!.user!.active,
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
          defaultValue={data?.user?.displayName}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder={data?.user?.email} disabled />
        <Form.Text className="text-muted">
          Your email is never shared with anyone else.
        </Form.Text>
      </Form.Group>
      {updateUserMutation.isError && (
        <Alert variant="danger">
          Failed to update username. Please try again.
        </Alert>
      )}
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
    </Form>
  );
};

export default UserDetailsForm;
