import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import UserDetailsForm from "./UserDetailsForm";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";

interface Props {
  showUserDetailsModal: boolean;
  setShowUserDetailsModal: (input: boolean) => void;
}

function UserDetailsModal({
  showUserDetailsModal,
  setShowUserDetailsModal,
}: Props) {
  const { isLoading, isError } = useGetCurrentUser();

  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  if (isError) return null;

  if (isLoading)
    return (
      <Modal
        show={showUserDetailsModal}
        onHide={() => {
          setShowUserDetailsModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Loading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
        </Modal.Body>
      </Modal>
    );

  return (
    <Modal
      show={showUserDetailsModal}
      onHide={() => {
        if (isUpdatingUser) return;
        setShowUserDetailsModal(false);
      }}
      backdrop={isUpdatingUser ? "static" : true}
      keyboard={!isUpdatingUser}
    >
      <Modal.Header closeButton={!isUpdatingUser}>
        <Modal.Title>My Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserDetailsForm
          setShowUserDetailsModal={setShowUserDetailsModal}
          onUpdateUserPendingChange={setIsUpdatingUser}
        />
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;
