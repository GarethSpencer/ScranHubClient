import { useState } from "react";
import { MAX_NAME_LENGTH } from "../../constants/validation";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import type { useSetCustomOptions } from "../../api/controllerHooks/useOptionController";

interface Props {
  show: boolean;
  heading: string;
  groupId: string;
  initialLabels: string[];
  setCustomOptions: ReturnType<typeof useSetCustomOptions>;
  onClose: () => void;
}

const OptionEditorPanel = ({
  show,
  heading,
  groupId,
  initialLabels,
  setCustomOptions,
  onClose,
}: Props) => {
  const [labels, setLabels] = useState<string[]>(initialLabels);

  const canSave =
    labels.length > 0 && labels.every((label) => label.trim().length > 0);

  const handleLabelChange = (index: number, value: string) => {
    setLabels((current) =>
      current.map((label, i) => (i === index ? value : label)),
    );
  };

  const handleAddLabel = () => setLabels((current) => [...current, ""]);

  const handleRemoveLabel = (index: number) => {
    setLabels((current) => current.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const cleanedLabels = labels
      .map((label) => label.trim())
      .filter((label) => label.length > 0);

    if (cleanedLabels.length === 0) return;

    setCustomOptions.mutate(
      { groupId, labels: cleanedLabels },
      { onSuccess: onClose },
    );
  };

  return (
    <Collapse in={show}>
      <div>
        <div className="section-panel option-editor-panel mb-3">
          <h3 className="lead mb-1">Custom {heading}</h3>
          <p className="text-muted small mb-3">
            Add the labels you want this group to use. These will replace the
            default options and unset all venues in the group.
          </p>
          <Form onSubmit={(e) => e.preventDefault()}>
            {labels.map((label, index) => (
              <InputGroup className="mb-2" key={index}>
                <Form.Control
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleRemoveLabel(index)}
                  aria-label={`Remove option ${index + 1}`}
                >
                  ✕
                </Button>
              </InputGroup>
            ))}
            <div className="d-flex justify-content-between gap-2 mt-3">
              <Button variant="outline-secondary" onClick={handleAddLabel}>
                + Add option
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!canSave || setCustomOptions.isPending}
              >
                {setCustomOptions.isPending ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Collapse>
  );
};

export default OptionEditorPanel;
