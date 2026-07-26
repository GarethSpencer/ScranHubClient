import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import type GroupVenueResult from "../../models/results/GroupVenueResult";
import useVenueRatingsForm from "../../hooks/useVenueRatingsForm";
import useVenueRatingsRemove from "../../hooks/useVenueRatingsRemove";
import useSaveFeedback from "../../hooks/useSaveFeedback";
import SaveButton from "../common/SaveButton";
import VenueRatingsFields from "./VenueRatingsFields";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
  onRatingsSaved?: (groupVenueId: string) => void;
}

const VenueRatingsModal = ({
  groupId,
  venue,
  onClose,
  onRatingsSaved,
}: Props) => {
  const [savedVenueId, setSavedVenueId] = useState<string | null>(null);

  const ratings = useVenueRatingsForm(groupId, venue);
  const saveFeedback = useSaveFeedback();
  const removeFlow = useVenueRatingsRemove(ratings.remove, onClose);

  const isPending = saveFeedback.isBusy || removeFlow.isRemoving;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSave = () => {
    if (!venue || isPending) return;

    const groupVenueId = venue.groupVenueId;
    saveFeedback.save(
      () => ratings.save(),
      () => {
        setSavedVenueId(groupVenueId);
        onClose();
      },
    );
  };

  const handleExited = () => {
    ratings.reset();
    saveFeedback.reset();

    if (savedVenueId) {
      onRatingsSaved?.(savedVenueId);
      setSavedVenueId(null);
    }
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={ratings.reset}
      onExited={handleExited}
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
        {ratings.hasSavedRatings && (
          <Button
            variant="outline-danger"
            onClick={removeFlow.remove}
            disabled={isPending || ratings.areRatingsLoading}
          >
            {removeFlow.isRemoving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Removing...
              </>
            ) : (
              "Remove Ratings"
            )}
          </Button>
        )}
        <SaveButton
          status={saveFeedback.status}
          onClick={handleSave}
          disabled={
            removeFlow.isRemoving ||
            ratings.areOptionsLoading ||
            ratings.areRatingsLoading
          }
        />
      </Modal.Footer>
    </Modal>
  );
};

export default VenueRatingsModal;
