import { useState } from "react";
import { MAX_VENUE_NAME_LENGTH } from "../constants/validation";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useCreateGroupVenue } from "../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import PlaceAutocomplete, {
  type SelectedPlace,
} from "./common/PlaceAutocomplete";
import SaveButton from "./common/SaveButton";
import useSaveFeedback from "../hooks/useSaveFeedback";
import useVenuePlaceSearch from "../hooks/useVenuePlaceSearch";

interface Props {
  show: boolean;
  groupId: string;
  onClose: () => void;
}

const CreateGroupVenueModal = ({ show, groupId, onClose }: Props) => {
  const [venueName, setVenueName] = useState("");
  const [venueTypeOptionId, setVenueTypeOptionId] = useState("");
  const [foodTypeOptionId, setFoodTypeOptionId] = useState("");
  const {
    useAutocomplete,
    onAutocompleteUnavailable,
    selectPlace,
    onNameChange,
    displayedAddress,
    placeFields,
    reset: resetPlaceSearch,
  } = useVenuePlaceSearch();

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

  const { mutateAsync } = useCreateGroupVenue(groupId);
  const saveFeedback = useSaveFeedback();

  const isPending = saveFeedback.isBusy;

  const resetForm = () => {
    setVenueName("");
    setVenueTypeOptionId("");
    setFoodTypeOptionId("");
    resetPlaceSearch();
  };

  const handlePlaceSelect = (place: SelectedPlace) => {
    setVenueName(place.displayName.slice(0, MAX_VENUE_NAME_LENGTH));
    selectPlace(place);
  };

  const canSave = venueName.trim().length > 0;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = () => {
    if (!canSave || isPending) return;

    saveFeedback.save(
      () =>
        mutateAsync({
          venueName: venueName.trim(),
          venueTypeOptionId: venueTypeOptionId || undefined,
          foodTypeOptionId: foodTypeOptionId || undefined,
          ...placeFields,
        }),
      onClose,
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onEntered={resetForm}
      onExited={saveFeedback.reset}
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
              <Form.Label>Search</Form.Label>
              <PlaceAutocomplete
                onSelect={handlePlaceSelect}
                onUnavailable={onAutocompleteUnavailable}
                disabled={isPending}
                placeholder="Search with Google or just type below"
              />
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
                onNameChange(e.target.value);
              }}
              disabled={isPending}
              autoFocus={!useAutocomplete}
              maxLength={MAX_VENUE_NAME_LENGTH}
            />
            {displayedAddress && (
              <Form.Text className="venue-primary">
                {displayedAddress}
              </Form.Text>
            )}
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col xs={6}>
              <Form.Group controlId="createVenueType">
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
            </Col>
            <Col xs={6}>
              <Form.Group controlId="createFoodType">
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
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <SaveButton
          status={saveFeedback.status}
          label="Add Venue"
          savingLabel="Creating..."
          savedLabel="Added!"
          onClick={handleSave}
          disabled={!canSave}
        />
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
