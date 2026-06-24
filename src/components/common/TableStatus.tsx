import Spinner from "react-bootstrap/Spinner";
import type { ReactNode } from "react";

interface Props {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
  children: ReactNode;
}

const TableStatus = ({
  isLoading,
  isError,
  isEmpty,
  loadingText = "Loading…",
  errorText = "Couldn't load this list. Please try again.",
  emptyText = "Nothing to show here",
  children,
}: Props) => {
  if (isLoading)
    return (
      <div className="d-flex align-items-center justify-content-center gap-2 py-3">
        <Spinner animation="border" role="status" aria-hidden="true" />
        <span>{loadingText}</span>
      </div>
    );

  if (isError) return <p className="text-muted text-center mb-0">{errorText}</p>;

  if (isEmpty) return <p className="text-center mb-0">{emptyText}</p>;

  return <>{children}</>;
};

export default TableStatus;
