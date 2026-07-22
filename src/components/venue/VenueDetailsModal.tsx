import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import useVenueDetailsForm from "../../hooks/useVenueDetailsForm";
import useVenueDelete from "../../hooks/useVenueDelete";
import VenueDetailsFields from "./VenueDetailsFields";
import {
  VenueDeleteConfirmMessage,
  VenueDeleteFooter,
} from "./VenueDeleteControls";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const VenueDetailsModal = ({ groupId, venue, onClose }: Props) => {
  const [isSaving, setIsSaving] = useState(false);

  const details = useVenueDetailsForm(groupId, venue);
  const deleteFlow = useVenueDelete(details.remove, onClose);

  const isPending =
    details.isUpdating || details.isDeleting || deleteFlow.isDeleting || isSaving;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = async () => {
    if (!venue || !details.canSave || isPending) return;

    setIsSaving(true);
    try {
      await details.save();
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
      onEntered={details.initialise}
      onExited={deleteFlow.reset}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title as="h2">Venue Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deleteFlow.confirmingDelete ? (
          <VenueDeleteConfirmMessage venueName={venue?.venueName} />
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <p className="text-muted small mb-3">
              These can be amended by anybody in your group.
            </p>
            <VenueDetailsFields form={details} isPending={isPending} />
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <VenueDeleteFooter deleteFlow={deleteFlow} isPending={isPending}>
          <Button
            key="save"
            variant="primary"
            onClick={handleSave}
            disabled={
              isPending || !details.canSave || details.areOptionsLoading
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
        </VenueDeleteFooter>
      </Modal.Footer>
    </Modal>
  );
};

export default VenueDetailsModal;
