import type { SubmitEvent } from "react";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiClient from "../api/apiClient";
import type GetUserDetailedResponse from "../models/responses/GetUserDetailedResponse";
import type UpdateUserRequest from "../models/requests/UpdateUserRequest";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

interface Props {
  setShowUserDetailsModal: (input: boolean) => void;
  onUpdateUserSuccess: () => void;
  onUpdateUserPendingChange: (isPending: boolean) => void;
}

const UserDetailsForm = ({
  setShowUserDetailsModal,
  onUpdateUserSuccess,
  onUpdateUserPendingChange,
}: Props) => {
  const apiClient = new ApiClient<GetUserDetailedResponse>("/user/me");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userInfo", "me"],
    queryFn: apiClient.get,
  });

  const queryClient = useQueryClient();
  const updateUserApiClient = new ApiClient<void>("/user");
  const updateUserMutation = useMutation({
    mutationFn: (request: UpdateUserRequest) =>
      updateUserApiClient.patch(data!.user.userId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo", "me"] });
      setShowUserDetailsModal(false);
      onUpdateUserSuccess();
    },
  });

  useEffect(() => {
    onUpdateUserPendingChange(updateUserMutation.isPending);
  }, [updateUserMutation.isPending, onUpdateUserPendingChange]);

  if (isLoading) return null;

  if (isError) return null;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get("displayName") as string;

    if (displayName === data?.user.displayName) {
      setShowUserDetailsModal(false);
      return;
    }

    updateUserMutation.mutate({
      displayName,
      admin: data!.user.admin,
      active: data!.user.active,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formUserName">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="displayName"
          defaultValue={data?.user.displayName}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder={data?.user.email} disabled />
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
