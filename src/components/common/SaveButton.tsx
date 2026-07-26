import Button, { type ButtonProps } from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import type { SaveStatus } from "../../hooks/useSaveFeedback";

interface Props extends Omit<ButtonProps, "children"> {
  status: SaveStatus;
  label?: string;
  savingLabel?: string;
  savedLabel?: string;
}

const SaveButton = ({
  status,
  label = "Save Changes",
  savingLabel = "Saving...",
  savedLabel = "Saved!",
  variant = "primary",
  className,
  disabled,
  ...rest
}: Props) => (
  <Button
    {...rest}
    variant={variant}
    className={`save-button${status === "saved" ? " save-button-saved" : ""}${
      className ? ` ${className}` : ""
    }`}
    aria-live="polite"
    disabled={disabled || status !== "idle"}
  >
    {status === "saving" && (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        {savingLabel}
      </>
    )}
    {status === "saved" && (
      <>
        <svg
          className="save-button-check me-2"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path
            d="M4 12.5 L9.5 18 L20 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {savedLabel}
      </>
    )}
    {status === "idle" && label}
  </Button>
);

export default SaveButton;
