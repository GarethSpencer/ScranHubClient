import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import {
  useDeleteGroupVenue,
  useUpdateGroupVenue,
} from "../api/controllerHooks/useGroupVenueController";
import { useGetOptionsForGroup } from "../api/controllerHooks/useOptionController";
import {
  useCreateRating,
  useUpdateRating,
  useDeleteRating,
  useGetRatingsForGroupVenue,
} from "../api/controllerHooks/useRatingController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import type GroupVenueResult from "../models/results/GroupVenueResult";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

interface Props {
  groupId: string;
  venue: GroupVenueResult | null;
  onClose: () => void;
}

const optionIdForLabel = (
  options: RatingOptionResult[],
  label: string | undefined,
) => options.find((option) => option.label === label)?.optionId ?? "";

const GroupVenueModal = ({ groupId, venue, onClose }: Props) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [venueName, setVenueName] = useState("");
  const [visited, setVisited] = useState(false);
  const [venueTypeOptionId, setVenueTypeOptionId] = useState("");
  const [foodTypeOptionId, setFoodTypeOptionId] = useState("");
  const [qualityOptionId, setQualityOptionId] = useState<string | null>(null);
  const [costOptionId, setCostOptionId] = useState<string | null>(null);

  const groupVenueId = venue?.groupVenueId ?? "";

  const { data: venueTypeData, isLoading: isVenueTypesLoading } =
    useGetOptionsForGroup("VenueTypeOption", groupId);
  const { data: foodTypeData, isLoading: isFoodTypesLoading } =
    useGetOptionsForGroup("FoodTypeOption", groupId);
  const { data: qualityOptionData, isLoading: isQualityOptionsLoading } =
    useGetOptionsForGroup("QualityOption", groupId);
  const { data: costOptionData, isLoading: isCostOptionsLoading } =
    useGetOptionsForGroup("CostOption", groupId);

  const venueTypeOptions = venueTypeData?.options ?? [];
  const foodTypeOptions = foodTypeData?.options ?? [];
  const qualityOptions = [...(qualityOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
  const costOptions = [...(costOptionData?.options ?? [])].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const areOptionsLoading =
    isVenueTypesLoading ||
    isFoodTypesLoading ||
    isQualityOptionsLoading ||
    isCostOptionsLoading;

  const { data: currentUserData } = useGetCurrentUser();
  const currentUserId = currentUserData?.user?.userId;

  const { data: qualityRatingsData, isLoading: isQualityRatingLoading } =
    useGetRatingsForGroupVenue("QualityRating", groupId, groupVenueId);

  const { data: costRatingsData, isLoading: isCostRatingLoading } =
    useGetRatingsForGroupVenue("CostRating", groupId, groupVenueId);

  const currentQualityRating = qualityRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );
  const currentCostRating = costRatingsData?.ratings?.find(
    (rating) => rating.userId === currentUserId,
  );

  const areRatingsLoading = isQualityRatingLoading || isCostRatingLoading;

  const { mutate: deleteVenue, isPending: isDeleting } =
    useDeleteGroupVenue(groupId);
  const { mutate: updateVenue, isPending: isUpdating } =
    useUpdateGroupVenue(groupId);

  const { mutateAsync: createQualityRating } = useCreateRating(
    "QualityRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: updateQualityRating } = useUpdateRating(
    "QualityRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: deleteQualityRating } = useDeleteRating(
    "QualityRating",
    groupId,
    { silent: true },
  );

  const { mutateAsync: createCostRating } = useCreateRating(
    "CostRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: updateCostRating } = useUpdateRating(
    "CostRating",
    groupId,
    { silent: true },
  );
  const { mutateAsync: deleteCostRating } = useDeleteRating(
    "CostRating",
    groupId,
    { silent: true },
  );

  const [isDeletingVenue, setIsDeletingVenue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isPending = isDeleting || isUpdating || isDeletingVenue || isSaving;

  const initialiseForm = () => {
    setVenueName(venue?.venueName ?? "");
    setVisited(venue?.visited ?? false);
    setVenueTypeOptionId(optionIdForLabel(venueTypeOptions, venue?.venueType));
    setFoodTypeOptionId(optionIdForLabel(foodTypeOptions, venue?.foodType));
  };

  const qualitySelection =
    qualityOptionId ?? currentQualityRating?.optionId ?? "";
  const costSelection = costOptionId ?? currentCostRating?.optionId ?? "";

  const canSave = venueName.trim().length > 0;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const persistRating = (
    previous: { ratingId: string; optionId: string } | undefined,
    selectedOptionId: string,
    create: (request: {
      groupVenueId: string;
      optionId: string;
    }) => Promise<unknown>,
    update: (request: {
      groupVenueId: string;
      ratingId: string;
      request: { optionId: string };
    }) => Promise<unknown>,
    remove: (request: {
      ratingId: string;
      groupVenueId: string;
    }) => Promise<unknown>,
  ) => {
    if (!venue) return Promise.resolve();

    if (!previous && selectedOptionId) {
      return create({
        groupVenueId: venue.groupVenueId,
        optionId: selectedOptionId,
      });
    }
    if (previous && !selectedOptionId) {
      return remove({
        ratingId: previous.ratingId,
        groupVenueId: venue.groupVenueId,
      });
    }
    if (
      previous &&
      selectedOptionId &&
      previous.optionId !== selectedOptionId
    ) {
      return update({
        groupVenueId: venue.groupVenueId,
        ratingId: previous.ratingId,
        request: { optionId: selectedOptionId },
      });
    }
    return Promise.resolve();
  };

  const handleSave = async () => {
    if (!venue || !canSave || isPending) return;

    setIsSaving(true);
    try {
      await Promise.all([
        updateVenue({
          groupVenueId: venue.groupVenueId,
          request: {
            venueName: venueName.trim(),
            visited,
            venueTypeOptionId: venueTypeOptionId || undefined,
            foodTypeOptionId: foodTypeOptionId || undefined,
          },
        }),
        persistRating(
          currentQualityRating,
          qualitySelection,
          createQualityRating,
          updateQualityRating,
          deleteQualityRating,
        ),
        persistRating(
          currentCostRating,
          costSelection,
          createCostRating,
          updateCostRating,
          deleteCostRating,
        ),
      ]);
      onClose();
    } catch {
      // A failed mutation already surfaces its own error toast; keep the modal
      // open so the user can see what failed and retry.
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!venue) return;

    setIsDeletingVenue(true);
    deleteVenue(venue.groupVenueId, {
      onSuccess: onClose,
      onSettled: () => setIsDeletingVenue(false),
    });
  };

  return (
    <Modal
      show={venue !== null}
      onHide={handleClose}
      onEntered={initialiseForm}
      onExited={() => {
        setConfirmingDelete(false);
        setQualityOptionId(null);
        setCostOptionId(null);
      }}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      scrollable
      centered
      dialogClassName="group-venue-modal"
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>{venue?.venueName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {confirmingDelete ? (
          <p className="mb-0">
            Are you sure you want to delete <strong>{venue?.venueName}</strong>?
            This action cannot be undone.
          </p>
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Form.Group className="mb-3" controlId="updateVenueName">
              <h6 className="fw-bold mb-1">Venue Details</h6>
              <p className="text-muted small mb-3">
                These are generic values and can be amended by anybody in your
                group.
              </p>
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter venue name"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                disabled={isPending}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateVenueType">
              <Form.Label>Venue Type</Form.Label>
              <Form.Select
                value={venueTypeOptionId}
                onChange={(e) => setVenueTypeOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading}
              >
                <option value="">None</option>
                {venueTypeOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateFoodType">
              <Form.Label>Food Type</Form.Label>
              <Form.Select
                value={foodTypeOptionId}
                onChange={(e) => setFoodTypeOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading}
              >
                <option value="">None</option>
                {foodTypeOptions.map((option) => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="updateVenueVisited">
              <Form.Label>Visited</Form.Label>
              <Form.Check
                type="switch"
                checked={visited}
                onChange={(e) => setVisited(e.target.checked)}
                disabled={isPending}
                style={{ marginLeft: "0.25rem", fontSize: "1.5rem" }}
              />
            </Form.Group>

            <hr className="section-rule mt-4 mb-4" />
            <h6 className="fw-bold mb-1">Your Ratings</h6>
            <p className="text-muted small mb-3">
              These are specific to you and cannot be amended by anybody else in
              your group.
            </p>

            <Form.Group className="mb-3" controlId="updateQualityRating">
              <Form.Label>Quality Rating</Form.Label>
              <Form.Select
                value={areRatingsLoading ? "" : qualitySelection}
                onChange={(e) => setQualityOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading || areRatingsLoading}
              >
                {areRatingsLoading ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">None</option>
                    {qualityOptions.map((option) => (
                      <option key={option.optionId} value={option.optionId}>
                        {option.label}
                      </option>
                    ))}
                  </>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="updateCostRating">
              <Form.Label>Cost Rating</Form.Label>
              <Form.Select
                value={areRatingsLoading ? "" : costSelection}
                onChange={(e) => setCostOptionId(e.target.value)}
                disabled={isPending || areOptionsLoading || areRatingsLoading}
              >
                {areRatingsLoading ? (
                  <option value="">Loading...</option>
                ) : (
                  <>
                    <option value="">None</option>
                    {costOptions.map((option) => (
                      <option key={option.optionId} value={option.optionId}>
                        {option.label}
                      </option>
                    ))}
                  </>
                )}
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        {confirmingDelete ? (
          <>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isDeletingVenue ? (
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
            <Button
              variant="outline-secondary"
              onClick={() => setConfirmingDelete(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isPending || !canSave || areOptionsLoading}
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
            <Button
              variant="outline-danger"
              onClick={() => setConfirmingDelete(true)}
              disabled={isPending}
            >
              Delete Venue
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default GroupVenueModal;
