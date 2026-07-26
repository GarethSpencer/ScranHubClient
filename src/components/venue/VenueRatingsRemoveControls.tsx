import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import type useVenueRatingsRemove from "../../hooks/useVenueRatingsRemove";

interface Props {
  removeFlow: ReturnType<typeof useVenueRatingsRemove>;
  hasSavedRatings: boolean;
  isPending: boolean;
}

const VenueRatingsRemoveControls = ({
  removeFlow,
  hasSavedRatings,
  isPending,
}: Props) => {
  if (!hasSavedRatings) return null;

  return (
    <Button
      variant="outline-danger"
      onClick={removeFlow.remove}
      disabled={isPending}
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
  );
};

export default VenueRatingsRemoveControls;
