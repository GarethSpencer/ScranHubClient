import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import TableStatus from "./common/TableStatus";
import SaveButton from "./common/SaveButton";
import useSaveFeedback from "../hooks/useSaveFeedback";
import { useGetFriendsInfinite } from "../api/controllerHooks/useUserController";
import { useCreateGroup } from "../api/controllerHooks/useGroupController";
import { FriendshipStatus } from "../enums/FriendshipStatus";
import type FriendResult from "../models/results/FriendResult";

interface Props {
  show: boolean;
  groupName: string;
  onClose: () => void;
  onCreated: () => void;
}

const CreateGroupModal = ({ show, groupName, onClose, onCreated }: Props) => {
  const pageSize = 10;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFriendsInfinite({
    pageSize: pageSize,
    status: FriendshipStatus.Accepted,
  });

  const { mutateAsync } = useCreateGroup();
  const saveFeedback = useSaveFeedback();

  const isPending = saveFeedback.isBusy;

  const sentinelRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "50px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const friends = data?.pages.flatMap((page) => page.friends ?? []) ?? [];

  const resetForm = () => {
    setSelectedIds([]);
  };

  const toggleFriend = (friendId: string) => {
    setSelectedIds((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleCreate = () => {
    if (isPending) return;

    saveFeedback.save(
      () =>
        mutateAsync({
          groupName: groupName.trim(),
          initialMemberIds: selectedIds.length > 0 ? selectedIds : undefined,
        }),
      onCreated,
    );
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      onEntered={resetForm}
      onExited={saveFeedback.reset}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      scrollable
      centered
      dialogClassName="create-group-modal"
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small mb-3">
          Creating <strong className="text-break">{groupName}</strong>. Select
          any friends you'd like to add to the group. Other friends can choose
          to join the group later.
        </p>
        <TableStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={friends.length === 0}
          loadingText="Loading your friends…"
          errorText="Couldn't load your friends. Please try again."
          emptyText="You don't have any friends to add yet."
        >
          <Table
            striped="columns"
            className="align-middle text-center border-top"
          >
            <tbody>
              {friends.map((x: FriendResult) => (
                <tr
                  key={x.userFriendId}
                  className={`friend-select-row${
                    selectedIds.includes(x.friendId) ? " is-selected" : ""
                  }`}
                  onClick={() => !isPending && toggleFriend(x.friendId)}
                >
                  <td className="w-75 text-start text-break">
                    {x.displayName}
                  </td>
                  <td className="w-25">
                    <Form.Check
                      type="checkbox"
                      aria-label={`Add ${x.displayName} to the group`}
                      checked={selectedIds.includes(x.friendId)}
                      onChange={() => toggleFriend(x.friendId)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isPending}
                      className="d-flex justify-content-center"
                    />
                  </td>
                </tr>
              ))}
              {hasNextPage && (
                <tr ref={sentinelRef}>
                  <td colSpan={2} className="text-center">
                    {isFetchingNextPage && (
                      <Spinner animation="border" size="sm" />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableStatus>
      </Modal.Body>
      <Modal.Footer className="modal-footer-stacked gap-2">
        <SaveButton
          status={saveFeedback.status}
          label="Create Group"
          savingLabel="Creating..."
          savedLabel="Group Created!"
          onClick={handleCreate}
        />
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupModal;
