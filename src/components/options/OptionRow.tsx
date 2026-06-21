import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import type { useUpdateCustomOption } from "../../api/controllerHooks/useOptionController";
import type TypeOptionResult from "../../models/results/generic/TypeOptionResult";

interface Props {
  option: TypeOptionResult;
  updateCustomOption: ReturnType<typeof useUpdateCustomOption>;
  onRequestDelete: (option: TypeOptionResult) => void;
}

const OptionRow = ({ option, updateCustomOption, onRequestDelete }: Props) => {
  const [draftLabel, setDraftLabel] = useState(option.label);

  const trimmed = draftLabel.trim();
  const hasChanged = trimmed !== "" && trimmed !== option.label;
  const isPending = updateCustomOption.isPending;

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
            disabled={isPending}
          />
          <Button
            variant="link"
            className={`p-0${hasChanged ? "" : " invisible"}`}
            onClick={handleReset}
            disabled={isPending || !hasChanged}
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
                disabled={isPending}
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
