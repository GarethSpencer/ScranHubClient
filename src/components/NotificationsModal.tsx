import Modal from "react-bootstrap/Modal";
import PendingFriendRequests from "./PendingFriendRequests";

interface Props {
  showNotificationsModal: boolean;
  setShowNotificationsModal: (input: boolean) => void;
}

function NotificationsModal({
  showNotificationsModal,
  setShowNotificationsModal,
}: Props) {
  return (
    <Modal
      show={showNotificationsModal}
      onHide={() => setShowNotificationsModal(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Pending Friend Requests</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PendingFriendRequests />
      </Modal.Body>
    </Modal>
  );
}

export default NotificationsModal;
