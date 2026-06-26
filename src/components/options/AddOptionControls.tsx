import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

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
      <Button
        variant="success"
        size="sm"
        onClick={onStart}
        aria-label="Add option"
      >
        + Add
      </Button>
    );
  }

  return (
    <div className="d-flex justify-content-end gap-2">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onReset}
        disabled={isPending}
      >
        Reset
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={onSave}
        disabled={!canSave || isPending}
      >
        {isPending ? <Spinner animation="border" size="sm" /> : "Save"}
      </Button>
    </div>
  );
};

export default AddOptionControls;
