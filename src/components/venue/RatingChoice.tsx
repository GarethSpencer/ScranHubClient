import type { CSSProperties } from "react";
import CheckMark from "../common/CheckMark";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";

const goodnessFor = (index: number, count: number) =>
  count > 1 ? (count - 1 - index) / (count - 1) : 1;

const chipAccent = (goodness: number) =>
  goodness <= 0.5
    ? `color-mix(in oklab, var(--bs-danger), var(--bs-warning) ${goodness * 200}%)`
    : `color-mix(in oklab, var(--bs-warning), var(--bs-success) ${(goodness - 0.5) * 200}%)`;

interface Props {
  name: string;
  label: string;
  options: RatingOptionResult[];
  value: string;
  isSet: boolean;
  isLoading: boolean;
  disabled: boolean;
  onChange: (optionId: string) => void;
}

const RatingChoice = ({
  name,
  label,
  options,
  value,
  isSet,
  isLoading,
  disabled,
  onChange,
}: Props) => (
  <fieldset className="rating-choice" disabled={disabled}>
    <legend className="rating-choice-legend">
      {label}
      {isSet && !isLoading && (
        <CheckMark className="rating-choice-tick" size={16} />
      )}
    </legend>

    {isLoading ? (
      <p className="text-muted small mb-0">Loading...</p>
    ) : (
      <div className="rating-chip-group">
        {options.map((option, index) => (
          <label
            key={option.optionId}
            className="rating-chip rating-chip-scored"
            style={
              {
                "--chip-accent": chipAccent(goodnessFor(index, options.length)),
              } as CSSProperties
            }
          >
            <input
              type="radio"
              name={name}
              value={option.optionId}
              checked={value === option.optionId}
              onChange={() => onChange(option.optionId)}
            />
            <span className="rating-chip-label">{option.label}</span>
          </label>
        ))}
        <label className="rating-chip rating-chip-none">
          <input
            type="radio"
            name={name}
            value=""
            checked={isSet && value === ""}
            onChange={() => onChange("")}
          />
          <span className="rating-chip-label">No rating</span>
        </label>
      </div>
    )}
  </fieldset>
);

export default RatingChoice;
