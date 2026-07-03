import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaSortUp, FaSortDown } from "react-icons/fa";

interface SortOption<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  id: string;
  options: SortOption<T>[];
  sortBy: T;
  sortDescending: boolean;
  onSortByChange: (value: T) => void;
  onToggleDirection: () => void;
}

const MobileSortControl = <T extends string>({
  id,
  options,
  sortBy,
  sortDescending,
  onSortByChange,
  onToggleDirection,
}: Props<T>) => (
  <div className="d-flex align-items-end gap-2 mb-3">
    <Form.Group className="flex-grow-1" controlId={id}>
      <Form.Label className="mb-1 small text-muted">Sort by</Form.Label>
      <Form.Select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
    <Button
      variant="outline-secondary"
      onClick={onToggleDirection}
      aria-label={
        sortDescending ? "Sort ascending instead" : "Sort descending instead"
      }
      title={sortDescending ? "Descending" : "Ascending"}
    >
      {sortDescending ? <FaSortDown /> : <FaSortUp />}
    </Button>
  </div>
);

export default MobileSortControl;
