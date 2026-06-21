import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Collapse from "react-bootstrap/Collapse";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import TableStatus from "./TableStatus";
import ConfirmModal from "./ConfirmModal";
import {
  useAddCustomOption,
  useGetTypeOptionsForGroup,
  useRemoveCustomOption,
  useRemoveCustomOptions,
  useSetCustomOptions,
  useUpdateCustomOption,
  type TypeOptionController,
} from "../api/controllerHooks/useOptionController";
import type TypeOptionResult from "../models/results/generic/TypeOptionResult";

interface Props {
  controller: TypeOptionController;
  groupId: string;
  heading: string;
  helperText: string;
  itemNamePlural: string;
}

const TypeOptionConfiguration = ({
  controller,
  groupId,
  heading,
  helperText,
  itemNamePlural,
}: Props) => {
  const { data, isLoading, isError } = useGetTypeOptionsForGroup(
    controller,
    groupId,
  );

  const setCustomOptions = useSetCustomOptions(controller, groupId);
  const removeCustomOptions = useRemoveCustomOptions(controller, groupId);
  const addCustomOption = useAddCustomOption(controller, groupId);
  const removeCustomOption = useRemoveCustomOption(controller, groupId);
  const updateCustomOption = useUpdateCustomOption(controller, groupId);

  const [isEditing, setIsEditing] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const [optionToDelete, setOptionToDelete] = useState<TypeOptionResult | null>(
    null,
  );

  const [showRemoveAll, setShowRemoveAll] = useState(false);

  const [draftLabels, setDraftLabels] = useState<Record<string, string>>({});

  const options = data?.options ?? [];

  const sortedOptions = options
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label));

  const hasCustomOptions = options.some((option) => option.groupId === groupId);

  const isToggling =
    setCustomOptions.isPending || removeCustomOptions.isPending;

  const handleOpenEditor = () => {
    const prefill = sortedOptions.map((option) => option.label);
    setLabels(prefill.length > 0 ? prefill : [""]);
    setIsEditing(true);
  };

  const handleCancelEditor = () => {
    setIsEditing(false);
  };

  const handleLabelChange = (index: number, value: string) => {
    setLabels((current) =>
      current.map((label, i) => (i === index ? value : label)),
    );
  };

  const handleAddLabel = () => {
    setLabels((current) => [...current, ""]);
  };

  const handleRemoveLabel = (index: number) => {
    setLabels((current) => current.filter((_, i) => i !== index));
  };

  const handleSaveCustomOptions = () => {
    const cleanedLabels = labels
      .map((label) => label.trim())
      .filter((label) => label.length > 0);

    if (cleanedLabels.length === 0) return;

    setCustomOptions.mutate(
      { groupId, labels: cleanedLabels },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleRemoveCustomOptions = () => {
    removeCustomOptions.mutate(undefined, {
      onSuccess: () => setShowRemoveAll(false),
    });
  };

  const handleStartAdding = () => {
    setNewLabel("");
    setIsAdding(true);
  };

  const handleResetAdding = () => {
    setNewLabel("");
    setIsAdding(false);
  };

  const handleSaveNewOption = () => {
    const cleanedLabel = newLabel.trim();

    if (cleanedLabel.length === 0) return;

    addCustomOption.mutate(
      { groupId, label: cleanedLabel },
      {
        onSuccess: () => {
          setNewLabel("");
          setIsAdding(false);
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!optionToDelete) return;

    removeCustomOption.mutate(optionToDelete.optionId, {
      onSuccess: () => setOptionToDelete(null),
    });
  };

  const getDraftLabel = (option: TypeOptionResult) =>
    draftLabels[option.optionId] ?? option.label;

  const hasLabelChanged = (option: TypeOptionResult) => {
    const draft = getDraftLabel(option).trim();
    return draft !== "" && draft !== option.label;
  };

  const handleLabelEdit = (optionId: string, value: string) => {
    setDraftLabels((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleResetLabel = (optionId: string) => {
    setDraftLabels((prev) => {
      const next = { ...prev };
      delete next[optionId];
      return next;
    });
  };

  const handleUpdateOption = (option: TypeOptionResult) => {
    updateCustomOption.mutate(
      {
        optionId: option.optionId,
        request: { label: getDraftLabel(option).trim() },
      },
      { onSuccess: () => handleResetLabel(option.optionId) },
    );
  };

  const canSaveNewOption = newLabel.trim().length > 0;

  const canSave =
    labels.length > 0 && labels.every((label) => label.trim().length > 0);

  return (
    <>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-1">
        <h2 className="fw-bold lead mb-0">{heading}</h2>
        {hasCustomOptions ? (
          <Button
            variant="danger"
            onClick={() => setShowRemoveAll(true)}
            disabled={isToggling}
          >
            {isToggling ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Remove Custom Options"
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={isEditing ? handleCancelEditor : handleOpenEditor}
            disabled={isToggling}
            aria-expanded={isEditing}
          >
            {isEditing ? "Cancel" : "Set Custom Options"}
          </Button>
        )}
      </div>
      <p className="text-muted small mb-3">{helperText}</p>

      <Collapse in={isEditing}>
        <div>
          <div className="section-panel option-editor-panel mb-3">
            <h3 className="fw-bold lead mb-1">Custom {heading}</h3>
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
                  onClick={handleSaveCustomOptions}
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

      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={options.length === 0}
        loadingText={`Loading ${itemNamePlural}...`}
        errorText={`Couldn't load ${itemNamePlural}. Please try again.`}
        emptyText={`No ${itemNamePlural} configured yet.`}
      >
        <Table striped="columns" className="align-middle border-top">
          <thead>
            <tr>
              <th>Option</th>
              {hasCustomOptions && (
                <th className="w-25 text-end option-actions-col">
                  {isAdding ? (
                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleResetAdding}
                        disabled={addCustomOption.isPending}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveNewOption}
                        disabled={
                          !canSaveNewOption || addCustomOption.isPending
                        }
                      >
                        {addCustomOption.isPending ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={handleStartAdding}
                      aria-label="Add option"
                    >
                      + Add
                    </Button>
                  )}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isAdding && (
              <tr>
                <td className="text-break">
                  <Form.Control
                    type="text"
                    placeholder="New label"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    autoFocus
                  />
                </td>
                <td className="option-actions-col" />
              </tr>
            )}
            {sortedOptions.map((option: TypeOptionResult) => (
              <tr key={option.optionId}>
                <td className="text-break">
                  {hasCustomOptions ? (
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        value={getDraftLabel(option)}
                        onChange={(e) =>
                          handleLabelEdit(option.optionId, e.target.value)
                        }
                        disabled={updateCustomOption.isPending}
                      />
                      <Button
                        variant="link"
                        className={`p-0${hasLabelChanged(option) ? "" : " invisible"}`}
                        onClick={() => handleResetLabel(option.optionId)}
                        disabled={
                          updateCustomOption.isPending ||
                          !hasLabelChanged(option)
                        }
                        title="Reset label"
                        aria-label="Reset label"
                      >
                        <RxReset size={22} />
                      </Button>
                    </div>
                  ) : (
                    option.label
                  )}
                </td>
                {hasCustomOptions && (
                  <td className="option-actions-col text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <OverlayTrigger overlay={<Tooltip>Update label</Tooltip>}>
                        <span
                          className={
                            hasLabelChanged(option)
                              ? "d-inline-block"
                              : "d-none"
                          }
                        >
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleUpdateOption(option)}
                            disabled={updateCustomOption.isPending}
                            aria-label={`Update ${option.label}`}
                          >
                            <FaPencilAlt />
                          </Button>
                        </span>
                      </OverlayTrigger>
                      <OverlayTrigger
                        overlay={<Tooltip>Delete option</Tooltip>}
                      >
                        <span className="d-inline-block">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setOptionToDelete(option)}
                            aria-label={`Delete ${option.label}`}
                          >
                            <FaTrash />
                          </Button>
                        </span>
                      </OverlayTrigger>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableStatus>

      <ConfirmModal
        show={optionToDelete !== null}
        title="Delete Option"
        body={
          <p className="mb-0">
            Are you sure you want to delete the{" "}
            <strong>{optionToDelete?.label}</strong> option? This can only be
            done if the option is not in use.
          </p>
        }
        confirmLabel="Delete"
        pendingLabel="Deleting..."
        isPending={removeCustomOption.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOptionToDelete(null)}
      />

      <ConfirmModal
        show={showRemoveAll}
        title="Remove Custom Options"
        body={
          <p className="mb-0">
            Are you sure you want to delete the custom options? This will unset
            all venues in the group.
          </p>
        }
        confirmLabel="Remove Custom Options"
        pendingLabel="Removing..."
        isPending={removeCustomOptions.isPending}
        onConfirm={handleRemoveCustomOptions}
        onCancel={() => setShowRemoveAll(false)}
      />
    </>
  );
};

export default TypeOptionConfiguration;
