import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useDeleteGroup } from "../api/controllerHooks/useGroupController";
import type GroupDetailedResult from "../models/results/GroupDetailedResult";

interface Props {
  group: GroupDetailedResult;
}

const AdminGroupRow = ({ group }: Props) => {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

  const onConfirmDelete = () => {
    deleteGroup(group.groupId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", "groups"] });
        setShowDeleteConfirm(false);
      },
    });
  };

  return (
    <>
      <tr>
        <td>{group.groupName}</td>
        <td>
          {group.active ? (
            <FaCheck
              className="text-success"
              size={18}
              aria-label="Active"
              role="img"
            />
          ) : (
            <FaXmark
              className="text-danger"
              size={18}
              aria-label="Inactive"
              role="img"
            />
          )}
        </td>
        <td>{group.userCount}</td>
        <td>{group.venueCount}</td>
        <td>{group.displayName}</td>
        <td>{new Date(group.createdOn).toLocaleDateString()}</td>
        <td>
          {group.updatedOn
            ? new Date(group.updatedOn).toLocaleDateString()
            : "—"}
        </td>
        <td>
          <div className="d-flex justify-content-center">
            <OverlayTrigger overlay={<Tooltip>Delete group</Tooltip>}>
              <span className="d-inline-block">
                <Button
                  className="icon-btn"
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  aria-label="Delete group"
                >
                  {isDeleting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <FaTrash />
                  )}
                </Button>
              </span>
            </OverlayTrigger>
          </div>
        </td>
      </tr>

      <Modal
        show={showDeleteConfirm}
        onHide={() => {
          if (!isDeleting) setShowDeleteConfirm(false);
        }}
        backdrop={isDeleting ? "static" : true}
        keyboard={!isDeleting}
        centered
      >
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete{" "}
          <strong>{group.groupName}</strong>? This will also delete all of its
          venues, options and ratings. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminGroupRow;
