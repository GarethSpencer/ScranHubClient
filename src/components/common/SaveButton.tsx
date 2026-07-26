import Button, { type ButtonProps } from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import CheckMark from "./CheckMark";
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
        <CheckMark className="me-2" />
        {savedLabel}
      </>
    )}
    {status === "idle" && label}
  </Button>
);

export default SaveButton;
