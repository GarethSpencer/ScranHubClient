import SaveButton from "./common/SaveButton";
import useSaveFeedback from "../hooks/useSaveFeedback";
import type UserResult from "../models/results/UserResult";

interface Props {
  user: UserResult;
  disabled: boolean;
  onSendRequest: (userId: string) => Promise<unknown>;
  onSent: () => void;
}

const FriendSearchResultRow = ({
  user,
  disabled,
  onSendRequest,
  onSent,
}: Props) => {
  const saveFeedback = useSaveFeedback();

  const handleSend = () =>
    saveFeedback.save(() => onSendRequest(user.userId), onSent);

  return (
    <tr>
      <td className="w-50 text-start text-break">{user.displayName}</td>
      <td className="w-50">
        <SaveButton
          status={saveFeedback.status}
          label="Send Request"
          savingLabel="Sending..."
          savedLabel="Sent!"
          onClick={handleSend}
          disabled={disabled}
        />
      </td>
    </tr>
  );
};

export default FriendSearchResultRow;
