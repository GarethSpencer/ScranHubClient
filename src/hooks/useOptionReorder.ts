import { useState } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useReorderRatingOptions } from "../api/controllerHooks/useOptionController";
import type RatingOptionResult from "../models/results/generic/RatingOptionResult";

const useOptionReorder = (
  controller: Parameters<typeof useReorderRatingOptions>[0],
  groupId: string,
) => {
  const reorderOptions = useReorderRatingOptions(controller, groupId);

  const [isReordering, setIsReordering] = useState(false);
  const [items, setItems] = useState<RatingOptionResult[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const start = (options: RatingOptionResult[]) => {
    setItems(options);
    setIsReordering(true);
  };

  const cancel = () => {
    setIsReordering(false);
    setItems([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((current) => {
      const oldIndex = current.findIndex((o) => o.optionId === active.id);
      const newIndex = current.findIndex((o) => o.optionId === over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const save = () => {
    reorderOptions.mutate(
      { groupId, optionsIds: items.map((o) => o.optionId) },
      { onSuccess: cancel },
    );
  };

  return {
    isReordering,
    items,
    sensors,
    isSaving: reorderOptions.isPending,
    start,
    cancel,
    save,
    handleDragEnd,
  };
};

export default useOptionReorder;
