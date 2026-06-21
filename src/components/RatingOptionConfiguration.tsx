import { useCallback, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TableStatus from "./TableStatus";
import ConfirmModal from "./ConfirmModal";
import OptionRow from "./options/OptionRow";
import SortableOptionRow from "./options/SortableOptionRow";
import OptionEditorPanel from "./options/OptionEditorPanel";
import AddOptionControls from "./options/AddOptionControls";
import {
  useAddCustomOption,
  useGetRatingOptionsForGroup,
  useRemoveCustomOption,
  useRemoveCustomOptions,
  useReorderRatingOptions,
  useSetCustomOptions,
  useUpdateCustomOption,
  type RatingOptionController,
} from "../api/controllerHooks/useOptionController";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

interface Props {
  controller: RatingOptionController;
  groupId: string;
  heading: string;
  helperText: string;
}

const RatingOptionConfiguration = ({
  controller,
  groupId,
  heading,
  helperText,
}: Props) => {
  const { data, isLoading, isError } = useGetRatingOptionsForGroup(
    controller,
    groupId,
  );

  const setCustomOptions = useSetCustomOptions(controller, groupId);
  const removeCustomOptions = useRemoveCustomOptions(controller, groupId);
  const addCustomOption = useAddCustomOption(controller, groupId);
  const removeCustomOption = useRemoveCustomOption(controller, groupId);
  const updateCustomOption = useUpdateCustomOption(controller, groupId);
  const reorderOptions = useReorderRatingOptions(controller, groupId);

  // Editor key is bumped each time the editor opens so it re-seeds its labels.
  const [editorKey, setEditorKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const [optionToDelete, setOptionToDelete] =
    useState<RatingOptionResult | null>(null);
  const [showRemoveAll, setShowRemoveAll] = useState(false);

  const [isReordering, setIsReordering] = useState(false);
  const [reorderItems, setReorderItems] = useState<RatingOptionResult[]>([]);

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
    .sort((a, b) => a.displayOrder - b.displayOrder);

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

  const isLockedForReorder = isReordering;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleStartReordering = () => {
    setReorderItems(sortedOptions);
    setIsReordering(true);
  };

  const handleCancelReordering = () => {
    setIsReordering(false);
    setReorderItems([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setReorderItems((current) => {
      const oldIndex = current.findIndex((o) => o.optionId === active.id);
      const newIndex = current.findIndex((o) => o.optionId === over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const handleSaveReordering = () => {
    reorderOptions.mutate(
      { groupId, optionsIds: reorderItems.map((o) => o.optionId) },
      { onSuccess: handleCancelReordering },
    );
  };

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
        {isReordering ? (
          <>
            <Button
              variant="primary"
              onClick={handleSaveReordering}
              disabled={reorderOptions.isPending}
            >
              {reorderOptions.isPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Order"
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleCancelReordering}
              disabled={reorderOptions.isPending}
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
            {hasCustomOptions && sortedOptions.length > 1 && (
              <Button
                variant="outline-secondary"
                onClick={handleStartReordering}
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
        show={isEditing && !isLockedForReorder}
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
              {hasCustomOptions && !isReordering && (
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
            {isReordering ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={reorderItems.map((option) => option.optionId)}
                  strategy={verticalListSortingStrategy}
                >
                  {reorderItems.map((option) => (
                    <SortableOptionRow
                      key={option.optionId}
                      optionId={option.optionId}
                      label={option.label}
                      disabled={reorderOptions.isPending}
                    />
                  ))}
                </SortableContext>
              </DndContext>
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

export default RatingOptionConfiguration;
