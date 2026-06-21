import type { ReactNode } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

interface Props {
  show: boolean;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  show,
  title,
  body,
  confirmLabel = "Confirm",
  pendingLabel = "Working...",
  isPending,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      show={show}
      onHide={() => {
        if (isPending) return;
        onCancel();
      }}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      centered
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isPending}>
          {isPending ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              {pendingLabel}
            </>
          ) : (
            confirmLabel
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
