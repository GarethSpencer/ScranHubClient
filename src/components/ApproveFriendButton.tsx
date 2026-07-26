import SaveButton from "./common/SaveButton";
import useSaveFeedback from "../hooks/useSaveFeedback";

interface Props {
  friendId: string;
  disabled: boolean;
  onApprove: (friendId: string) => Promise<unknown>;
  onApproved: () => void;
  onFeedbackDone: () => void;
}

const ApproveFriendButton = ({
  friendId,
  disabled,
  onApprove,
  onApproved,
  onFeedbackDone,
}: Props) => {
  const saveFeedback = useSaveFeedback();

  const handleApprove = () =>
    saveFeedback.save(async () => {
      await onApprove(friendId);
      onApproved();
    }, onFeedbackDone);

  return (
    <SaveButton
      variant="success"
      status={saveFeedback.status}
      label="Approve"
      savingLabel="Approving..."
      savedLabel="Approved!"
      onClick={handleApprove}
      disabled={disabled}
    />
  );
};

export default ApproveFriendButton;
