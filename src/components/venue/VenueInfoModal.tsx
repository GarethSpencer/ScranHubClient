import Modal from "react-bootstrap/Modal";
import { FaShareNodes } from "react-icons/fa6";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import VenueInfoBody from "./VenueInfoBody";

interface Props {
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const VenueInfoModal = ({ venue, onClose }: Props) => {
  const venueUrl = venue
    ? new URL(
        `/group/${encodeURIComponent(venue.groupId)}`,
        window.location.origin,
      )
    : null;
  if (venueUrl && venue) {
    venueUrl.searchParams.set("venueId", venue.groupVenueId);
  }

  const whatsappUrl =
    venue && venueUrl
      ? `https://wa.me/?text=${encodeURIComponent(
          `${venue.venueName} on ScranHub: ${venueUrl.toString()}`,
        )}`
      : undefined;

  return (
    <Modal
      show={venue !== null}
      onHide={onClose}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton>
        <div className="d-flex flex-grow-1 align-items-center justify-content-between me-2">
          <Modal.Title as="h2">{venue?.venueName}</Modal.Title>
          {venue && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share ${venue.venueName} via WhatsApp`}
              title="Share via WhatsApp"
              className="btn btn-link p-1 d-flex align-items-center justify-content-center"
            >
              <FaShareNodes size={20} aria-hidden="true" />
            </a>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>{venue && <VenueInfoBody venue={venue} />}</Modal.Body>
    </Modal>
  );
};

export default VenueInfoModal;
