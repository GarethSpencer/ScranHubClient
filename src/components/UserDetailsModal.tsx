import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ApiClient from "../api/apiClient";
import type GetUserResponse from "../models/responses/GetUserResponse";
import { useQuery } from "@tanstack/react-query";
import Placeholder from "react-bootstrap/Placeholder";

interface Props {
  showUserDetailsModal: boolean;
  setShowUserDetailsModal: (input: boolean) => void;
}

function UserDetailsModal({
  showUserDetailsModal,
  setShowUserDetailsModal,
}: Props) {
  const apiClient = new ApiClient<GetUserResponse>("/user/me");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userInfo", "me"],
    queryFn: apiClient.get,
  });

  if (isError) return null;

  if (isLoading)
    return (
      <Modal
        show={showUserDetailsModal}
        onHide={() => {
          setShowUserDetailsModal(false);
        }}
      >
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>Loading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
          </Placeholder>{" "}
        </Modal.Body>
      </Modal>
    );

  return (
    <Modal
      show={showUserDetailsModal}
      onHide={() => {
        setShowUserDetailsModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>My Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>Your name is {data?.user.displayName}</Modal.Body>
      {isLoading ? null : (
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUserDetailsModal(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowUserDetailsModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default UserDetailsModal;
