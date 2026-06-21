import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type SensorDescriptor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableOptionRow from "./SortableOptionRow";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";

interface Props {
  items: RatingOptionResult[];
  sensors: SensorDescriptor<object>[];
  disabled?: boolean;
  onDragEnd: (event: DragEndEvent) => void;
}

const ReorderableOptionList = ({
  items,
  sensors,
  disabled = false,
  onDragEnd,
}: Props) => (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={onDragEnd}
  >
    <SortableContext
      items={items.map((option) => option.optionId)}
      strategy={verticalListSortingStrategy}
    >
      {items.map((option) => (
        <SortableOptionRow
          key={option.optionId}
          optionId={option.optionId}
          label={option.label}
          disabled={disabled}
        />
      ))}
    </SortableContext>
  </DndContext>
);

export default ReorderableOptionList;
