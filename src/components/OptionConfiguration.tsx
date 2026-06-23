import { useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import TableStatus from "./TableStatus";
import ConfirmModal from "./ConfirmModal";
import OptionRow from "./options/OptionRow";
import ReorderableOptionList from "./options/ReorderableOptionList";
import OptionEditorPanel from "./options/OptionEditorPanel";
import AddOptionControls from "./options/AddOptionControls";
import useOptionReorder from "../hooks/useOptionReorder";
import {
  isRatingController,
  useAddCustomOption,
  useGetOptionsForGroup,
  useRemoveCustomOption,
  useRemoveCustomOptions,
  useSetCustomOptions,
  useUpdateCustomOption,
  type OptionController,
} from "../api/controllerHooks/useOptionController";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

interface Props {
  controller: OptionController;
  groupId: string;
  heading: string;
  helperText: string;
}

const OptionConfiguration = ({
  controller,
  groupId,
  heading,
  helperText,
}: Props) => {
  const reorderable = isRatingController(controller);

  const { data, isLoading, isError } = useGetOptionsForGroup(
    controller,
    groupId,
  );

  const setCustomOptions = useSetCustomOptions(controller, groupId);
  const removeCustomOptions = useRemoveCustomOptions(controller, groupId);
  const addCustomOption = useAddCustomOption(controller, groupId);
  const removeCustomOption = useRemoveCustomOption(controller, groupId);
  const updateCustomOption = useUpdateCustomOption(controller, groupId);
  const reorder = useOptionReorder(controller, groupId);

  const [editorKey, setEditorKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const [optionToDelete, setOptionToDelete] =
    useState<RatingOptionResult | null>(null);
  const [showRemoveAll, setShowRemoveAll] = useState(false);

  const [dirtyRows, setDirtyRows] = useState<Record<string, boolean>>({});

  const handleRowDirtyChange = useCallback(
    (optionId: string, isDirty: boolean) => {
      setDirtyRows((current) => {
        if (!!current[optionId] === isDirty) return current;
        const next = { ...current };
        if (isDirty) next[optionId] = true;
        else delete next[optionId];
        return next;
      });
    },
    [],
  );

  const options = data?.options ?? [];

  const sortedOptions = options
    .slice()
    .sort((a, b) =>
      reorderable
        ? a.displayOrder - b.displayOrder
        : a.label.localeCompare(b.label),
    );

  const hasCustomOptions = options.some((option) => option.groupId === groupId);

  const isToggling =
    setCustomOptions.isPending || removeCustomOptions.isPending;

  const hasOtherPendingWork =
    isAdding ||
    isEditing ||
    optionToDelete !== null ||
    showRemoveAll ||
    Object.keys(dirtyRows).length > 0 ||
    addCustomOption.isPending ||
    removeCustomOption.isPending ||
    updateCustomOption.isPending ||
    isToggling;

  const handleOpenEditor = () => {
    setEditorKey((key) => key + 1);
    setIsEditing(true);
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
      { onSuccess: handleResetAdding },
    );
  };

  const handleConfirmDelete = () => {
    if (!optionToDelete) return;

    removeCustomOption.mutate(optionToDelete.optionId, {
      onSuccess: () => setOptionToDelete(null),
    });
  };

  const handleRemoveCustomOptions = () => {
    removeCustomOptions.mutate(undefined, {
      onSuccess: () => setShowRemoveAll(false),
    });
  };

  return (
    <>
      <h2 className="fw-bold lead mb-1">{heading}</h2>
      <p className="text-muted small mb-3">{helperText}</p>

      <div className="mb-3 d-flex flex-wrap gap-2">
        {reorder.isReordering ? (
          <>
            <Button
              variant="primary"
              onClick={reorder.save}
              disabled={reorder.isSaving}
            >
              {reorder.isSaving ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Order"
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={reorder.cancel}
              disabled={reorder.isSaving}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
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
                onClick={
                  isEditing ? () => setIsEditing(false) : handleOpenEditor
                }
                disabled={isToggling}
                aria-expanded={isEditing}
              >
                {isEditing ? "Cancel" : "Set Custom Options"}
              </Button>
            )}
            {reorderable && hasCustomOptions && sortedOptions.length > 1 && (
              <Button
                variant="outline-secondary"
                onClick={() => reorder.start(sortedOptions)}
                disabled={hasOtherPendingWork}
                title={
                  hasOtherPendingWork
                    ? "Finish or cancel your other changes before reordering"
                    : undefined
                }
              >
                Reorder Options
              </Button>
            )}
          </>
        )}
      </div>

      <OptionEditorPanel
        key={editorKey}
        show={isEditing && !reorder.isReordering}
        heading={heading}
        groupId={groupId}
        initialLabels={
          sortedOptions.length > 0
            ? sortedOptions.map((option) => option.label)
            : [""]
        }
        setCustomOptions={setCustomOptions}
        onClose={() => setIsEditing(false)}
      />

      <TableStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={options.length === 0}
        loadingText={`Loading ${heading.toLowerCase()}...`}
        errorText={`Couldn't load ${heading.toLowerCase()}. Please try again.`}
        emptyText={`No ${heading.toLowerCase()} configured yet.`}
      >
        <Table
          striped="columns"
          className="align-middle border-top option-table"
        >
          <thead>
            <tr>
              <th>Options</th>
              {hasCustomOptions && !reorder.isReordering && (
                <th className="w-25 text-end option-actions-col">
                  <AddOptionControls
                    isAdding={isAdding}
                    canSave={newLabel.trim().length > 0}
                    isPending={addCustomOption.isPending}
                    onStart={handleStartAdding}
                    onReset={handleResetAdding}
                    onSave={handleSaveNewOption}
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {reorder.isReordering ? (
              <ReorderableOptionList
                items={reorder.items}
                sensors={reorder.sensors}
                disabled={reorder.isSaving}
                onDragEnd={reorder.handleDragEnd}
              />
            ) : (
              <>
                {isAdding && (
                  <tr>
                    <td className="text-break">
                      <Form.Control
                        type="text"
                        placeholder="New label"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        autoFocus
                        maxLength={30}
                      />
                    </td>
                    <td className="option-actions-col" />
                  </tr>
                )}
                {hasCustomOptions
                  ? sortedOptions.map((option) => (
                      <OptionRow
                        key={option.optionId}
                        option={option}
                        updateCustomOption={updateCustomOption}
                        onRequestDelete={setOptionToDelete}
                        onDirtyChange={handleRowDirtyChange}
                      />
                    ))
                  : sortedOptions.map((option) => (
                      <tr key={option.optionId}>
                        <td className="text-break">{option.label}</td>
                      </tr>
                    ))}
              </>
            )}
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

export default OptionConfiguration;
