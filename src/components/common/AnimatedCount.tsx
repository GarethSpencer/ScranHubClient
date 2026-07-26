import { useState } from "react";

interface Props {
  value: number;
}

interface Outgoing {
  value: number;
  direction: "up" | "down";
}

const AnimatedCount = ({ value }: Props) => {
  const [current, setCurrent] = useState(value);
  const [outgoing, setOutgoing] = useState<Outgoing | null>(null);

  if (value !== current) {
    setOutgoing({ value: current, direction: value < current ? "down" : "up" });
    setCurrent(value);
  }

  return (
    <span
      className={`count-roll${
        outgoing ? ` count-roll-${outgoing.direction}` : ""
      }`}
    >
      {outgoing && (
        <span
          className="count-roll-out"
          aria-hidden="true"
          onAnimationEnd={() => setOutgoing(null)}
        >
          {outgoing.value}
        </span>
      )}
      <span key={current} className="count-roll-in">
        {current}
      </span>
    </span>
  );
};

export default AnimatedCount;
