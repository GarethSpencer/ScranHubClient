import Table from "react-bootstrap/Table";
import { MAX_NAME_LENGTH } from "../constants/validation";
import {
  useDeleteGroup,
  useGetUserGroups,
  useUpdateGroup,
} from "../api/controllerHooks/useGroupController";
import { useGetCurrentUser } from "../api/controllerHooks/useUserController";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./common/TableStatus";
import useActingState from "../hooks/useActingState";
import { useState } from "react";
import { RxReset } from "react-icons/rx";
import { FaPencilAlt, FaPowerOff, FaTrash } from "react-icons/fa";
import type GroupResult from "../models/results/GroupResult";

const MyGroupTable = () => {
  const { data, isLoading, isError } = useGetUserGroups();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate, isPending } = useUpdateGroup();
  const { mutate: deleteGroup, isPending: isDeleting } = useDeleteGroup();

  const { isActing, mutationCallbacks } = useActingState();

  const [draftNames, setDraftNames] = useState<Record<string, string>>({});
  const [groupToDelete, setGroupToDelete] = useState<GroupResult | null>(null);

  const groups = data?.userGroups ?? [];
  const currentUserId = currentUser?.user?.userId;

  const getDraftName = (group: GroupResult) =>
    draftNames[group.groupId] ?? group.groupName;

  const hasNameChanged = (group: GroupResult) => {
    const draft = getDraftName(group).trim();
    return draft !== "" && draft !== group.groupName;
  };

  const onChangeName = (groupId: string, value: string) => {
    setDraftNames((prev) => ({ ...prev, [groupId]: value }));
  };

  const onResetName = (groupId: string) => {
    setDraftNames((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  };

  const onSetGroupActive = (group: GroupResult, active: boolean) => {
    mutate(
      {
        groupId: group.groupId,
        requestData: {
          groupName: group.groupName,
          active,
        },
      },
      mutationCallbacks(group.groupId, "setActive"),
    );
  };

  const onConfirmDelete = () => {
    if (!groupToDelete) return;
    deleteGroup(
      groupToDelete.groupId,
      mutationCallbacks(groupToDelete.groupId, "delete", {
        onSuccess: () => setGroupToDelete(null),
        onError: () => setGroupToDelete(null),
      }),
    );
  };

  const onUpdateGroupName = (group: GroupResult) => {
    mutate(
      {
        groupId: group.groupId,
        requestData: {
          groupName: getDraftName(group).trim(),
          active: group.active,
        },
      },
      mutationCallbacks(group.groupId, "updateName", {
        onSuccess: () => onResetName(group.groupId),
      }),
    );
  };

  return (
    <>
      <h2 className="mb-1 lead">My Created Groups</h2>
      <p className="text-muted small mb-3">
        Rename, deactivate, or delete the groups you've created. Deactivated
        groups can't be accessed by other users.
      </p>
      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={groups.length === 0}
        loadingText="Loading your groups..."
        errorText="Couldn't load your groups. Please try again."
      >
        <Table
          striped="columns"
          className="align-middle text-center border-top my-group-table"
        >
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groups
              .filter((x) => x.createdBy === currentUserId)
              .map((x: GroupResult) => (
                <tr key={x.groupId}>
                  <td className="text-start">
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        value={getDraftName(x)}
                        onChange={(e) =>
                          onChangeName(x.groupId, e.target.value)
                        }
                        disabled={isPending}
                        maxLength={MAX_NAME_LENGTH}
                      />
                      <Button
                        variant="link"
                        className={`p-0 ${
                          hasNameChanged(x) ? "" : " invisible"
                        }`}
                        onClick={() => onResetName(x.groupId)}
                        disabled={isPending || !hasNameChanged(x)}
                        title="Reset name"
                        aria-label="Reset name"
                      >
                        <RxReset size={25} />
                      </Button>
                    </div>
                  </td>
                  <td>{x.active ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                      <OverlayTrigger overlay={<Tooltip>Update name</Tooltip>}>
                        <span
                          className={
                            hasNameChanged(x) ? "d-inline-block" : "d-none"
                          }
                        >
                          <Button
                            variant="secondary"
                            onClick={() => onUpdateGroupName(x)}
                            disabled={isPending || isDeleting}
                            aria-label="Update name"
                          >
                            {isActing(x.groupId, "updateName") ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FaPencilAlt />
                            )}
                          </Button>
                        </span>
                      </OverlayTrigger>
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            {x.active ? "Deactivate group" : "Activate group"}
                          </Tooltip>
                        }
                      >
                        <span className="d-inline-block">
                          <Button
                            variant={x.active ? "primary" : "success"}
                            onClick={() => onSetGroupActive(x, !x.active)}
                            disabled={isPending || isDeleting}
                            aria-label={
                              x.active ? "Deactivate group" : "Activate group"
                            }
                          >
                            {isActing(x.groupId, "setActive") ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FaPowerOff />
                            )}
                          </Button>
                        </span>
                      </OverlayTrigger>
                      {!x.active && (
                        <OverlayTrigger
                          overlay={<Tooltip>Delete group</Tooltip>}
                        >
                          <span className="d-inline-block">
                            <Button
                              variant="danger"
                              onClick={() => setGroupToDelete(x)}
                              disabled={isPending || isDeleting}
                              aria-label="Delete group"
                            >
                              {isActing(x.groupId, "delete") ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <FaTrash />
                              )}
                            </Button>
                          </span>
                        </OverlayTrigger>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableStatus>

      <Modal
        show={groupToDelete !== null}
        onHide={() => {
          if (!isDeleting) setGroupToDelete(null);
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
          <strong>{groupToDelete?.groupName}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setGroupToDelete(null)}
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

export default MyGroupTable;
