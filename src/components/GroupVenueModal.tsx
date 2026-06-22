import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import {
  useDeleteGroupVenue,
  useUpdateGroupVenue,
} from "../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const optionIdForLabel = (
  options: RatingOptionResult[],
  label: string | undefined,
) => options.find((option) => option.label === label)?.optionId ?? "";

const GroupVenueModal = ({ groupId, venue, onClose }: Props) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [venueName, setVenueName] = useState("");
  const [visited, setVisited] = useState(false);
  const [venueTypeOptionId, setVenueTypeOptionId] = useState("");
  const [foodTypeOptionId, setFoodTypeOptionId] = useState("");

  const { data: venueTypeData, isLoading: isVenueTypesLoading } =
    useGetOptionsForGroup("VenueTypeOption", groupId);
  const { data: foodTypeData, isLoading: isFoodTypesLoading } =
    useGetOptionsForGroup("FoodTypeOption", groupId);

  const venueTypeOptions = venueTypeData?.options ?? [];
  const foodTypeOptions = foodTypeData?.options ?? [];

  const areOptionsLoading = isVenueTypesLoading || isFoodTypesLoading;

  const { mutate: deleteVenue, isPending: isDeleting } =
    useDeleteGroupVenue(groupId);
  const { mutate: updateVenue, isPending: isUpdating } =
    useUpdateGroupVenue(groupId);

  const isPending = isDeleting || isUpdating;

  const initialiseForm = () => {
    setVenueName(venue?.venueName ?? "");
    setVisited(venue?.visited ?? false);
    setVenueTypeOptionId(optionIdForLabel(venueTypeOptions, venue?.venueType));
    setFoodTypeOptionId(optionIdForLabel(foodTypeOptions, venue?.foodType));
  };

  const canSave = venueName.trim().length > 0;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleUpdate = () => {
    if (!venue || !canSave) return;

    updateVenue(
      {
        groupVenueId: venue.groupVenueId,
        request: {
          venueName: venueName.trim(),
          visited,
          venueTypeOptionId: venueTypeOptionId || undefined,
          foodTypeOptionId: foodTypeOptionId || undefined,
        },
      },
      { onSuccess: onClose },
    );
  };

  const handleDelete = () => {
    if (!venue) return;

    deleteVenue(venue.groupVenueId, { onSuccess: onClose });
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={initialiseForm}
      onExited={() => setConfirmingDelete(false)}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      centered
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {confirmingDelete ? (
          <p className="mb-0">
            Are you sure you want to delete <strong>{venue?.venueName}</strong>?
            This action cannot be undone.
          </p>
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <Form.Group className="mb-3" controlId="updateVenueName">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter venue name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                disabled={isPending}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateVenueType">
              <Form.Label>Venue Type</Form.Label>
              <Form.Select
                value={venueTypeOptionId}
                onChange={(e) => setVenueTypeOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading}
              >
                <option value="">None</option>
                {venueTypeOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateFoodType">
              <Form.Label>Food Type</Form.Label>
              <Form.Select
                value={foodTypeOptionId}
                onChange={(e) => setFoodTypeOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading}
              >
                <option value="">None</option>
                {foodTypeOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="updateVenueVisited">
              <Form.Label>Visited</Form.Label>
              <Form.Check
                type="switch"
                checked={visited}
                onChange={(e) => setVisited(e.target.checked)}
                disabled={isPending}
                style={{ marginLeft: "0.75rem" }}
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {confirmingDelete ? (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setConfirmingDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isDeleting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="danger"
              className="me-auto"
              onClick={() => setConfirmingDelete(true)}
              disabled={isPending}
            >
              Delete Venue
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={isPending || !canSave || areOptionsLoading}
            >
              {isUpdating ? (
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
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GroupVenueModal;
