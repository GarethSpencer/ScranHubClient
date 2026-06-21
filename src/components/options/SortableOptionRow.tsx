import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleDots2 } from "react-icons/rx";

interface Props {
  optionId: string;
  label: string;
  disabled?: boolean;
}

const SortableOptionRow = ({ optionId, label, disabled = false }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: optionId, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="text-break">
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-link p-0 text-secondary"
            style={{ cursor: disabled ? "default" : "grab", touchAction: "none" }}
            aria-label={`Drag ${label}`}
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <RxDragHandleDots2 size={22} />
          </button>
          {label}
        </div>
      </td>
    </tr>
  );
};

export default SortableOptionRow;
