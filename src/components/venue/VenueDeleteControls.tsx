import type { ReactNode } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import type useVenueDelete from "../../hooks/useVenueDelete";

export const VenueDeleteConfirmMessage = ({
  venueName,
}: {
  venueName: string | undefined;
}) => (
  <p className="mb-0">
    Are you sure you want to delete <strong>{venueName}</strong>? This action
    cannot be undone.
  </p>
);

interface VenueDeleteFooterProps {
  deleteFlow: ReturnType<typeof useVenueDelete>;
  isPending: boolean;
  children: ReactNode;
}

export const VenueDeleteFooter = ({
  deleteFlow,
  isPending,
  children,
}: VenueDeleteFooterProps) => {
  if (deleteFlow.confirmingDelete) {
    return (
      <>
        <Button
          key="confirm-delete"
          variant="danger"
          onClick={deleteFlow.confirmDelete}
          disabled={isPending}
        >
          {deleteFlow.isDeleting ? (
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
          key="cancel-delete"
          variant="outline-secondary"
          onClick={deleteFlow.cancelConfirm}
          disabled={isPending}
        >
          Cancel
        </Button>
      </>
    );
  }

  return (
    <>
      {children}
      <Button
        key="delete-venue"
        variant="outline-danger"
        onClick={deleteFlow.startConfirm}
        disabled={isPending}
      >
        Delete Venue
      </Button>
    </>
  );
};
