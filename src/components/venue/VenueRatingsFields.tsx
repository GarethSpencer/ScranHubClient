import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RatingChoice from "./RatingChoice";
import type useVenueRatingsForm from "../../hooks/useVenueRatingsForm";

interface Props {
  form: ReturnType<typeof useVenueRatingsForm>;
  isPending: boolean;
  notVisited?: boolean;
}

const VenueRatingsFields = ({ form, isPending, notVisited = false }: Props) => {
  const isLoading = form.areOptionsLoading || form.areRatingsLoading;
  const disabled = isPending || notVisited || isLoading;

  return (
    <Row className="g-3 mb-3">
      {notVisited && (
        <Col xs={12}>
          <Form.Text className="venue-primary">
            Mark this venue as visited to add your ratings.
          </Form.Text>
        </Col>
      )}
      <Col xs={12}>
        <RatingChoice
          name="qualityRating"
          label="Quality Rating"
          options={form.qualityOptions}
          value={form.qualitySelection}
          isSet={form.isQualitySet}
          isLoading={isLoading}
          disabled={disabled}
          onChange={form.setQualityOptionId}
        />
      </Col>
      <Col xs={12}>
        <RatingChoice
          name="costRating"
          label="Cost Rating"
          options={form.costOptions}
          value={form.costSelection}
          isSet={form.isCostSet}
          isLoading={isLoading}
          disabled={disabled}
          onChange={form.setCostOptionId}
        />
      </Col>
      <Col xs={12}>
        <RatingChoice
          name="vibeRating"
          label="Vibe Rating"
          options={form.vibeOptions}
          value={form.vibeSelection}
          isSet={form.isVibeSet}
          isLoading={isLoading}
          disabled={disabled}
          onChange={form.setVibeOptionId}
        />
      </Col>
      {!notVisited && !isLoading && !form.areAllRatingsSet && (
        <Col xs={12}>
          <Form.Text className="d-block">
            Choose an option for all three sets in order to save your ratings.
          </Form.Text>
        </Col>
      )}
    </Row>
  );
};

export default VenueRatingsFields;
