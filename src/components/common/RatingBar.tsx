import ProgressBar from "react-bootstrap/ProgressBar";
import type RatingOptionResult from "../../models/results/generic/RatingOptionResult";

interface Props {
  average?: number;
  options: RatingOptionResult[];
}

const variantForGoodness = (goodness: number) => {
  if (goodness > 2 / 3) return "success";
  if (goodness > 1 / 3) return "warning";
  return "danger";
};

const nearestLabel = (options: RatingOptionResult[], average: number) =>
  options.reduce((closest, option) =>
    Math.abs(option.displayOrder - average) <
    Math.abs(closest.displayOrder - average)
      ? option
      : closest,
  ).label;

const RatingBar = ({ average, options }: Props) => {
  if (average == null || options.length === 0) return <>—</>;

  const max = options.length;
  const goodness = max > 1 ? (max - average) / (max - 1) : 1;
  const percent = Math.round(goodness * 100);
  const label = nearestLabel(options, average);

  return (
    <div className="rating-bar mx-auto">
      <ProgressBar now={percent} variant={variantForGoodness(goodness)} />
      <span className="rating-bar-label" title={label} aria-hidden="true">
        {label}
      </span>
      <span className="visually-hidden">{`${label} (${average.toFixed(1)} out of ${max})`}</span>
    </div>
  );
};

export default RatingBar;
