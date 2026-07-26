import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import useVenueDetailsForm from "../../hooks/useVenueDetailsForm";
import useVenueDelete from "../../hooks/useVenueDelete";
import useSaveFeedback from "../../hooks/useSaveFeedback";
import SaveButton from "../common/SaveButton";
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
  const details = useVenueDetailsForm(groupId, venue);
  const detailsSave = useSaveFeedback();
  const deleteFlow = useVenueDelete(details.remove, onClose);

  const isPending =
    details.isUpdating ||
    details.isDeleting ||
    deleteFlow.isDeleting ||
    detailsSave.isBusy;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = () => {
    if (!venue || !details.canSave || isPending) return;

    detailsSave.save(() => details.save(), onClose);
  };

  const handleExited = () => {
    deleteFlow.reset();
    detailsSave.reset();
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={details.initialise}
      onExited={handleExited}
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
          <SaveButton
            key="save"
            status={detailsSave.status}
            onClick={handleSave}
            disabled={
              details.isUpdating ||
              details.isDeleting ||
              deleteFlow.isDeleting ||
              !details.canSave ||
              details.areOptionsLoading
            }
          />
        </VenueDeleteFooter>
      </Modal.Footer>
    </Modal>
  );
};

export default VenueDetailsModal;
