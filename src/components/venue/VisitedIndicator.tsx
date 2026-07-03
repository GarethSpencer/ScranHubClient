import { FaCheck, FaXmark } from "react-icons/fa6";

interface Props {
  visited: boolean;
  visitedOn?: string;
  size?: number;
}

const formatVisitedOn = (visitedOn: string) => {
  const [year, month, day] = visitedOn.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
};

const VisitedIndicator = ({ visited, visitedOn, size }: Props) => {
  if (!visited) {
    return (
      <FaXmark
        className="text-danger flex-shrink-0"
        size={size}
        aria-label="Not visited"
        role="img"
      />
    );
  }

  return (
    <span className="venue-visited">
      <FaCheck
        className="text-success flex-shrink-0"
        size={size}
        aria-label="Visited"
        role="img"
      />
      {visitedOn && (
        <span className="venue-visited-date text-muted">
          ({formatVisitedOn(visitedOn)})
        </span>
      )}
    </span>
  );
};

export default VisitedIndicator;
