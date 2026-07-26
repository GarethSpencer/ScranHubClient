import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

const useSaveFeedback = (holdMs = 900) => {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<number | null>(null);

  const clearHold = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearHold, [clearHold]);

  const save = useCallback(
    async (run: () => Promise<unknown>, onSaved?: () => void) => {
      if (status !== "idle") return;

      clearHold();
      setStatus("saving");

      try {
        await run();
      } catch {
        setStatus("idle");
        return;
      }

      setStatus("saved");
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        onSaved?.();
      }, holdMs);
    },
    [clearHold, holdMs, status],
  );

  const reset = useCallback(() => {
    clearHold();
    setStatus("idle");
  }, [clearHold]);

  return {
    status,
    isSaving: status === "saving",
    isBusy: status !== "idle",
    save,
    reset,
  };
};

export default useSaveFeedback;
