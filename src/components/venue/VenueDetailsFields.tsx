import { MAX_VENUE_NAME_LENGTH } from "../../constants/validation";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PlaceAutocomplete from "../common/PlaceAutocomplete";
import type useVenueDetailsForm from "../../hooks/useVenueDetailsForm";

interface Props {
  form: ReturnType<typeof useVenueDetailsForm>;
  isPending: boolean;
}

const VenueDetailsFields = ({ form, isPending }: Props) => {
  const { values, setters, placeSearch } = form;

  return (
    <>
      {placeSearch.useAutocomplete && (
        <Form.Group className="mb-3" controlId="updateVenueSearch">
          <Form.Label>Search</Form.Label>
          <PlaceAutocomplete
            onSelect={form.onSelectPlace}
            onUnavailable={placeSearch.onAutocompleteUnavailable}
            disabled={isPending}
            placeholder="Pick a real place or just type below"
          />
        </Form.Group>
      )}
      <Row className="g-3 mb-3">
        <Col xs={9}>
          <Form.Group controlId="updateVenueName">
            <Form.Label>Venue Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter venue name"
              value={values.venueName}
              onChange={(e) => form.onNameChange(e.target.value)}
              disabled={isPending}
              maxLength={MAX_VENUE_NAME_LENGTH}
            />
            {placeSearch.displayedAddress && (
              <Form.Text className="venue-primary">
                {placeSearch.displayedAddress}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group controlId="updateVenueVisited">
            <Form.Label>Visited</Form.Label>
            <Form.Check
              type="switch"
              checked={values.visited}
              onChange={(e) => setters.setVisited(e.target.checked)}
              disabled={isPending}
              style={{ marginLeft: "0.25rem", fontSize: "1.5rem" }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="g-3 mb-3">
        <Col xs={6}>
          <Form.Group controlId="updateVenueType">
            <Form.Label>Venue Type</Form.Label>
            <Form.Select
              value={values.venueTypeOptionId}
              onChange={(e) => setters.setVenueTypeOptionId(e.target.value)}
              disabled={isPending || form.areOptionsLoading}
            >
              <option value="">None</option>
              {form.venueTypeOptions.map((option) => (
                <option key={option.optionId} value={option.optionId}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group controlId="updateFoodType">
            <Form.Label>Food Type</Form.Label>
            <Form.Select
              value={values.foodTypeOptionId}
              onChange={(e) => setters.setFoodTypeOptionId(e.target.value)}
              disabled={isPending || form.areOptionsLoading}
            >
              <option value="">None</option>
              {form.foodTypeOptions.map((option) => (
                <option key={option.optionId} value={option.optionId}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default VenueDetailsFields;
