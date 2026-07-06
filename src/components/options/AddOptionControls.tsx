import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPlus, FaCheck } from "react-icons/fa";
import { RxReset } from "react-icons/rx";

interface Props {
  isAdding: boolean;
  canSave: boolean;
  isPending: boolean;
  onStart: () => void;
  onReset: () => void;
  onSave: () => void;
}

const AddOptionControls = ({
  isAdding,
  canSave,
  isPending,
  onStart,
  onReset,
  onSave,
}: Props) => {
  if (!isAdding) {
    return (
      <OverlayTrigger overlay={<Tooltip>Add option</Tooltip>}>
        <span className="d-inline-block">
          <Button
            variant="success"
            className="icon-btn"
            onClick={onStart}
            aria-label="Add option"
          >
            <FaPlus />
          </Button>
        </span>
      </OverlayTrigger>
    );
  }

  return (
    <div className="d-flex justify-content-end gap-2">
      <OverlayTrigger overlay={<Tooltip>Reset</Tooltip>}>
        <span className="d-inline-block">
          <Button
            variant="outline-secondary"
            className="icon-btn"
            onClick={onReset}
            disabled={isPending}
            aria-label="Reset new option"
          >
            <RxReset />
          </Button>
        </span>
      </OverlayTrigger>
      <OverlayTrigger overlay={<Tooltip>Save</Tooltip>}>
        <span className="d-inline-block">
          <Button
            variant="primary"
            className="icon-btn"
            onClick={onSave}
            disabled={!canSave || isPending}
            aria-label="Save new option"
          >
            {isPending ? <Spinner animation="border" size="sm" /> : <FaCheck />}
          </Button>
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default AddOptionControls;
