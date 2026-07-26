import { useEffect, useRef, useState } from "react";
import Badge from "react-bootstrap/Badge";
import AnimatedCount from "../components/common/AnimatedCount";
import useCountAfterModalClose from "../hooks/useCountAfterModalClose";

const CLEARED_DURATION_MS = 700;

interface Props {
  count: number;
  label?: string;
  onCleared?: () => void;
}

const SectionTabBadge = ({ count, label, onCleared }: Props) => {
  const displayed = useCountAfterModalClose(count);

  const [clearedFrom, setClearedFrom] = useState<number | null>(null);

  const previousRef = useRef(displayed);
  const onClearedRef = useRef(onCleared);

  useEffect(() => {
    onClearedRef.current = onCleared;
  }, [onCleared]);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = displayed;

    if (previous <= 0 || displayed !== 0) return;

    setClearedFrom(previous);
    onClearedRef.current?.();

    const timeout = window.setTimeout(
      () => setClearedFrom(null),
      CLEARED_DURATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [displayed]);

  if (displayed === 0 && clearedFrom === null) return null;

  return (
    <Badge
      bg="danger"
      pill
      className={`section-tab-badge${
        clearedFrom === null ? "" : " section-tab-badge-cleared"
      }`}
    >
      <AnimatedCount value={clearedFrom ?? displayed} />
      {label && <span className="visually-hidden"> {label}</span>}
    </Badge>
  );
};

export default SectionTabBadge;
