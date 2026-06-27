import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import EmojiPicker, {
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";
import useDarkMode from "../contexts/darkMode/useDarkMode";
import { useUpdateGroup } from "../api/controllerHooks/useGroupController";
import type GroupResult from "../models/results/GroupResult";

interface Props {
  group: GroupResult | null;
  onHide: () => void;
}

const GroupIconModal = ({ group, onHide }: Props) => {
  const { state: isDarkMode } = useDarkMode();
  const { mutate, isPending } = useUpdateGroup();

  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(
    undefined,
  );

  const previewIcon = selectedIcon ?? group?.icon;

  const onEmojiClick = (data: EmojiClickData) => {
    setSelectedIcon(data.emoji);
  };

  const close = () => {
    setSelectedIcon(undefined);
    onHide();
  };

  const onSave = (icon: string) => {
    if (!group) return;
    mutate(
      {
        groupId: group.groupId,
        requestData: {
          groupName: group.groupName,
          active: group.active,
          icon,
        },
      },
      { onSuccess: () => close() },
    );
  };

  return (
    <Modal
      show={group !== null}
      onHide={() => {
        if (!isPending) close();
      }}
      backdrop={isPending ? "static" : true}
      keyboard={!isPending}
      centered
    >
      <Modal.Header closeButton={!isPending}>
        <Modal.Title>Set Group Icon</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center gap-3">
        <p className="text-muted small text-center mb-0">
          Pick an emoji icon for <strong>{group?.groupName}</strong>.
        </p>
        <span className="group-card-avatar group-icon-preview flex-shrink-0">
          {previewIcon ?? group?.groupName.charAt(0).toUpperCase()}
        </span>
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          emojiStyle={EmojiStyle.NATIVE}
          theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
          width="100%"
          lazyLoadEmojis
        />
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button
          variant="outline-danger"
          onClick={() => onSave("")}
          disabled={isPending || !group?.icon}
        >
          Remove icon
        </Button>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            onClick={close}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => selectedIcon && onSave(selectedIcon)}
            disabled={isPending || !selectedIcon}
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
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default GroupIconModal;
