import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useDeleteGroupVenue } from "../api/controllerHooks/useGroupVenueController";
import type GroupVenueResult from "../models/results/GroupVenueResult";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const GroupVenueModal = ({ groupId, venue, onClose }: Props) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { mutate: deleteVenue, isPending: isDeleting } =
    useDeleteGroupVenue(groupId);

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  const handleDelete = () => {
    if (!venue) return;

    deleteVenue(venue.groupVenueId, { onSuccess: onClose });
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onExited={() => setConfirmingDelete(false)}
      backdrop={isDeleting ? "static" : true}
      keyboard={!isDeleting}
      centered
    >
      <Modal.Header closeButton={!isDeleting}>
        <Modal.Title>{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {confirmingDelete ? (
          <p className="mb-0">
            Are you sure you want to delete{" "}
            <strong>{venue?.venueName}</strong>? This action cannot be undone.
          </p>
        ) : (
          <p className="text-muted mb-0">
            Manage this venue. More actions coming soon.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {confirmingDelete ? (
          <>
            <Button
              variant="outline-secondary"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
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
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete Venue
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GroupVenueModal;
