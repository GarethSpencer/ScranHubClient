import type { SubmitEvent } from "react";
import { MAX_NAME_LENGTH } from "../../constants/validation";
import { useGetCurrentUser } from "../../api/controllerHooks/useUserController";
import useVenuePlaceSearch from "../../hooks/useVenuePlaceSearch";
import { useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import PlaceAutocomplete, {
  type SelectedPlace,
} from "../common/PlaceAutocomplete";
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

  const queryClient = useQueryClient();

  const user = data?.user;

  const {
    useAutocomplete,
    onAutocompleteUnavailable,
    selectPlace,
    clear,
    displayedAddress,
    placeFields,
  } = useVenuePlaceSearch({
    initialFields: {
      googlePlaceId: user?.googlePlaceId,
      formattedAddress: user?.formattedAddress,
      latitude: user?.latitude,
      longitude: user?.longitude,
    },
  });

  if (isLoading) return null;

  if (isError) return null;

  if (!user) return null;

  const handlePlaceSelect = (place: SelectedPlace) => selectPlace(place);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = formData.get("displayName") as string;

    const { googlePlaceId, latitude, longitude } = placeFields;

    const nameUnchanged = displayName === user.displayName;
    const locationUnchanged =
      (latitude ?? null) === (user.latitude ?? null) &&
      (longitude ?? null) === (user.longitude ?? null) &&
      (googlePlaceId ?? null) === (user.googlePlaceId ?? null);

    if (nameUnchanged && locationUnchanged) {
      setShowUserDetailsModal(false);
      return;
    }

    updateUserMutation.mutate(
      {
        displayName,
        admin: user.admin,
        active: user.active,
        ...placeFields,
      },
      {
        onSuccess: () => {
          if (!locationUnchanged) {
            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey[0] === "groups" &&
                query.queryKey[2] === "venues",
            });
          }
          setShowUserDetailsModal(false);
        },
      },
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
          Your email is never shared with other users.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formUserLocation">
        <Form.Label>Start location</Form.Label>
        {useAutocomplete ? (
          <PlaceAutocomplete
            onSelect={handlePlaceSelect}
            onUnavailable={onAutocompleteUnavailable}
            disabled={updateUserMutation.isPending}
            placeholder="Set your starting address"
            includedPrimaryTypes={["geocode"]}
          />
        ) : (
          <Form.Control
            type="text"
            value={displayedAddress ?? ""}
            placeholder="Address search is unavailable"
            disabled
            readOnly
          />
        )}
        {displayedAddress && (
          <div className="d-flex justify-content-between align-items-start mt-1 gap-2">
            <Form.Text className="venue-primary mb-0">
              {displayedAddress}
            </Form.Text>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none flex-shrink-0"
              onClick={clear}
              disabled={updateUserMutation.isPending}
            >
              Remove
            </Button>
          </div>
        )}
        <Form.Text className="text-muted d-block">
          This is optionally used to show your distance from each venue. It is
          never shared with other users.
        </Form.Text>
      </Form.Group>
      {updateUserMutation.isError && (
        <Alert variant="danger">
          Failed to update details. Please try again.
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
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default UserDetailsForm;
