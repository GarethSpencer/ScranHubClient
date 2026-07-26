import { useCallback, useEffect, useRef, useState } from "react";

const useJustRated = (durationMs = 1600) => {
  const [justRatedId, setJustRatedId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const markJustRated = useCallback(
    (groupVenueId: string) => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);

      setJustRatedId(groupVenueId);
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        setJustRatedId(null);
      }, durationMs);
    },
    [durationMs],
  );

  return { justRatedId, markJustRated };
};

export default useJustRated;
