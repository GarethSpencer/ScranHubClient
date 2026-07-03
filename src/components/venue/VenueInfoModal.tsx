import Modal from "react-bootstrap/Modal";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import VenueInfoBody from "./VenueInfoBody";

interface Props {
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const VenueInfoModal = ({ venue, onClose }: Props) => (
  <Modal
    show={venue !== null}
    onHide={onClose}
    scrollable
    centered
    dialogClassName="group-venue-modal"
  >
    <Modal.Header closeButton>
      <Modal.Title as="h2">{venue?.venueName}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{venue && <VenueInfoBody venue={venue} />}</Modal.Body>
  </Modal>
);

export default VenueInfoModal;
