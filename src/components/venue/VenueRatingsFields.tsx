import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type useVenueRatingsForm from "../../hooks/useVenueRatingsForm";

interface Props {
  form: ReturnType<typeof useVenueRatingsForm>;
  isPending: boolean;
}

const VenueRatingsFields = ({ form, isPending }: Props) => {
  const disabled =
    isPending || form.areOptionsLoading || form.areRatingsLoading;

  return (
    <Row className="g-3 mb-3">
      <Col xs={12}>
        <Form.Group controlId="updateQualityRating">
          <Form.Label>Quality Rating</Form.Label>
          <Form.Select
            value={form.areRatingsLoading ? "" : form.qualitySelection}
            onChange={(e) => form.setQualityOptionId(e.target.value)}
            disabled={disabled}
          >
            {form.areRatingsLoading ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="">None</option>
                {form.qualityOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </>
            )}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col xs={12}>
        <Form.Group controlId="updateCostRating">
          <Form.Label>Cost Rating</Form.Label>
          <Form.Select
            value={form.areRatingsLoading ? "" : form.costSelection}
            onChange={(e) => form.setCostOptionId(e.target.value)}
            disabled={disabled}
          >
            {form.areRatingsLoading ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="">None</option>
                {form.costOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </>
            )}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default VenueRatingsFields;
