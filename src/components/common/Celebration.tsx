import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const PIECE_COUNT = 30;

const COLOURS = [
  "#ad4242",
  "#7e57c2",
  "#dd7d60",
  "#6da6df",
  "#2a9d8f",
  "#b8860b",
];

const MAX_DELAY = 0.35;
const MIN_DURATION = 1.6;
const MAX_DURATION = 2.5;

const createPieces = () =>
  Array.from({ length: PIECE_COUNT }, (_, index) => {
    const size = 6 + Math.random() * 6;
    const isRound = Math.random() < 0.35;

    return {
      id: index,
      style: {
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${isRound ? size : size * 1.6}px`,
        borderRadius: isRound ? "50%" : "1px",
        backgroundColor: COLOURS[index % COLOURS.length],
        animationDelay: `${Math.random() * MAX_DELAY}s`,
        animationDuration: `${
          MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION)
        }s`,
        "--celebration-drift": `${(Math.random() * 2 - 1) * 18}vw`,
        "--celebration-spin": `${(Math.random() * 2 - 1) * 720}deg`,
      } as CSSProperties,
    };
  });

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CELEBRATION_VIBRATION = [12, 45, 12];

const vibrate = () => {
  if ("vibrate" in navigator) navigator.vibrate(CELEBRATION_VIBRATION);
};

interface Props {
  onDone: () => void;
}

const Celebration = ({ onDone }: Props) => {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [pieces] = useState(createPieces);

  useEffect(() => {
    if (!reducedMotion) vibrate();
  }, [reducedMotion]);

  useEffect(() => {
    const timeout = window.setTimeout(
      onDone,
      reducedMotion ? 0 : (MAX_DELAY + MAX_DURATION) * 1000,
    );
    return () => window.clearTimeout(timeout);
  }, [onDone, reducedMotion]);

  if (reducedMotion) return null;

  return createPortal(
    <div className="celebration" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="celebration-piece"
          style={piece.style}
        />
      ))}
    </div>,
    document.body,
  );
};

export default Celebration;
