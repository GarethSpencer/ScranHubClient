import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import type { useUpdateCustomOption } from "../../api/controllerHooks/useOptionController";
import type TypeOptionResult from "../../models/results/generic/TypeOptionResult";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";

type OptionResult = TypeOptionResult | RatingOptionResult;

interface Props<T extends OptionResult> {
  option: T;
  updateCustomOption: ReturnType<typeof useUpdateCustomOption>;
  onRequestDelete: (option: T) => void;
  onDirtyChange?: (optionId: string, isDirty: boolean) => void;
  disabled?: boolean;
}

const OptionRow = <T extends OptionResult>({
  option,
  updateCustomOption,
  onRequestDelete,
  onDirtyChange,
  disabled = false,
}: Props<T>) => {
  const [draftLabel, setDraftLabel] = useState(option.label);

  const trimmed = draftLabel.trim();
  const hasChanged = trimmed !== "" && trimmed !== option.label;
  const isPending = updateCustomOption.isPending;
  const isLocked = isPending || disabled;

  useEffect(() => {
    onDirtyChange?.(option.optionId, hasChanged);
  }, [onDirtyChange, option.optionId, hasChanged]);

  useEffect(() => {
    return () => onDirtyChange?.(option.optionId, false);
  }, [onDirtyChange, option.optionId]);

  const handleReset = () => setDraftLabel(option.label);

  const handleUpdate = () => {
    updateCustomOption.mutate({
      optionId: option.optionId,
      request: { label: trimmed },
    });
  };

  return (
    <tr>
      <td className="text-break">
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            type="text"
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            disabled={isLocked}
          />
          <Button
            variant="link"
            className={`p-0${hasChanged ? "" : " invisible"}`}
            onClick={handleReset}
            disabled={isLocked || !hasChanged}
            title="Reset label"
            aria-label="Reset label"
          >
            <RxReset size={22} />
          </Button>
        </div>
      </td>
      <td className="option-actions-col text-end">
        <div className="d-flex justify-content-end gap-2">
          <OverlayTrigger overlay={<Tooltip>Update label</Tooltip>}>
            <span className={hasChanged ? "d-inline-block" : "d-none"}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleUpdate}
                disabled={isLocked}
                aria-label={`Update ${option.label}`}
              >
                <FaPencilAlt />
              </Button>
            </span>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Delete option</Tooltip>}>
            <span className="d-inline-block">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onRequestDelete(option)}
                disabled={isLocked}
                aria-label={`Delete ${option.label}`}
              >
                <FaTrash />
              </Button>
            </span>
          </OverlayTrigger>
        </div>
      </td>
    </tr>
  );
};

export default OptionRow;
