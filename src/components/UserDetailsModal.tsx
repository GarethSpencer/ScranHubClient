import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import UserDetailsForm from "./UserDetailsForm";
import {
  useGetCurrentUser,
  useUpdateUser,
} from "../api/controllerHooks/useUserController";

interface Props {
  showUserDetailsModal: boolean;
  setShowUserDetailsModal: (input: boolean) => void;
}

function UserDetailsModal({
  showUserDetailsModal,
  setShowUserDetailsModal,
}: Props) {
  const { data, isLoading, isError } = useGetCurrentUser();

  const updateUserMutation = useUpdateUser(data?.user?.userId ?? "");

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
        if (updateUserMutation.isPending) return;
        setShowUserDetailsModal(false);
      }}
      backdrop={updateUserMutation.isPending ? "static" : true}
      keyboard={!updateUserMutation.isPending}
    >
      <Modal.Header closeButton={!updateUserMutation.isPending}>
        <Modal.Title>My Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserDetailsForm
          setShowUserDetailsModal={setShowUserDetailsModal}
          updateUserMutation={updateUserMutation}
        />
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;
