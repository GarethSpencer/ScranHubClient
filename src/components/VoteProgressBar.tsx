import ProgressBar from "react-bootstrap/ProgressBar";

interface Props {
  count: number;
  total: number;
}

const VoteProgressBar = ({ count, total }: Props) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  const label = `${count} / ${total}`;

  return (
    <div className="rating-bar vote-bar mx-auto">
      <ProgressBar now={percent} />
      <span className="rating-bar-label" title={label} aria-hidden="true">
        {count}
      </span>
      <span className="visually-hidden">{`${count} of ${total} members voted`}</span>
    </div>
  );
};

export default VoteProgressBar;
