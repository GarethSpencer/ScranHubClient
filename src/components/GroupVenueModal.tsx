import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import useToast from "../contexts/toast/useToast";
import useVenueDetailsForm from "../hooks/useVenueDetailsForm";
import useVenueRatingsForm from "../hooks/useVenueRatingsForm";
import useVenueRatingsRemove from "../hooks/useVenueRatingsRemove";
import useVenueDelete from "../hooks/useVenueDelete";
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
}

const GroupVenueModal = ({ groupId, venue, onClose }: Props) => {
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [isSavingRatings, setIsSavingRatings] = useState(false);

  const { showToast } = useToast();

  const details = useVenueDetailsForm(groupId, venue);
  const ratings = useVenueRatingsForm(groupId, venue);
  const ratingsRemoveFlow = useVenueRatingsRemove(ratings.remove, () => {
    ratings.reset();
    showToast("Ratings removed", "success");
  });
  const deleteFlow = useVenueDelete(details.remove, onClose);

  const isPending =
    details.isUpdating ||
    details.isDeleting ||
    deleteFlow.isDeleting ||
    ratingsRemoveFlow.isRemoving ||
    isSavingDetails ||
    isSavingRatings;

  const canSave = details.canSave;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleSaveDetails = async () => {
    if (!venue || !canSave || isPending) return;

    setIsSavingDetails(true);
    try {
      await details.save();
    } catch {
      // A failed mutation already surfaces its own error toast; keep the modal
      // open so the user can see what failed and retry.
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleSaveRatings = async () => {
    if (!venue || isPending) return;

    setIsSavingRatings(true);
    try {
      showToast("Ratings updated", "success");
    } catch {
      // A failed mutation already surfaces its own error toast; keep the modal
      // open so the user can see what failed and retry.
    } finally {
      setIsSavingRatings(false);
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
      onExited={() => {
        deleteFlow.reset();
        ratings.reset();
      }}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton={!isPending}>
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
                  <Button
                    variant="primary"
                    onClick={handleSaveDetails}
                    disabled={
                      isPending || !canSave || details.areOptionsLoading
                    }
                  >
                    {isSavingDetails ? (
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
                  <Button
                    variant="primary"
                    onClick={handleSaveRatings}
                    disabled={
                      isPending ||
                      !details.values.visited ||
                      ratings.areOptionsLoading ||
                      ratings.areRatingsLoading
                    }
                  >
                    {isSavingRatings ? (
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
            disabled={isPending}
          >
            Close
          </Button>
        </VenueDeleteFooter>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupVenueModal;
