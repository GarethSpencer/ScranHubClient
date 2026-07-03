import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import type RatingVenueResult from "../../models/results/generic/RatingVenueResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";
import VenueBreakdownBody from "./VenueBreakdownBody";

interface Props {
  venue: GroupVenueResult | null;
  qualityRatings: RatingVenueResult[];
  costRatings: RatingVenueResult[];
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  isLoading: boolean;
  onClose: () => void;
}

const VenueBreakdownModal = ({
  venue,
  qualityRatings,
  costRatings,
  qualityOptions,
  costOptions,
  isLoading,
  onClose,
}: Props) => (
  <Modal
    show={venue !== null}
    onHide={onClose}
    scrollable
    centered
    dialogClassName="group-venue-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title as="h2">
        {venue ? `Ratings: ${venue.venueName}` : "Ratings"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {isLoading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading…</span>
          </Spinner>
        </div>
      ) : (
        <VenueBreakdownBody
          qualityRatings={qualityRatings}
          costRatings={costRatings}
          qualityOptions={qualityOptions}
          costOptions={costOptions}
        />
      )}
    </Modal.Body>
  </Modal>
);

export default VenueBreakdownModal;
