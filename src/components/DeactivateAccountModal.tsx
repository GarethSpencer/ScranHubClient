import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import {
  useGetCurrentUser,
  useUpdateUser,
} from "../api/controllerHooks/useUserController";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import useAuth from "../auth/useAuth";

interface Props {
  showDeactivateAccountModal: boolean;
  setShowDeactivateAccountModal: (input: boolean) => void;
}

function DeactivateAccountModal({
  showDeactivateAccountModal,
  setShowDeactivateAccountModal,
}: Props) {
  const { data, isLoading, isError } = useGetCurrentUser();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const updateUserMutation = useUpdateUser(data?.user?.userId ?? "", {
    skipInvalidation: true,
  });

  if (isError) return null;

  if (isLoading)
    return (
      <Modal
        show={showDeactivateAccountModal}
        onHide={() => {
          setShowDeactivateAccountModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Loading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
            <Placeholder xs={8} />
          </Placeholder>
          <Placeholder as="p" animation="glow">
            <Placeholder xs={12} />
            <Placeholder xs={11} />
          </Placeholder>
          <Placeholder.Button xs={12} aria-hidden="true" />
        </Modal.Body>
      </Modal>
    );

  const logoutAction = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  const handleOnClick = () => {
    updateUserMutation.mutate(
      {
        displayName: data!.user!.displayName,
        admin: data!.user!.admin,
        active: false,
      },
      {
        onSuccess: () => {
          setIsLoggingOut(true);
          logoutAction();
        },
      },
    );
  };

  const isBusy = updateUserMutation.isPending || isLoggingOut;

  return (
    <Modal
      show={showDeactivateAccountModal}
      onHide={() => {
        if (isBusy) return;
        setShowDeactivateAccountModal(false);
      }}
      backdrop={isBusy ? "static" : true}
      keyboard={!isBusy}
    >
      <Modal.Header closeButton={!isBusy}>
        <Modal.Title>Deactivate Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Deactivating your account will prevent you from appearing in search
          results or receiving friend requests.
        </p>
        <p>
          After 30 days, your account will be automatically deleted. If you log
          in during the next 30 days, your account will be reactivated.
        </p>
        <div className="d-grid">
          <Button
            variant="danger"
            type="button"
            disabled={isBusy}
            onClick={handleOnClick}
          >
            {isBusy ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {isLoggingOut ? "Logging out..." : "Updating..."}
              </>
            ) : (
              "Deactivate Account"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeactivateAccountModal;
