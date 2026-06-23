import Form from "react-bootstrap/Form";
import { PAGE_SIZE_OPTIONS } from "./adminTableConstants";

interface Props {
  id: string;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

const TablePageSizeSelect = ({ id, pageSize, onPageSizeChange }: Props) => (
  <div className="position-absolute end-0 d-flex align-items-center gap-2">
    <Form.Label htmlFor={id} className="mb-0 text-nowrap">
      Show
    </Form.Label>
    <Form.Select
      id={id}
      value={pageSize}
      onChange={(e) => onPageSizeChange(Number(e.target.value))}
      style={{ width: "auto" }}
    >
      {PAGE_SIZE_OPTIONS.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </Form.Select>
  </div>
);

export default TablePageSizeSelect;
