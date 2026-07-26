import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import useToast from "../contexts/toast/useToast";
import useVenueDetailsForm from "../hooks/useVenueDetailsForm";
import useVenueRatingsForm from "../hooks/useVenueRatingsForm";
import useVenueRatingsRemove from "../hooks/useVenueRatingsRemove";
import useVenueDelete from "../hooks/useVenueDelete";
import useSaveFeedback from "../hooks/useSaveFeedback";
import SaveButton from "./common/SaveButton";
import VenueDetailsFields from "./venue/VenueDetailsFields";
import VenueRatingsFields from "./venue/VenueRatingsFields";
import VenueRatingsRemoveControls from "./venue/VenueRatingsRemoveControls";
import {
  VenueDeleteConfirmMessage,
  VenueDeleteFooter,
} from "./venue/VenueDeleteControls";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
  onRatingsSaved?: (groupVenueId: string) => void;
}

const GroupVenueModal = ({
  groupId,
  venue,
  onClose,
  onRatingsSaved,
}: Props) => {
  const [savedVenueId, setSavedVenueId] = useState<string | null>(null);

  const { showToast } = useToast();

  const details = useVenueDetailsForm(groupId, venue);
  const ratings = useVenueRatingsForm(groupId, venue);
  const detailsSave = useSaveFeedback();
  const ratingsSave = useSaveFeedback();
  const ratingsRemoveFlow = useVenueRatingsRemove(ratings.remove, () => {
    ratings.reset();
    showToast("Ratings removed", "success");
  });
  const deleteFlow = useVenueDelete(details.remove, onClose);

  const isBusy =
    details.isUpdating ||
    details.isDeleting ||
    deleteFlow.isDeleting ||
    ratingsRemoveFlow.isRemoving ||
    detailsSave.isSaving ||
    ratingsSave.isSaving;

  const isPending = isBusy || detailsSave.isBusy || ratingsSave.isBusy;

  const canSave = details.canSave;

  const handleClose = () => {
    if (isBusy) return;
    onClose();
  };

  const handleSaveDetails = () => {
    if (!venue || !canSave || isPending) return;

    detailsSave.save(() => details.save(), detailsSave.reset);
  };

  const handleSaveRatings = () => {
    if (!venue || isPending || !ratings.areAllRatingsSet) return;

    const groupVenueId = venue.groupVenueId;
    ratingsSave.save(
      () => ratings.save(details.values.visited),
      () => {
        setSavedVenueId(groupVenueId);
        ratingsSave.reset();
      },
    );
  };

  const handleExited = () => {
    deleteFlow.reset();
    ratings.reset();
    detailsSave.reset();
    ratingsSave.reset();

    if (savedVenueId) {
      onRatingsSaved?.(savedVenueId);
      setSavedVenueId(null);
    }
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={() => {
        details.initialise();
        ratings.reset();
      }}
      onExited={handleExited}
      backdrop={isBusy ? "static" : true}
      keyboard={!isBusy}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton={!isBusy}>
        <Modal.Title as="h2">{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deleteFlow.confirmingDelete ? (
          <VenueDeleteConfirmMessage venueName={venue?.venueName} />
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveDetails();
            }}
          >
            <Row className="g-3 align-items-stretch">
              <Col xs={12} md>
                <h3 className="h6 fw-bold mb-1">Venue Details</h3>
                <p className="text-muted small mb-3">
                  These can be amended by anybody in your group.
                </p>
                <VenueDetailsFields form={details} isPending={isPending} />
                <div className="d-grid mt-3">
                  <SaveButton
                    status={detailsSave.status}
                    onClick={handleSaveDetails}
                    disabled={
                      ratingsSave.isBusy ||
                      isBusy ||
                      !canSave ||
                      details.areOptionsLoading
                    }
                  />
                </div>
              </Col>

              <Col xs={12} md="auto" className="d-md-none">
                <hr className="section-rule mt-2 mb-3" />
              </Col>
              <Col
                xs={12}
                md="auto"
                className="section-divider d-none d-md-flex"
                aria-hidden="true"
              />

              <Col xs={12} md>
                <h3 className="h6 fw-bold mb-1">My Ratings</h3>
                <p className="text-muted small mb-3">
                  These cannot be amended by anybody else in your group.
                </p>
                <VenueRatingsFields
                  form={ratings}
                  isPending={isPending}
                  notVisited={!details.values.visited}
                />
                <div className="d-grid gap-2">
                  <SaveButton
                    status={ratingsSave.status}
                    onClick={handleSaveRatings}
                    disabled={
                      detailsSave.isBusy ||
                      isBusy ||
                      !details.values.visited ||
                      ratings.areOptionsLoading ||
                      ratings.areRatingsLoading ||
                      !ratings.areAllRatingsSet
                    }
                  />
                  <VenueRatingsRemoveControls
                    removeFlow={ratingsRemoveFlow}
                    hasSavedRatings={ratings.hasSavedRatings}
                    isPending={isPending}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <VenueDeleteFooter deleteFlow={deleteFlow} isPending={isPending}>
          <Button
            key="close"
            variant="secondary"
            onClick={handleClose}
            disabled={isBusy}
          >
            Close
          </Button>
        </VenueDeleteFooter>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupVenueModal;
