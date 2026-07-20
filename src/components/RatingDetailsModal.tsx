import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingVenueResult from "../models/results/generic/RatingVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";
import VenueInfoBody from "./venue/VenueInfoBody";
import VenueBreakdownBody from "./venue/VenueBreakdownBody";
import { venueHasInfo } from "../lib/venueInfo";

interface Props {
  venue: GroupVenueResult | null;
  qualityRatings: RatingVenueResult[];
  costRatings: RatingVenueResult[];
  vibeRatings: RatingVenueResult[];
  qualityOptions: RatingOptionResult[];
  costOptions: RatingOptionResult[];
  vibeOptions: RatingOptionResult[];
  isLoading: boolean;
  onClose: () => void;
}

const RatingDetailsModal = ({
  venue,
  qualityRatings,
  costRatings,
  vibeRatings,
  qualityOptions,
  costOptions,
  vibeOptions,
  isLoading,
  onClose,
}: Props) => {
  const hasInfo = venue != null && venueHasInfo(venue);

  return (
    <Modal
      show={venue !== null}
      onHide={onClose}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {venue && (
          <>
            {hasInfo && (
              <div className="mb-3">
                <VenueInfoBody venue={venue} />
                <hr className="my-3" />
              </div>
            )}
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
                vibeRatings={vibeRatings}
                qualityOptions={qualityOptions}
                costOptions={costOptions}
                vibeOptions={vibeOptions}
              />
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RatingDetailsModal;
