import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { useUpdateUser } from "../api/controllerHooks/useUserController";
import type UserAdminResult from "../models/results/UserAdminResult";

type PendingAction = "admin" | "active" | null;

interface Props {
  user: UserAdminResult;
  isCurrentUser: boolean;
}

const BoolIcon = ({ value, label }: { value: boolean; label: string }) =>
  value ? (
    <FaCheck className="text-success" size={18} aria-label={label} role="img" />
  ) : (
    <FaXmark className="text-danger" size={18} aria-label={label} role="img" />
  );

const AdminUserRow = ({ user, isCurrentUser }: Props) => {
  const queryClient = useQueryClient();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const { mutate: updateUser, isPending } = useUpdateUser(user.userId, {
    skipInvalidation: true,
  });

  // Sends the full update request with the current values, overriding only the
  // fields passed in, then refreshes the admin users table on success. The
  // action is tracked so only the button that was pressed shows a spinner.
  const applyUpdate = (
    action: Exclude<PendingAction, null>,
    changes: Partial<{ admin: boolean; active: boolean }>,
    onSuccess?: () => void,
  ) => {
    setPendingAction(action);
    updateUser(
      {
        displayName: user.displayName,
        admin: user.admin,
        active: user.active,
        ...changes,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
          onSuccess?.();
        },
        onSettled: () => {
          setPendingAction(null);
        },
      },
    );
  };

  // Admin is intentionally promote-only: there is no superuser tier, so we never
  // expose a way to revoke admin (which could leave the app with zero admins).
  // Both actions are also hidden for other admins, mirroring the backend, which
  // rejects any edit to an admin other than yourself.
  const canManage = !user.admin && !isCurrentUser;

  return (
    <>
      <tr>
        <td>{user.displayName}</td>
        <td>
          <BoolIcon
            value={user.authId != null}
            label={user.authId != null ? "Authenticated" : "Not authenticated"}
          />
        </td>
        <td>
          <BoolIcon
            value={user.active}
            label={user.active ? "Active" : "Inactive"}
          />
        </td>
        <td>
          <BoolIcon
            value={user.admin}
            label={user.admin ? "Admin" : "Not admin"}
          />
        </td>
        <td>{new Date(user.createdOn).toLocaleDateString()}</td>
        <td>
          {user.updatedOn ? new Date(user.updatedOn).toLocaleDateString() : "—"}
        </td>
        <td>
          {canManage && (
            <div className="d-flex justify-content-center gap-2">
              <OverlayTrigger overlay={<Tooltip>Make admin</Tooltip>}>
                <span className="d-inline-block">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => setShowAdminConfirm(true)}
                    disabled={isPending}
                    aria-label="Make admin"
                  >
                    {pendingAction === "admin" ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <RiAdminLine size={17} />
                    )}
                  </Button>
                </span>
              </OverlayTrigger>
              <OverlayTrigger
                overlay={
                  <Tooltip>{user.active ? "Deactivate" : "Reactivate"}</Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Button
                    size="sm"
                    variant={user.active ? "outline-danger" : "outline-success"}
                    onClick={() =>
                      applyUpdate("active", { active: !user.active })
                    }
                    disabled={isPending}
                    aria-label={user.active ? "Deactivate" : "Reactivate"}
                  >
                    {pendingAction === "active" ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FaPowerOff size={17} />
                    )}
                  </Button>
                </span>
              </OverlayTrigger>
            </div>
          )}
        </td>
      </tr>

      <Modal
        show={showAdminConfirm}
        onHide={() => {
          if (!isPending) setShowAdminConfirm(false);
        }}
        backdrop={isPending ? "static" : true}
        keyboard={!isPending}
        centered
      >
        <Modal.Header closeButton={!isPending}>
          <Modal.Title>Make Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to make <strong>{user.displayName}</strong> an
          admin? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAdminConfirm(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              applyUpdate("admin", { admin: true }, () =>
                setShowAdminConfirm(false),
              )
            }
            disabled={isPending}
          >
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
                Making admin...
              </>
            ) : (
              "Make Admin"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminUserRow;
