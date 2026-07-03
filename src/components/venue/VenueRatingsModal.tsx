import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import useVenueRatingsForm from "../../hooks/useVenueRatingsForm";
import VenueRatingsFields from "./VenueRatingsFields";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const VenueRatingsModal = ({ groupId, venue, onClose }: Props) => {
  const [isSaving, setIsSaving] = useState(false);

  const ratings = useVenueRatingsForm(groupId, venue);

  const isPending = isSaving;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = async () => {
    if (!venue || isPending) return;

    setIsSaving(true);
    try {
      await ratings.save();
      onClose();
    } catch {
      // A failed mutation already surfaces its own error toast; keep the modal
      // open so the user can retry.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={ratings.reset}
      onExited={ratings.reset}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title as="h2">
          {venue ? `My Ratings: ${venue.venueName}` : "My Ratings"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <p className="text-muted small mb-3">
            These cannot be amended by anybody else in your group.
          </p>
          <VenueRatingsFields form={ratings} isPending={isPending} />
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={
            isPending || ratings.areOptionsLoading || ratings.areRatingsLoading
          }
        >
          {isSaving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VenueRatingsModal;
