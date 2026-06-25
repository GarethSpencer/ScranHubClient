import { useState } from "react";
import { MAX_VENUE_NAME_LENGTH } from "../constants/validation";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useCreateGroupVenue } from "../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import PlaceAutocomplete, {
  type SelectedPlace,
} from "./common/PlaceAutocomplete";
import { isGoogleMapsConfigured } from "../lib/googleMaps";

interface Props {
  show: boolean;
  groupId: string;
  onClose: () => void;
}

const CreateGroupVenueModal = ({ show, groupId, onClose }: Props) => {
  const [venueName, setVenueName] = useState("");
  const [venueTypeOptionId, setVenueTypeOptionId] = useState("");
  const [foodTypeOptionId, setFoodTypeOptionId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [useAutocomplete, setUseAutocomplete] = useState(
    isGoogleMapsConfigured(),
  );

  const { data: venueTypeData } = useGetOptionsForGroup(
    "VenueTypeOption",
    groupId,
  );
  const { data: foodTypeData } = useGetOptionsForGroup(
    "FoodTypeOption",
    groupId,
  );

  const venueTypeOptions = venueTypeData?.options ?? [];
  const foodTypeOptions = foodTypeData?.options ?? [];

  const { mutate, isPending } = useCreateGroupVenue(groupId);

  const resetForm = () => {
    setVenueName("");
    setVenueTypeOptionId("");
    setFoodTypeOptionId("");
    setSelectedAddress("");
    setUseAutocomplete(isGoogleMapsConfigured());
  };

  const handlePlaceSelect = (place: SelectedPlace) => {
    setVenueName(place.displayName.slice(0, MAX_VENUE_NAME_LENGTH));
    setSelectedAddress(place.formattedAddress ?? "");
  };

  const canSave = venueName.trim().length > 0;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = () => {
    if (!canSave) return;

    mutate(
      {
        venueName: venueName.trim(),
        venueTypeOptionId: venueTypeOptionId || undefined,
        foodTypeOptionId: foodTypeOptionId || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onEntered={resetForm}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      centered
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>Add Venue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {useAutocomplete && (
            <Form.Group className="mb-3" controlId="createVenueSearch">
              <Form.Label>Search for a place</Form.Label>
              <PlaceAutocomplete
                onSelect={handlePlaceSelect}
                onUnavailable={() => setUseAutocomplete(false)}
                disabled={isPending}
                placeholder="Start typing a venue name or address"
              />
              <Form.Text className="text-muted">
                Pick a real place from Google, or just type a name below.
              </Form.Text>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="createVenueName">
            <Form.Label>Venue Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter venue name"
              value={venueName}
              onChange={(e) => {
                setVenueName(e.target.value);
                // Manual edits no longer match the selected place's address.
                setSelectedAddress("");
              }}
              disabled={isPending}
              autoFocus={!useAutocomplete}
              maxLength={MAX_VENUE_NAME_LENGTH}
            />
            {selectedAddress && (
              <Form.Text className="text-muted">{selectedAddress}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="createVenueType">
            <Form.Label>Venue Type</Form.Label>
            <Form.Select
              value={venueTypeOptionId}
              onChange={(e) => setVenueTypeOptionId(e.target.value)}
              disabled={isPending}
            >
              <option value="">None</option>
              {venueTypeOptions.map((option) => (
                <option key={option.optionId} value={option.optionId}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="createFoodType">
            <Form.Label>Food Type</Form.Label>
            <Form.Select
              value={foodTypeOptionId}
              onChange={(e) => setFoodTypeOptionId(e.target.value)}
              disabled={isPending}
            >
              <option value="">None</option>
              {foodTypeOptions.map((option) => (
                <option key={option.optionId} value={option.optionId}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isPending || !canSave}
        >
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
            "Add Venue"
          )}
        </Button>
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupVenueModal;
